"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section id="testimoni" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-brand-light block mb-4">
            TESTIMONI PELANGGAN
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-light italic mb-6">
            Apa Kata Mereka Tentang <br /> Layanan Kami
          </h2>
          <p className="text-gray-500 text-xs italic">
            Geser ke kanan untuk melihat testimoni lainnya.
          </p>
        </motion.div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-12 snap-x px-4 no-scrollbar max-w-7xl mx-auto">
        {items.map((t, idx) => (
          <motion.div
            key={t.id ?? idx}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="snap-center flex-shrink-0"
          >
            <div className="min-w-[320px] md:min-w-[400px] bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-lg">
              <div className="flex gap-1 text-brand-light mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="italic text-gray-300 leading-relaxed mb-10 text-lg">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-dark/50 flex items-center justify-center text-brand-light font-bold font-serif text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-brand-light">{t.name}</h4>
                  <p className="text-[10px] tracking-widest text-gray-500 uppercase">{t.occasion}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1", name: "Siti Rahayu", occasion: "Pernikahan Adat Jawa",
    review: "Kebaya yang saya sewa sangat cantik dan sesuai ekspektasi. Pelayanan ramah dan pengiriman tepat waktu!",
    rating: 5, isActive: true, sortOrder: 1, createdAt: "", updatedAt: "",
  },
  {
    id: "2", name: "Dewi Lestari", occasion: "Wisuda Universitas",
    review: "Baju adatnya bagus sekali, bahan nyaman dipakai seharian. Pasti akan sewa lagi untuk acara berikutnya.",
    rating: 5, isActive: true, sortOrder: 2, createdAt: "", updatedAt: "",
  },
  {
    id: "3", name: "Andini Putri", occasion: "Acara Kartinian",
    review: "Koleksinya sangat lengkap dan pilihannya variatif. Recomended banget buat yang cari baju adat di Bekasi.",
    rating: 5, isActive: true, sortOrder: 3, createdAt: "", updatedAt: "",
  },
];
