"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  getCatalogProvinces, createCatalogProvince, updateCatalogProvince,
  deleteCatalogProvince, toggleCatalogProvinceActive, getIslandGroups,
} from "@/lib/api/catalog-provinces";
import { uploadFile } from "@/lib/api/storage";
import type { CatalogProvince, IslandGroup } from "@/lib/types";

type FormState = {
  name: string; islandKey: string; costumeName: string; description: string;
  imageUrl: string; priceFrom: string; sortOrder: string;
};
const emptyForm: FormState = { name: "", islandKey: "", costumeName: "", description: "", imageUrl: "", priceFrom: "0", sortOrder: "0" };

export default function CatalogProvincesPage() {
  const [provinces, setProvinces] = useState<CatalogProvince[]>([]);
  const [islands, setIslands] = useState<IslandGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [data, islandData] = await Promise.all([
      getCatalogProvinces(false).catch(() => []),
      getIslandGroups().catch(() => []),
    ]);
    setProvinces(data.sort((a, b) => a.sortOrder - b.sortOrder));
    setIslands(islandData);
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
    setImageFile(null);
    setModalOpen(true);
  }

  function openEdit(p: CatalogProvince) {
    setEditingId(p.id);
    setForm({ name: p.name, islandKey: p.islandKey, costumeName: p.costumeName, description: p.description, imageUrl: p.imageUrl, priceFrom: String(p.priceFrom), sortOrder: String(p.sortOrder) });
    setImagePreview(p.imageUrl);
    setImageFile(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) imageUrl = await uploadFile(imageFile, "catalog");
      const payload = { name: form.name, islandKey: form.islandKey, costumeName: form.costumeName, description: form.description, imageUrl, priceFrom: Number(form.priceFrom), sortOrder: Number(form.sortOrder) };
      editingId ? await updateCatalogProvince(editingId, payload) : await createCatalogProvince(payload);
      setModalOpen(false);
      await loadData();
    } catch { alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus provinsi ini?")) return;
    await deleteCatalogProvince(id).catch(() => alert("Gagal menghapus."));
    await loadData();
  }

  async function handleToggle(id: string) {
    await toggleCatalogProvinceActive(id).catch(() => null);
    await loadData();
  }

  return (
    <>
      <AdminHeader title="Katalog Provinsi" />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-end mb-8">
          <button onClick={openCreate} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] transition-all">
            <Plus size={14} /> TAMBAH PROVINSI
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)
          ) : provinces.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 ${!p.isActive ? "opacity-50" : ""}`}>
              <div className="aspect-[3/4] relative">
                {p.imageUrl ? <Image src={p.imageUrl} alt={p.name} fill className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-brand-dark/20 to-black" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[9px] font-bold tracking-widest text-brand-muted uppercase mb-1">{islands.find((i) => i.key === p.islandKey)?.name ?? p.islandKey}</p>
                  <p className="font-serif font-bold text-brand-light italic">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.costumeName}</p>
                </div>
                {/* Actions overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleToggle(p.id)} className="p-1.5 bg-black/60 rounded-lg backdrop-blur-sm">
                    {p.isActive ? <ToggleRight size={14} className="text-green-400" /> : <ToggleLeft size={14} className="text-gray-500" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 bg-black/60 rounded-lg backdrop-blur-sm text-gray-300 hover:text-brand-light">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-black/60 rounded-lg backdrop-blur-sm text-gray-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold italic text-brand-light">{editingId ? "Edit Provinsi" : "Tambah Provinsi"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">FOTO</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                      {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700">IMG</div>}
                    </div>
                    <label className="flex-1 border border-dashed border-white/20 rounded-xl p-3 text-center cursor-pointer hover:border-brand-muted/40 transition-colors text-xs text-gray-500">
                      Upload gambar
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setImageFile(f);
                        if (f) setImagePreview(URL.createObjectURL(f));
                      }} />
                    </label>
                  </div>
                </div>
                <Field label="NAMA PROVINSI" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">PULAU</label>
                  <select value={form.islandKey} onChange={(e) => setForm((f) => ({ ...f, islandKey: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50">
                    <option value="" className="bg-[#1a1a1a]">Pilih Pulau</option>
                    {islands.map((i) => <option key={i.key} value={i.key} className="bg-[#1a1a1a]">{i.name}</option>)}
                  </select>
                </div>
                <Field label="NAMA KOSTUM" value={form.costumeName} onChange={(v) => setForm((f) => ({ ...f, costumeName: v }))} />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">DESKRIPSI</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="HARGA MULAI (Rp)" value={form.priceFrom} onChange={(v) => setForm((f) => ({ ...f, priceFrom: v }))} type="number" />
                  <Field label="URUTAN" value={form.sortOrder} onChange={(v) => setForm((f) => ({ ...f, sortOrder: v }))} type="number" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-sm font-medium transition-all">Batal</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-brand-dark hover:bg-brand-muted hover:text-black py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 transition-colors" />
    </div>
  );
}
