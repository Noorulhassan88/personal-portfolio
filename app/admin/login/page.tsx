"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("noorulhassan.ai@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.trim().length > 3) {
        localStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid administrator email or password.");
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickDemoAccess = () => {
    localStorage.setItem("admin_auth", "true");
    sessionStorage.setItem("admin_auth", "true");
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-[#050c18] via-[#071324] to-[#0d1f38] text-white">
      <div className="max-w-md w-full bg-[#0d1f38] text-white rounded-3xl border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.2)] p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#071324] border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Administrator Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Secure CMS management for Noorul Hassan Portfolio
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-400 text-red-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="noorulhassan.ai@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-500/40 bg-[#071324] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-500/40 bg-[#071324] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300 disabled:opacity-70 cursor-pointer"
          >
            <span>{loading ? "Verifying..." : "Sign In to Admin CMS"}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-4 border-t border-amber-500/20 text-center space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#142c50] hover:bg-[#1b3a6b] text-amber-300 text-xs sm:text-sm font-bold border border-amber-400/60 transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Instant One-Click Admin Sign-in</span>
          </button>

          <div>
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-300 transition-colors"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
