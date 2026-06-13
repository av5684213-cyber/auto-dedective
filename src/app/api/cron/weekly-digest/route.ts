// ─── Cron: Haftalık Özet ───
// Kullanıcının takip ettiği segmentteki yeni fırsatları özetleyen e-posta gövdesi üretir.
// TODO: Gerçek e-posta gönderim entegrasyonu

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Tüm aktif aramaların bildirimlerini topla
    const searches = await db.savedSearch.findMany({
      where: { isActive: true },
      include: {
        // AlertNotification has alertId which maps to AlertFilter, not SavedSearch
        // So we just report search status
      },
    });

    // Son 7 gündeki bildirimleri al (AlertNotification üzerinden)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentNotifs = await db.alertNotification.findMany({
      where: { foundAt: { gte: weekAgo }, isRead: false },
      orderBy: { foundAt: "desc" },
      take: 50,
    });

    // E-posta gövdesi oluştur
    const digestLines: string[] = [
      "OtoDedektif Haftalık Özet",
      "========================",
      "",
      `Aktif arama sayısı: ${searches.length}`,
      `Son 7 gündeki yeni bildirim: ${recentNotifs.length}`,
      "",
    ];

    if (recentNotifs.length > 0) {
      digestLines.push("Yeni Fırsatlar:");
      for (const n of recentNotifs.slice(0, 20)) {
        digestLines.push(`- ${n.title} | ${n.price || 'Fiyat belirtilmemiş'} | ${n.source}`);
        digestLines.push(`  ${n.url}`);
      }
    } else {
      digestLines.push("Bu hafta yeni fırsat tespit edilmedi.");
    }

    digestLines.push("");
    digestLines.push("OtoDedektif ile güvenli alışverişler!");

    const emailBody = digestLines.join("\n");

    // TODO: Gerçek e-posta gönderimi (Resend, SendGrid, vb.)
    // Şimdilik sadece gövde metnini döndür
    return NextResponse.json({
      success: true,
      emailBody,
      totalNotifications: recentNotifs.length,
      activeSearches: searches.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
