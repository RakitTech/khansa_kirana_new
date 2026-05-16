"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import type { StoreProfile } from "@/lib/types";

interface OutletSectionProps {
  profile?: StoreProfile | null;
}

export default function OutletSection({ profile }: OutletSectionProps) {
  const address = profile?.address ?? "Ruko Grand Galaxy City, Blok RSN No. 8, Bekasi Selatan";
  const phone = profile?.phone ?? "-";
  const hours = profile?.operationalHours ?? "Senin - Sabtu: 09.00 - 18.00 WIB";
  const gmapsUrl = profile?.gmapsLink ?? "#";

  const infoCards = [
    { icon: <MapPin size={20} />, label: "Alamat", value: address },
    { icon: <Phone size={20} />, label: "Hubungi Kami", value: phone },
    { icon: <Clock size={20} />, label: "Jam Operasional", value: hours },
  ];

  const mapsEmbedUrl = profile?.latitude && profile?.longitude
    ? `https://maps.google.com/maps?q=${profile.latitude},${profile.longitude}&z=16&output=embed`
    : null;

  return (
    <section id="outlet" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Info */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-bold tracking-[0.3em] text-brand-light block mb-4">
                LOKASI KAMI
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-light italic mb-6 leading-tight">
                Kunjungi Outlet <br /> Kami
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Kami berlokasi di kawasan strategis Galaxy, Bekasi. Datang dan coba langsung
                koleksi kami di butik yang nyaman dengan pelayanan profesional.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              {infoCards.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-dark/30 flex items-center justify-center text-brand-light flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                      {item.label}
                    </span>
                    <p className="text-sm font-medium text-gray-300 mt-0.5">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {gmapsUrl !== "#" && (
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all w-fit"
              >
                <MapPin size={14} /> BUKA DI GOOGLE MAPS
              </a>
            )}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 h-[500px] bg-white/5 rounded-[40px] overflow-hidden border border-white/10 relative"
          >
            {mapsEmbedUrl ? (
              <iframe
                src={mapsEmbedUrl}
                className="w-full h-full"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <>
                <div className="w-full h-full bg-gradient-to-br from-brand-dark/20 to-black" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center text-brand-light animate-bounce mb-4">
                    <MapPin size={32} />
                  </div>
                  <h4 className="font-serif text-xl italic text-brand-light mb-2">Galaxy, Bekasi</h4>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Kunjungi kami di Ruko Grand Galaxy City, Bekasi Selatan.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
