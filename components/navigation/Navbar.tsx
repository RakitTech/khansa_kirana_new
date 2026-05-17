"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { StoreProfile } from "@/lib/types";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  profile?: StoreProfile | null;
}

const navLinks = [
  { href: "/", label: "BERANDA" },
  { href: "/katalog", label: "KATALOG" },
  { href: "/#outlet", label: "OUTLET" },
];

function SocialIcon({ type }: { type: "instagram" | "facebook" }) {
  if (type === "instagram") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Navbar({ profile }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = profile?.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-black/40 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand-light italic hover:text-brand-muted transition-colors">
          {profile?.storeName ?? "Khansa Kirana Collection"}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] tracking-[0.2em] font-bold text-gray-400">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-light transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-brand-dark px-7 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] hover:bg-brand-muted hover:text-black transition-all"
          >
            PESAN SEKARANG
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/95 pt-28 px-10 flex flex-col gap-8"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-serif text-brand-light hover:text-brand-muted transition-colors"
              >
                {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
              </Link>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-serif text-brand-light hover:text-brand-muted transition-colors"
            >
              Pesan Sekarang
            </a>
            <div className="mt-auto pb-12 flex gap-6 text-gray-500">
              {profile?.instagramUrl && (
                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors">
                  <SocialIcon type="instagram" />
                </a>
              )}
              {profile?.facebookUrl && (
                <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors">
                  <SocialIcon type="facebook" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
