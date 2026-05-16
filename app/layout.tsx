import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
