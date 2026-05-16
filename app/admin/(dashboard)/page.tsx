"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, MessageSquare, TrendingUp, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getProducts } from "@/lib/api/products";
import { getOrders } from "@/lib/api/orders";
import { getTestimonials } from "@/lib/api/testimonials";

interface Stats {
  products: number;
  orders: number;
  testimonials: number;
  pendingOrders: number;
}

const quickLinks = [
  { href: "/admin/products", label: "Kelola Produk", icon: Package, color: "from-amber-900/30 to-amber-800/10" },
  { href: "/admin/orders", label: "Kelola Pesanan", icon: ShoppingCart, color: "from-blue-900/30 to-blue-800/10" },
  { href: "/admin/testimonials", label: "Kelola Testimoni", icon: MessageSquare, color: "from-purple-900/30 to-purple-800/10" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, testimonials: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, orders, testimonials] = await Promise.all([
        getProducts().catch(() => []),
        getOrders().catch(() => []),
        getTestimonials(false).catch(() => []),
      ]);
      setStats({
        products: products.length,
        orders: orders.length,
        testimonials: testimonials.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
      });
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Produk", value: stats.products, icon: Package, href: "/admin/products" },
    { label: "Total Pesanan", value: stats.orders, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Testimoni", value: stats.testimonials, icon: MessageSquare, href: "/admin/testimonials" },
    { label: "Pesanan Pending", value: stats.pendingOrders, icon: Clock, href: "/admin/orders" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-serif font-bold italic text-brand-light mb-2">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-500 text-sm">Ini adalah ringkasan aktivitas toko Anda.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <Link
                  href={card.href}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-muted/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-dark/40 flex items-center justify-center text-brand-light group-hover:bg-brand-dark transition-colors">
                      <Icon size={18} />
                    </div>
                    <TrendingUp size={14} className="text-gray-700" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-white/10 rounded animate-pulse mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-brand-light mb-1">{card.value}</p>
                  )}
                  <p className="text-xs text-gray-500">{card.label}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-xs font-bold tracking-[0.25em] text-gray-500 mb-5">AKSI CEPAT</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickLinks.map(({ href, label, icon: Icon, color }, idx) => (
              <Link
                key={idx}
                href={href}
                className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-6 hover:border-brand-muted/30 transition-all group flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-light">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-300">{label}</span>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-brand-light group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
