import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Khansa Kirana Collection — Penyewaan Baju Adat Nusantara",
  description:
    "Penyewaan Baju Adat & Tari Nusantara terlengkap di Bekasi (Galaxy). Temukan koleksi mahakarya untuk moment berharga Anda.",
  keywords: "sewa baju adat, baju adat bekasi, penyewaan kostum tradisional, khansa kirana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kk-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
