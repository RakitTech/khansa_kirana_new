"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { StoreProfile } from "@/lib/types";

interface HeroSectionProps {
  profile?: StoreProfile | null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const heroImages = profile?.heroImages?.length ? profile.heroImages : [];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => setCurrentImage((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const whatsappUrl = profile?.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <section id="hero" className="pt-28 min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="text-[30vw] font-serif font-black italic tracking-tighter mix-blend-overlay select-none">
          KIRANA
        </h1>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center py-16">
        {/* Left Content */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block px-4 py-1.5 bg-brand-dark/30 text-brand-light text-[10px] tracking-[0.3em] font-bold rounded-sm mb-6 border border-brand-light/10 uppercase">
              {profile?.storeName ?? "Khansa Kirana Collections"}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-6 text-brand-light">
              Keanggunan Budaya <br />
              <span className="italic font-normal">di Setiap Langkah Anda</span>
            </h1>
            <p className="text-brand-muted/80 text-sm md:text-base max-w-md leading-relaxed">
              Penyewaan Baju Adat & Tari Nusantara terlengkap di Bekasi (Galaxy). Temukan
              koleksi mahakarya untuk moment berharga Anda.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-dark hover:bg-brand-muted hover:text-black px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all flex items-center gap-2"
            >
              PESAN SEKARANG <ArrowRight size={14} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/10 hover:border-brand-light/50 px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all flex items-center gap-2 text-gray-300"
            >
              <MessageCircle size={14} className="text-green-500" /> TANYA VIA WHATSAPP
            </a>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="md:col-span-7 relative flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full max-w-[600px] aspect-[4/5] bg-white/5 rounded-[40px] overflow-hidden border border-white/10"
          >
            {heroImages.length > 0 ? (
              heroImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Hero ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-600">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="font-serif text-4xl text-brand-light/30 italic">K</span>
                </div>
                <p className="text-xs tracking-[0.3em] font-medium text-brand-light/30">KHANSA KIRANA</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Dot indicators */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentImage ? "bg-brand-light w-4" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Accent text */}
          <div className="absolute -bottom-6 -left-10 z-20 pointer-events-none hidden md:block">
            <span className="font-accent text-7xl md:text-9xl text-brand-light opacity-60 drop-shadow-2xl">
              KhansaKirana
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
