"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "@/lib/api/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/admin");
    } catch {
      setError("Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-6">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <span className="text-[30vw] font-serif font-black italic tracking-tighter">ADMIN</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold italic text-brand-light mb-2">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em]">KHANSA KIRANA COLLECTION</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-brand-muted/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-brand-muted/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark hover:bg-brand-muted hover:text-black py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
              ) : (
                <>
                  <LogIn size={14} />
                  MASUK
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
