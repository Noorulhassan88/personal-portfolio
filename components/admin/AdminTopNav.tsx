"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminTopNavProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function AdminTopNav({ onMenuToggle, title }: AdminTopNavProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-[#0d1f38] border-b border-amber-500/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-amber-300 hover:bg-[#142c50]"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/60 bg-[#071324] text-xs sm:text-sm font-bold text-amber-300 hover:bg-[#142c50] transition-colors shadow-sm"
        >
          <span>View Site</span>
          <ExternalLink className="w-4 h-4 text-amber-400 stroke-[2.5]" />
        </Link>

        {/* Admin Monogram Profile - Navy & Gold */}
        <div className="flex items-center gap-2 pl-2 border-l border-amber-500/20">
          <div className="w-9 h-9 rounded-full bg-[#071324] border-2 border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs shadow-md">
            NH
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold text-white leading-none">
              Noorul Hassan
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-semibold mt-0.5">
              Superadmin
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
