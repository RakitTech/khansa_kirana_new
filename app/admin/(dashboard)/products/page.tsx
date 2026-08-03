"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Search, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getProducts, createProduct, updateProduct, deleteProduct, toggleAvailability } from "@/lib/api/products";
import { uploadFile } from "@/lib/api/storage";
import type { Product } from "@/lib/types";

const CATEGORIES = ["atasan", "bawahan", "aksesoris", "fullset"];

type FormState = {
  name: string; description: string; price: string; category: string;
  province: string; traditionalName: string; stockQty: string;
  isAvailable: boolean; showInGallery: boolean; imageUrl: string;
};

const emptyForm: FormState = {
  name: "", description: "", price: "", category: "atasan",
  province: "", traditionalName: "", stockQty: "0",
  isAvailable: true, showInGallery: true, imageUrl: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(products); return; }
    const q = search.toLowerCase();
    setFiltered(products.filter((p) => p.name.toLowerCase().includes(q) || p.province.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  }, [search, products]);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts().catch(() => []);
    setProducts(data);
    setFiltered(data);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      category: p.category, province: p.province, traditionalName: p.traditionalName,
      stockQty: String(p.stockQty), isAvailable: p.isAvailable,
      showInGallery: p.showInGallery, imageUrl: p.imageUrl,
    });
    setPreview(p.imageUrl);
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, "products");
      }
      const payload = {
        name: form.name, description: form.description, price: Number(form.price),
        category: form.category, province: form.province, traditionalName: form.traditionalName,
        stockQty: Number(form.stockQty), isAvailable: form.isAvailable,
        showInGallery: form.showInGallery, imageUrl,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      await loadProducts();
    } catch {
      alert("Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    await deleteProduct(id).catch(() => alert("Gagal menghapus."));
    await loadProducts();
  }

  async function handleToggle(id: string) {
    await toggleAvailability(id).catch(() => null);
    await loadProducts();
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(form.imageUrl);
  }

  return (
    <>
      <AdminHeader title="Manajemen Produk" />
      <div className="flex-1 overflow-y-auto p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-muted/50"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] transition-all"
          >
            <Plus size={14} /> TAMBAH PRODUK
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">PRODUK</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">KATEGORI</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">PROVINSI</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">HARGA</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">STOK</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">STATUS</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-white/10 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-600 text-sm italic font-serif">
                      Tidak ada produk
                    </td>
                  </tr>
                ) : filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                          {p.imageUrl ? (
                            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-light/30 font-serif">K</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-200">{p.name}</p>
                          <p className="text-xs text-gray-600">{p.traditionalName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-400 capitalize">{p.category}</td>
                    <td className="px-4 py-4 text-gray-400">{p.province}</td>
                    <td className="px-4 py-4 text-gray-300">Rp {p.price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4 text-gray-400">{p.stockQty}</td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleToggle(p.id)} className="flex items-center gap-1.5">
                        {p.isAvailable ? (
                          <><ToggleRight size={18} className="text-green-500" /><span className="text-xs text-green-500">Aktif</span></>
                        ) : (
                          <><ToggleLeft size={18} className="text-gray-600" /><span className="text-xs text-gray-600">Nonaktif</span></>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewProduct(p)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-brand-light transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openEdit(p)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-brand-light transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="px-6 py-3 border-t border-white/5 text-xs text-gray-600">
              {filtered.length} produk
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold italic text-brand-light">
                  {editingId ? "Edit Produk" : "Tambah Produk"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">FOTO PRODUK</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700 text-2xl font-serif">K</div>}
                    </div>
                    <label className="flex-1 cursor-pointer border border-dashed border-white/20 rounded-xl p-4 text-center hover:border-brand-muted/40 transition-colors text-xs text-gray-500">
                      <span>Klik untuk upload gambar</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                </div>
                <Field label="NAMA PRODUK" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">KATEGORI</label>
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50">
                      {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#1a1a1a] capitalize">{c}</option>)}
                    </select>
                  </div>
                  <Field label="HARGA (Rp)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} type="number" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="PROVINSI" value={form.province} onChange={(v) => setForm((f) => ({ ...f, province: v }))} />
                  <Field label="NAMA TRADISIONAL" value={form.traditionalName} onChange={(v) => setForm((f) => ({ ...f, traditionalName: v }))} />
                </div>
                <Field label="STOK" value={form.stockQty} onChange={(v) => setForm((f) => ({ ...f, stockQty: v }))} type="number" />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">DESKRIPSI</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-brand-muted/50 resize-none" />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} className="accent-brand-light" />
                    <span className="text-xs text-gray-400">Tersedia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.showInGallery} onChange={(e) => setForm((f) => ({ ...f, showInGallery: e.target.checked }))} className="accent-brand-light" />
                    <span className="text-xs text-gray-400">Tampilkan di Galeri</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-sm font-medium transition-all">
                    Batal
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 bg-brand-dark hover:bg-brand-muted hover:text-black py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden w-full max-w-md"
            >
              {viewProduct.imageUrl && (
                <div className="relative w-full h-56">
                  <Image src={viewProduct.imageUrl} alt={viewProduct.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold italic text-brand-light mb-1">{viewProduct.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{viewProduct.traditionalName} — {viewProduct.province}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{viewProduct.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-light font-bold">Rp {viewProduct.price.toLocaleString("id-ID")}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${viewProduct.isAvailable ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {viewProduct.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-brand-muted/50 transition-colors"
      />
    </div>
  );
}
