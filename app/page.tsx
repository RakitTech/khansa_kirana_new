import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import WhySection from "@/components/sections/WhySection";
import CollectionSection from "@/components/sections/CollectionSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import OutletSection from "@/components/sections/OutletSection";
import FooterSection from "@/components/sections/FooterSection";
import { dbGetStoreProfile } from "@/lib/server-db/store-profile";
import { dbGetTestimonials } from "@/lib/server-db/testimonials";
import { dbGetProducts } from "@/lib/server-db/products";
import type { StoreProfile, Testimonial, Product } from "@/lib/types";

async function fetchData(): Promise<{
  profile: StoreProfile | null;
  testimonials: Testimonial[];
  products: Product[];
}> {
  const [profile, testimonials, products] = await Promise.all([
    dbGetStoreProfile().catch(() => null),
    dbGetTestimonials(true).catch(() => []),
    dbGetProducts({ showInGallery: true, isAvailable: true }).catch(() => []),
  ]);
  return { profile, testimonials, products };
}

export default async function HomePage() {
  const { profile, testimonials, products } = await fetchData();

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      <Navbar profile={profile} />
      <HeroSection profile={profile} />
      <WhySection />
      <CollectionSection products={products} />
      <TestimonialSection testimonials={testimonials} />
      <OutletSection profile={profile} />
      <FooterSection profile={profile} />
    </main>
  );
}
