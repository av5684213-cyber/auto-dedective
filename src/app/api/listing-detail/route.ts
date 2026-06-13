import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { withTimeout } from "@/lib/ai";

export const dynamic = "force-dynamic";

interface ContactInfo {
  phone: string[];
  address: string;
  sellerName: string;
  sellerType: string;
  email: string;
  website: string;
  location: string;
  workingHours: string;
}

function extractPhones(text: string): string[] {
  const phones = new Set<string>();
  const patterns = [
    /0\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/g,
    /0\s*5\d{2}\s*[\s.-]?\s*\d{3}\s*[\s.-]?\s*\d{2}\s*[\s.-]?\s*\d{2}/g,
    /\+90\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/g,
    /\+90\s*5\d{2}\s*[\s.-]?\s*\d{3}\s*[\s.-]?\s*\d{2}\s*[\s.-]?\s*\d{2}/g,
    /5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/g,
    /0\s*2\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/g,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const m of matches) {
        const cleaned = m.replace(/[\s.-]/g, "");
        if (cleaned.length >= 10 && cleaned.length <= 13) {
          phones.add(m.trim());
        }
      }
    }
  }
  return [...phones];
}

function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? [...new Set(matches)] : [];
}

function extractAddress(text: string): string {
  const cityPatterns = [
    /(?:adres|adresi|konum)[:\s]*([^\n.,]{10,80})/i,
    /(?:İstanbul|Ankara|İzmir|Bursa|Antalya|Kocaeli|Gaziantep|Konya|Adana|Sakarya|Mersin|Kayseri|Eskişehir|Muğla|Denizli|Kütahya|Tekirdağ|Manisa|Balıkesir|Aydın|Hatay|Samsun|Trabzon|Ordu|Malatya|Erzurum|Diyarbakır|Urfa|Van|Elazığ|Sivas|Tokat|Kars|Isparta|Uşak|Edirne|Çanakkale|Bolu|Burdur|Bilecik|Sinop|Çorum|Amasya|Kırıkkale|Kırşehir|Niğde|Aksaray|Nevşehir|Yozgat|Karaman|Batman|Kilis|Osmaniye)[,/]\s*[^\n,;]{3,40}/gi,
  ];
  for (const pattern of cityPatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return "";
}

function extractSellerInfo(text: string): { name: string; type: string } {
  let name = "";
  let type = "Bireysel";

  const namePatterns = [
    /(?:Satıcı|Galeri|Bayi|Yetkili)\s*[:\-]\s*([^\n,;]{3,50})/i,
    /((?:Galeri|Oto|Otomotiv|Motor|Araç)\s+\w+(?:\s+\w+)?)/gi,
    /([A-Z][a-z]+\s+(?:Oto|Otomotiv|Motor|Araç|Galeri))/g,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      name = match[0].trim();
      break;
    }
  }

  if (/galeri/i.test(text) || /bayi/i.test(text)) {
    type = "Galeri/Bayi";
  } else if (/bireysel|sahibinden/i.test(text)) {
    type = "Bireysel";
  }

  return { name, type };
}

