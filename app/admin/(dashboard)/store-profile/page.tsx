"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, X, Upload, ImageIcon } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getStoreProfile, updateStoreProfile } from "@/lib/api/store-profile";
import { uploadFile } from "@/lib/api/storage";
import type { StoreProfile } from "@/lib/types";

type FormState = Omit<StoreProfile, "id" | "createdAt" | "updatedAt">;

export default function StoreProfilePage() {
  const [profileId, setProfileId] = useState<string>("");
  const [form, setForm] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [heroUploading, setHeroUploading] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getStoreProfile()
      .then((data) => {
        setProfileId(data.id);
        setForm({
          storeName: data.storeName, logoUrl: data.logoUrl, address: data.address,
          gmapsLink: data.gmapsLink, latitude: data.latitude, longitude: data.longitude,
          phone: data.phone, whatsapp: data.whatsapp, instagramUrl: data.instagramUrl,
          facebookUrl: data.facebookUrl, tiktokUrl: data.tiktokUrl,
          operationalHours: data.operationalHours, heroImages: data.heroImages ?? [],
        });
        setLogoPreview(data.logoUrl);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logoUrl ?? "";
      if (logoFile) logoUrl = await uploadFile(logoFile, "logo");
      await updateStoreProfile(profileId, { ...form, logoUrl });
      alert("Profil toko berhasil disimpan.");
    } catch {
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleHeroUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setHeroUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "hero");
        uploaded.push(url);
      }
      setForm((f) => ({ ...f, heroImages: [...(f.heroImages ?? []), ...uploaded] }));
    } catch {
      alert("Gagal upload foto.");
    } finally {
      setHeroUploading(false);
      if (heroInputRef.current) heroInputRef.current.value = "";
    }
  }

  function removeHeroImage(idx: number) {
    setForm((f) => ({ ...f, heroImages: f.heroImages?.filter((_, i) => i !== idx) }));
  }

  function moveHeroImage(idx: number, dir: -1 | 1) {
    setForm((f) => {
      const imgs = [...(f.heroImages ?? [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= imgs.length) return f;
      [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
      return { ...f, heroImages: imgs };
    });
  }

  const set = (key: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  if (loading) {
    return (
      <>
        <AdminHeader title="Profil Toko" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin border-2 border-brand-muted/30 border-t-brand-light rounded-full w-8 h-8" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Profil Toko" />
      <div className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              <Section title="INFORMASI DASAR">
                <Field label="NAMA TOKO" value={form.storeName ?? ""} onChange={set("storeName")} required />
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">LOGO TOKO</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-serif text-2xl">K</div>
                      )}
                    </div>
                    <label className="flex-1 border border-dashed border-white/20 rounded-xl p-3 text-center cursor-pointer hover:border-brand-muted/40 transition-colors text-xs text-gray-500">
                      <Upload size={14} className="inline mr-2" />
                      Upload logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setLogoFile(f);
                          if (f) setLogoPreview(URL.createObjectURL(f));
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">ALAMAT</label>
                  <textarea
                    value={form.address ?? ""}
                    onChange={(e) => set("address")(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 resize-none"
                  />
                </div>
                <Field label="JAM OPERASIONAL" value={form.operationalHours ?? ""} onChange={set("operationalHours")} />
              </Section>

              <Section title="KONTAK">
                <Field label="NO. TELEPON" value={form.phone ?? ""} onChange={set("phone")} />
                <Field label="WHATSAPP" value={form.whatsapp ?? ""} onChange={set("whatsapp")} />
              </Section>

              <Section title="MEDIA SOSIAL">
                <Field label="INSTAGRAM URL" value={form.instagramUrl ?? ""} onChange={set("instagramUrl")} />
                <Field label="FACEBOOK URL" value={form.facebookUrl ?? ""} onChange={set("facebookUrl")} />
                <Field label="TIKTOK URL" value={form.tiktokUrl ?? ""} onChange={set("tiktokUrl")} />
              </Section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <Section title="LOKASI MAPS">
                <Field label="GOOGLE MAPS LINK" value={form.gmapsLink ?? ""} onChange={set("gmapsLink")} />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="LATITUDE"
                    value={String(form.latitude ?? "")}
                    onChange={(v) => setForm((f) => ({ ...f, latitude: parseFloat(v) || 0 }))}
                    type="number"
                  />
                  <Field
                    label="LONGITUDE"
                    value={String(form.longitude ?? "")}
                    onChange={(v) => setForm((f) => ({ ...f, longitude: parseFloat(v) || 0 }))}
                    type="number"
                  />
                </div>
              </Section>

              {/* Hero Images */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.25em] text-gray-500">FOTO HERO (SLIDESHOW)</p>
                  <span className="text-[10px] text-gray-600">{form.heroImages?.length ?? 0} foto</span>
                </div>

                {/* Upload button */}
                <label className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all ${
                  heroUploading
                    ? "border-brand-muted/50 opacity-60 cursor-not-allowed"
                    : "border-white/15 hover:border-brand-muted/50 hover:bg-white/5"
                }`}>
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={heroUploading}
                    onChange={(e) => handleHeroUpload(e.target.files)}
                  />
                  {heroUploading ? (
                    <>
                      <span className="animate-spin border-2 border-brand-muted/30 border-t-brand-light rounded-full w-5 h-5" />
                      <span className="text-sm text-gray-400">Mengupload foto...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={20} className="text-gray-500" />
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Klik untuk upload foto hero</p>
                        <p className="text-[10px] text-gray-600 mt-1">Bisa pilih beberapa foto sekaligus • JPG, PNG, WebP</p>
                      </div>
                      <Plus size={16} className="text-gray-500" />
                    </>
                  )}
                </label>

                {/* Hero image list */}
                <AnimatePresence>
                  {(form.heroImages?.length ?? 0) === 0 ? (
                    <p className="text-xs text-gray-700 text-center py-4 italic">Belum ada foto hero. Upload foto di atas.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {(form.heroImages ?? []).map((url, idx) => (
                        <motion.div
                          key={url + idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2"
                        >
                          {/* Preview */}
                          <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                            <img src={url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>

                          {/* Order badge + info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-dark/50 text-brand-muted rounded tracking-widest">
                                #{idx + 1}
                              </span>
                              {idx === 0 && (
                                <span className="text-[9px] text-green-500 font-bold tracking-widest">TAMPIL PERTAMA</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{url.split("/").pop()}</p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => moveHeroImage(idx, -1)}
                              disabled={idx === 0}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-600 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                              title="Pindah ke atas"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveHeroImage(idx, 1)}
                              disabled={idx === (form.heroImages?.length ?? 0) - 1}
                              className="p-1.5 hover:bg-white/10 rounded text-gray-600 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                              title="Pindah ke bawah"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeHeroImage(idx)}
                              className="p-1.5 hover:bg-red-900/20 rounded text-gray-600 hover:text-red-400 transition-colors"
                              title="Hapus"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-dark hover:bg-brand-muted hover:text-black px-8 py-4 rounded-xl text-xs font-bold tracking-[0.2em] transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <p className="text-[10px] font-bold tracking-[0.25em] text-gray-500">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-brand-muted/50 transition-colors"
      />
    </div>
  );
}
