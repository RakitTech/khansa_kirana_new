"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, ToggleLeft, ToggleRight, Shield } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminUsers, createAdminUser, toggleAdminStatus, deleteAdminUser } from "@/lib/api/admin-users";
import type { AdminUser, AdminRole } from "@/lib/types";

const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: "bg-purple-900/30 text-purple-400 border-purple-500/30",
  admin: "bg-brand-dark/40 text-brand-light border-brand-muted/30",
  editor: "bg-blue-900/30 text-blue-400 border-blue-500/30",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" as AdminRole });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAdminUsers().catch(() => []);
    setUsers(data);
    setLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminUser(form);
      setModalOpen(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
      await loadData();
    } catch { alert("Gagal menambahkan admin."); }
    finally { setSaving(false); }
  }

  async function handleToggle(id: string) {
    await toggleAdminStatus(id).catch(() => null);
    await loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus admin ini?")) return;
    await deleteAdminUser(id).catch(() => alert("Gagal menghapus."));
    await loadData();
  }

  return (
    <>
      <AdminHeader title="Manajemen Admin" />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-end mb-8">
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] transition-all">
            <Plus size={14} /> TAMBAH ADMIN
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">ADMIN</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">ROLE</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">STATUS</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">LOGIN TERAKHIR</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold tracking-[0.2em] text-gray-500">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-600 text-sm italic font-serif">Tidak ada admin</td></tr>
              ) : users.map((u) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-dark/50 flex items-center justify-center text-brand-light font-bold font-serif">{u.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-200">{u.name}</p>
                        <p className="text-xs text-gray-600">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role]}`}>
                      {u.role.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleToggle(u.id)} className="flex items-center gap-1.5">
                      {u.isActive ? <><ToggleRight size={18} className="text-green-500" /><span className="text-xs text-green-500">Aktif</span></> : <><ToggleLeft size={18} className="text-gray-600" /><span className="text-xs text-gray-600">Nonaktif</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && <div className="px-6 py-3 border-t border-white/5 text-xs text-gray-600">{users.length} admin</div>}
        </div>
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
                <h2 className="font-serif text-xl font-bold italic text-brand-light flex items-center gap-2"><Shield size={18} /> Tambah Admin</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="NAMA" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
                <Field label="EMAIL" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} type="email" required />
                <Field label="PASSWORD" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} type="password" required />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">ROLE</label>
                  <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminRole }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50">
                    <option value="editor" className="bg-[#1a1a1a]">Editor</option>
                    <option value="admin" className="bg-[#1a1a1a]">Admin</option>
                    <option value="super_admin" className="bg-[#1a1a1a]">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-sm font-medium transition-all">Batal</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-brand-dark hover:bg-brand-muted hover:text-black py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    {saving ? "Menyimpan..." : "Tambah Admin"}
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
