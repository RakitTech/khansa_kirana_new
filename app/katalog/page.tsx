import CatalogPageClient from "./CatalogPageClient";
import Navbar from "@/components/navigation/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { dbGetStoreProfile } from "@/lib/server-db/store-profile";
import { dbGetCatalogProvinces, dbGetIslandGroups } from "@/lib/server-db/catalog";
import { dbGetProducts } from "@/lib/server-db/products";

export const metadata = {
  title: "Katalog — Khansa Kirana Collection",
  description: "Temukan koleksi busana adat Nusantara lengkap dari berbagai provinsi di Indonesia.",
};

export default async function KatalogPage() {
  const [profile, provinces, islands, products] = await Promise.all([
    dbGetStoreProfile().catch(() => null),
    dbGetCatalogProvinces(true).catch(() => []),
    dbGetIslandGroups().catch(() => []),
    dbGetProducts({ isAvailable: true }).catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      <Navbar profile={profile} />
      <CatalogPageClient
        provinces={provinces}
        islands={islands}
        initialProducts={products}
      />
      <FooterSection profile={profile} />
    </main>
  );
}
