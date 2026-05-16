import Link from "next/link";
import type { StoreProfile } from "@/lib/types";

interface FooterSectionProps {
  profile?: StoreProfile | null;
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function FooterSection({ profile }: FooterSectionProps) {
  const socials = [
    { href: profile?.instagramUrl, Icon: InstagramIcon, label: "Instagram" },
    { href: profile?.facebookUrl, Icon: FacebookIcon, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <Link href="/" className="font-serif text-2xl font-bold italic text-brand-light hover:text-brand-muted transition-colors">
          {profile?.storeName ?? "Khansa Kirana Collection"}
        </Link>

        {socials.length > 0 && (
          <div className="flex gap-6">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-light hover:text-black transition-all text-gray-400"
              >
                <Icon />
              </a>
            ))}
          </div>
        )}

        <nav className="flex flex-wrap justify-center gap-8 text-[10px] tracking-[0.2em] font-bold text-gray-600">
          <Link href="/" className="hover:text-brand-light transition-colors">BERANDA</Link>
          <Link href="/katalog" className="hover:text-brand-light transition-colors">KATALOG</Link>
          <Link href="/#outlet" className="hover:text-brand-light transition-colors">OUTLET</Link>
        </nav>

        <div className="text-center">
          <p className="text-[10px] tracking-[0.4em] font-medium text-gray-600 mb-2 uppercase">
            Copyright © {new Date().getFullYear()} {profile?.storeName ?? "Khansa Kirana Collection"}. All Rights Reserved.
          </p>
          <p className="text-[9px] tracking-[0.2em] font-bold text-gray-800">POWERED BY DVTECH</p>
        </div>
      </div>
    </footer>
  );
}
