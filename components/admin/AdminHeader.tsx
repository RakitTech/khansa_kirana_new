"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ExternalLink } from "lucide-react";
import { getMe } from "@/lib/api/auth";
import type { AdminUser } from "@/lib/types";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    getMe().then(setAdmin).catch(() => null);
  }, []);

  return (
    <header className="h-16 bg-[#111111] border-b border-white/5 flex items-center justify-between px-8">
      <h1 className="text-base font-semibold text-gray-200">{title}</h1>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-light transition-colors"
        >
          <ExternalLink size={12} />
          Lihat Website
        </Link>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-gray-300">
          <Bell size={16} />
        </button>
        {admin && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-dark/60 border border-brand-muted/30 flex items-center justify-center text-brand-light font-bold text-sm font-serif">
              {admin.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-300">{admin.name}</p>
              <p className="text-[10px] text-gray-600 capitalize">{admin.role.replace("_", " ")}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
