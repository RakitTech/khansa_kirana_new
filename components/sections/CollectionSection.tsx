"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";

interface CollectionSectionProps {
  products: Product[];
}

export default function CollectionSection({ products }: CollectionSectionProps) {
  const featured = products.slice(0, 6);

  return (
    <section id="koleksi" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16"
        >
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-light block mb-3">
              KOLEKSI UNGGULAN
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-light italic">
              Temukan Busana <br /> Impian Anda
            </h2>
          </div>
          <Link
            href="/katalog"
            className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gray-400 hover:text-brand-light transition-colors group"
          >
            LIHAT SEMUA KOLEKSI
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-light/20">
                    <span className="font-serif text-6xl italic">K</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-brand-muted uppercase">
                    {product.province}
                  </span>
                  <h3 className="font-serif font-bold text-brand-light text-lg italic mt-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">
            <p className="font-serif text-2xl italic">Koleksi segera hadir</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-brand-light/40 px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] text-gray-300 hover:text-brand-light transition-all"
          >
            LIHAT SEMUA KOLEKSI <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
