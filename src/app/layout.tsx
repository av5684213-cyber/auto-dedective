import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0f2a48",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "OtoDedektif - Yapay Zeka Destekli Araç Takip Platformu",
  description: "Türkiye genelindeki tüm ikinci el ve sıfır araç ilanlarını tek platformda toplayan, yapay zeka destekli akıllı araç takip ve analiz uygulaması.",
  keywords: ["OtoDedektif", "ikinci el araç", "araç takip", "yapay zeka", "ilan bildirim", "fırsat araç", "sahte ilan tespiti"],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32" },
      { url: "/icon-48x48.png", sizes: "48x48" },
    ],
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc] text-slate-900`}
      >
        <AuthProvider>
          <Navbar />
          <main className="pt-14">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