function extractLocation(text: string): string {
  const patterns = [
    /(?:konum|locasyon|yer|ilçe|semt)[:\s]*([^\n]{5,50})/i,
    /(?:İstanbul|Ankara|İzmir)[,/]\s*\w+(?:[,/]\s*\w+)*/gi,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return "";
}

function isCloudflareBlock(text: string): boolean {
  return /just a moment|cloudflare|security verification|verifies you are not a bot/i.test(text);
}

const EMPTY_CONTACT: ContactInfo = {
  phone: [], address: "", sellerName: "", sellerType: "Bireysel",
  email: "", website: "", location: "", workingHours: "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;
    const searchTitle = body.title || "";

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL gereklidir" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();
    let allText = "";
    let pageTitle = "";

    // Strategy 1: Try page_reader with timeout
    try {
      const result = await withTimeout(
        zai.functions.invoke("page_reader", { url }),
        14000,
        null
      );
      if (result?.data?.html) {
        const pageText = result.data.html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
        pageTitle = result.data.title || "";

        if (!isCloudflareBlock(pageText)) {
          allText = pageText;
        }
      }
    } catch (err) {
      console.error("Page reader error:", err);
    }

    // Strategy 2: Web search fallback with timeout
    if (!allText || allText.length < 50) {
      try {
        const hostName = new URL(url).hostname.replace("www.", "");
        const searchQueries = [
          `${searchTitle || url} telefon iletişim adres satıcı`,
          `site:${hostName} ${searchTitle} telefon`,
        ];

        for (const query of searchQueries) {
          const searchResults = await withTimeout(
            zai.functions.invoke("web_search", { query, num: 10 }),
            14000,
            null
          );

          if (Array.isArray(searchResults) && searchResults.length > 0) {
            const snippets = searchResults
              .map((r: { name?: string; snippet?: string }) => `${r.name || ""} ${r.snippet || ""}`)
              .join(" ");
            allText += " " + snippets;

            const relevantResult = searchResults.find(
              (r: { url?: string }) => r.url && r.url.includes(hostName)
            );
            if (relevantResult?.url && relevantResult.url !== url) {
              try {
                const detailResult = await withTimeout(
                  zai.functions.invoke("page_reader", { url: relevantResult.url }),
                  14000,
                  null
                );
                if (detailResult?.data?.html) {
                  const detailText = detailResult.data.html
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                    .replace(/<[^>]*>/g, " ")
                    .replace(/&nbsp;/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
                  if (!isCloudflareBlock(detailText)) {
                    allText += " " + detailText;
                  }
                }
              } catch {
                // Skip if detail page also blocked
              }
            }
            break;
          }
        }
      } catch (err) {
        console.error("Search fallback error:", err);
      }
    }

    // Strategy 3: General search with timeout
    if (!allText || extractPhones(allText).length === 0) {
      try {
        const brandMatch = (searchTitle || url).match(
          /(toyota|honda|bmw|mercedes|volkswagen|audi|hyundai|kia|renault|fiat|ford|skoda|peugeot|citroen|opel|nissan|mazda|volvo|seat|dacia|suzuki)/i
        );
        const cityMatch = (searchTitle || allText).match(
          /(İstanbul|Ankara|İzmir|Bursa|Antalya|Kocaeli|Konya|Adana|Mersin|Gaziantep)/i
        );

        if (brandMatch || cityMatch) {
          const generalQuery = `${brandMatch?.[1] || ""} ${cityMatch?.[1] || ""} ikinci el galeri bayi telefon iletişim`.trim();
          const generalResults = await withTimeout(
            zai.functions.invoke("web_search", { query: generalQuery, num: 5 }),
            14000,
            null
          );

          if (Array.isArray(generalResults)) {
            allText +=
              " " +
              generalResults
                .map((r: { name?: string; snippet?: string }) => `${r.name || ""} ${r.snippet || ""}`)
                .join(" ");
          }
        }
      } catch {
        // Skip
      }
    }

    // Extract all contact info
    const phones = extractPhones(allText);
    const emails = extractEmails(allText);
    const address = extractAddress(allText);
    const sellerInfo = extractSellerInfo(allText);
    const location = extractLocation(allText);

    const contactInfo: ContactInfo = {
      phone: phones.slice(0, 5),
      address: address,
      sellerName: sellerInfo.name,
      sellerType: sellerInfo.type,
      email: emails.length > 0 ? emails[0] : "",
      website: url,
      location: location,
      workingHours: "",
    };

    const hasContact =
      phones.length > 0 ||
      address !== "" ||
      sellerInfo.name !== "" ||
      emails.length > 0 ||
      location !== "";

    return NextResponse.json({
      success: true,
      url: url,
      title: pageTitle,
      contact: contactInfo,
      hasContact: hasContact,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "İletişim bilgisi alınamadı";
    console.error("Listing detail API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: msg,
        contact: EMPTY_CONTACT,
        hasContact: false,
      },
      { status: 500 }
    );
  }
}
