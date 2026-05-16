"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, X, CheckCircle, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getOrders, updateOrderStatus, updateOrderPayment } from "@/lib/api/orders";
import type { Order, OrderStatus, RentalStatus, PaymentStatus } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-900/30 text-yellow-400",
  confirmed: "bg-green-900/30 text-green-400",
  cancelled: "bg-red-900/30 text-red-400",
  booked: "bg-blue-900/30 text-blue-400",
  handed_over: "bg-purple-900/30 text-purple-400",
  returned: "bg-green-900/30 text-green-400",
  overdue: "bg-red-900/30 text-red-400",
  unpaid: "bg-red-900/30 text-red-400",
  partial: "bg-yellow-900/30 text-yellow-400",
  paid: "bg-green-900/30 text-green-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter || o.rentalStatus === statusFilter || o.paymentStatus === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.customerName.toLowerCase().includes(q) || o.orderCode.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [search, statusFilter, orders]);

  async function loadOrders() {
    setLoading(true);
    const data = await getOrders().catch(() => []);
    setOrders(data);
    setFiltered(data);
    setLoading(false);
  }

  async function handleStatusUpdate(id: string, payload: Parameters<typeof updateOrderStatus>[1]) {
    await updateOrderStatus(id, payload).catch(() => alert("Gagal update status."));
    await loadOrders();
    setSelected(null);
  }

  async function handlePayment(id: string, paymentStatus: PaymentStatus, paidAmount: number) {
    await updateOrderPayment(id, { paymentStatus, paidAmount }).catch(() => alert("Gagal update pembayaran."));
    await loadOrders();
    setSelected(null);
  }

  const filterTabs = ["all", "pending", "confirmed", "booked", "handed_over", "returned"];

  return (
    <>
      <AdminHeader title="Manajemen Pesanan" />
      <div className="flex-1 overflow-y-auto p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama / kode pesanan..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-muted/50"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] border transition-all ${
                statusFilter === tab ? "bg-brand-dark border-brand-muted/50 text-brand-light" : "border-white/10 text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab === "all" ? "SEMUA" : tab.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">KODE</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">PELANGGAN</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">TGL HANDOVER</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">STATUS</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">RENTAL</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">BAYAR</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">TOTAL</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-600 text-sm italic font-serif">Tidak ada pesanan</td></tr>
                ) : filtered.map((order) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-muted">{order.orderCode}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-200">{order.customerName}</p>
                      <p className="text-xs text-gray-600">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      {new Date(order.handoverDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.rentalStatus]}`}>
                        {order.rentalStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.paymentStatus]}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-300">Rp {order.totalAmount.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelected(order)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-brand-light transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && <div className="px-6 py-3 border-t border-white/5 text-xs text-gray-600">{filtered.length} pesanan</div>}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold italic text-brand-light">Detail Pesanan</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500">INFO PESANAN</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">Kode: </span><span className="font-mono text-brand-muted">{selected.orderCode}</span></div>
                    <div><span className="text-gray-500">Handover: </span><span className="text-gray-300">{new Date(selected.handoverDate).toLocaleDateString("id-ID")}</span></div>
                    <div><span className="text-gray-500">Kembali: </span><span className="text-gray-300">{new Date(selected.plannedReturnDate).toLocaleDateString("id-ID")}</span></div>
                    <div><span className="text-gray-500">Total: </span><span className="text-gray-300">Rp {selected.totalAmount.toLocaleString("id-ID")}</span></div>
                    <div><span className="text-gray-500">Dibayar: </span><span className="text-gray-300">Rp {selected.paidAmount.toLocaleString("id-ID")}</span></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold tracking-widest text-gray-500">PELANGGAN</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-300">{selected.customerName}</p>
                    <p className="text-gray-500">{selected.customerPhone} | {selected.customerWhatsapp}</p>
                    {selected.customerInstitution && <p className="text-gray-600">{selected.customerInstitution}</p>}
                  </div>
                </div>

                {selected.items?.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-bold tracking-widest text-gray-500">ITEM PESANAN</p>
                    <div className="space-y-2">
                      {selected.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-xs">
                          <div>
                            <p className="text-gray-300">{item.productName}</p>
                            <p className="text-gray-600">{item.sizeLabel} {item.colorLabel}</p>
                          </div>
                          <span className="text-gray-400">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  {selected.rentalStatus === "booked" && (
                    <button onClick={() => handleStatusUpdate(selected.id, { rentalStatus: "handed_over" })}
                      className="w-full flex items-center justify-center gap-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 py-3 rounded-xl text-xs font-bold text-blue-400 transition-all">
                      <RefreshCw size={14} /> TANDAI SUDAH DISERAHKAN
                    </button>
                  )}
                  {selected.rentalStatus === "handed_over" && (
                    <button onClick={() => handleStatusUpdate(selected.id, { rentalStatus: "returned", actualReturnDate: new Date().toISOString() })}
                      className="w-full flex items-center justify-center gap-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 py-3 rounded-xl text-xs font-bold text-green-400 transition-all">
                      <CheckCircle size={14} /> TANDAI SUDAH DIKEMBALIKAN
                    </button>
                  )}
                  {selected.paymentStatus !== "paid" && (
                    <button onClick={() => handlePayment(selected.id, "paid", selected.totalAmount)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-dark/50 hover:bg-brand-dark border border-brand-muted/30 py-3 rounded-xl text-xs font-bold text-brand-light transition-all">
                      <CheckCircle size={14} /> TANDAI LUNAS
                    </button>
                  )}
                  {selected.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusUpdate(selected.id, { status: "confirmed" as OrderStatus })}
                        className="w-full border border-green-500/30 bg-green-900/20 hover:bg-green-900/40 py-3 rounded-xl text-xs font-bold text-green-400 transition-all">
                        KONFIRMASI PESANAN
                      </button>
                      <button onClick={() => handleStatusUpdate(selected.id, { status: "cancelled" as OrderStatus })}
                        className="w-full border border-red-500/20 bg-red-900/10 hover:bg-red-900/20 py-3 rounded-xl text-xs font-bold text-red-400 transition-all">
                        BATALKAN PESANAN
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
