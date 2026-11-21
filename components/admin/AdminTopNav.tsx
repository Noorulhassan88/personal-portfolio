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
    <header className="h-16 bg-white border-b border-amber-500/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#0a192f] hover:bg-amber-50"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-base sm:text-lg font-bold text-[#0a192f] tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-300 text-xs font-semibold text-[#0a192f] hover:bg-amber-50 transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
        </Link>

        {/* Admin Monogram Profile - Navy & Gold */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-[#0a192f] border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
            NH
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0a192f] leading-none">
              Noorul Hassan
            </span>
            <span className="text-[10px] text-amber-700 font-mono font-medium mt-0.5">
              Superadmin
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
