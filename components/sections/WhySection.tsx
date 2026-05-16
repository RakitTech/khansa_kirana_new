"use client";

import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";

const tiers = [
  { title: "Aksesoris", price: "50.000", icon: <Star size={20} />, desc: "Perhiasan, mahkota, selendang, dan aksesoris pelengkap busana adat." },
  { title: "Atasan / Bawahan", price: "75.000", icon: <ShoppingBag size={20} />, desc: "Kebaya, beskap, kain batik, dan pakaian adat bagian atas atau bawah." },
  { title: "Fullset", price: "150.000", icon: <ShoppingBag size={20} />, desc: "Paket lengkap busana adat dari atas hingga bawah beserta aksesoris." },
];

export default function WhySection() {
  return (
    <section id="why" className="py-32 px-6 bg-[#121212]/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-light mb-4 italic">
              Kenapa Khansa Kirana?
            </h2>
            <p className="text-gray-500 max-w-lg">
              Dedikasi kami untuk melestarikan warisan budaya melalui detail yang sempurna.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-right"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-light block mb-2">
              PENAWARAN TERBAIK
            </span>
            <p className="font-serif text-2xl md:text-3xl font-bold text-brand-muted italic">
              Harga Sewa Mulai Dari Rp. 75.000
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-sm group hover:border-brand-muted/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-brand-dark/30 flex items-center justify-center text-brand-light mb-8 group-hover:bg-brand-light group-hover:text-black transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 italic text-brand-light">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-3">Mulai dari Rp. {item.price}</p>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
