"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Star, ToggleLeft, ToggleRight } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  getTestimonials, createTestimonial, updateTestimonial,
  deleteTestimonial, toggleTestimonialActive,
} from "@/lib/api/testimonials";
import type { Testimonial } from "@/lib/types";

type FormState = { name: string; occasion: string; review: string; rating: number; sortOrder: string };
const emptyForm: FormState = { name: "", occasion: "", review: "", rating: 5, sortOrder: "0" };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await getTestimonials(false).catch(() => []);
    setItems(data.sort((a, b) => a.sortOrder - b.sortOrder));
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({ name: t.name, occasion: t.occasion, review: t.review, rating: t.rating, sortOrder: String(t.sortOrder) });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, occasion: form.occasion, review: form.review, rating: form.rating, sortOrder: Number(form.sortOrder) };
      editingId ? await updateTestimonial(editingId, payload) : await createTestimonial(payload);
      setModalOpen(false);
      await loadData();
    } catch { alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus testimoni ini?")) return;
    await deleteTestimonial(id).catch(() => alert("Gagal menghapus."));
    await loadData();
  }

  async function handleToggle(id: string) {
    await toggleTestimonialActive(id).catch(() => null);
    await loadData();
  }

  return (
    <>
      <AdminHeader title="Manajemen Testimoni" />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-end mb-8">
          <button onClick={openCreate} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] transition-all">
            <Plus size={14} /> TAMBAH TESTIMONI
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white/5 border rounded-2xl p-6 transition-colors ${t.isActive ? "border-white/10" : "border-white/5 opacity-50"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < t.rating ? "text-brand-light fill-brand-light" : "text-gray-700"} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggle(t.id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      {t.isActive ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} className="text-gray-600" />}
                    </button>
                    <button onClick={() => openEdit(t)} className="p-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-brand-light transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1 hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="italic text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-brand-dark/50 flex items-center justify-center text-brand-light font-bold text-sm font-serif">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">{t.name}</p>
                    <p className="text-[10px] text-gray-600 tracking-wide uppercase">{t.occasion}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold italic text-brand-light">{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="NAMA" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <Field label="ACARA / KESEMPATAN" value={form.occasion} onChange={(v) => setForm((f) => ({ ...f, occasion: v }))} />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">ULASAN</label>
                  <textarea value={form.review} onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))} required rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">RATING</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))}
                        className={`p-2 rounded-lg transition-colors ${n <= form.rating ? "text-brand-light" : "text-gray-700 hover:text-gray-500"}`}>
                        <Star size={20} className={n <= form.rating ? "fill-brand-light" : ""} />
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="URUTAN TAMPIL" value={form.sortOrder} onChange={(v) => setForm((f) => ({ ...f, sortOrder: v }))} type="number" />
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
