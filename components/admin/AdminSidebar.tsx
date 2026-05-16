"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare,
  Store, Users, Map, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { logout } from "@/lib/api/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquare },
  { href: "/admin/catalog-provinces", label: "Katalog Provinsi", icon: Map },
  { href: "/admin/store-profile", label: "Profil Toko", icon: Store },
  { href: "/admin/users", label: "Admin Users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 min-h-screen bg-[#111111] border-r border-white/5 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/5">
        <Link href="/" className="font-serif text-lg font-bold italic text-brand-light hover:text-brand-muted transition-colors">
          Khansa Kirana
        </Link>
        <p className="text-[9px] tracking-[0.25em] text-gray-600 mt-0.5 uppercase">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-brand-dark/40 text-brand-light border border-brand-muted/20"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <Icon size={16} className={active ? "text-brand-light" : "text-gray-600 group-hover:text-gray-400"} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={12} className="text-brand-muted" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-gray-200 transition-all"
        >
          <Settings size={16} className="text-gray-600" />
          Pengaturan
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-all"
        >
          <LogOut size={16} className="text-gray-600" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
