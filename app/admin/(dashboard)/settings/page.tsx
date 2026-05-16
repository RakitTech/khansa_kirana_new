"use client";

import { useState, FormEvent } from "react";
import { Save } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { changePassword } from "@/lib/api/auth";

export default function SettingsPage() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      setMsg({ type: "error", text: "Password baru tidak cocok." });
      return;
    }
    setSaving(true);
    try {
      await changePassword(form.current, form.newPass);
      setMsg({ type: "success", text: "Password berhasil diubah." });
      setForm({ current: "", newPass: "", confirm: "" });
    } catch {
      setMsg({ type: "error", text: "Gagal mengubah password. Periksa password saat ini." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader title="Pengaturan" />
      <div className="flex-1 overflow-y-auto p-8 max-w-lg">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="font-serif text-xl font-bold italic text-brand-light mb-6">Ganti Password</h2>

          {msg && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm border ${msg.type === "success" ? "bg-green-900/20 border-green-500/30 text-green-400" : "bg-red-900/20 border-red-500/30 text-red-400"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "PASSWORD SAAT INI", key: "current" as const },
              { label: "PASSWORD BARU", key: "newPass" as const },
              { label: "KONFIRMASI PASSWORD BARU", key: "confirm" as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">{label}</label>
                <input type="password" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 transition-colors" />
              </div>
            ))}
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-6 py-3 rounded-xl text-xs font-bold tracking-[0.15em] transition-all disabled:opacity-50 mt-2">
              {saving ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> : <Save size={14} />}
              {saving ? "MENYIMPAN..." : "SIMPAN PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
