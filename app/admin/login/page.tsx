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
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-[#0a192f] via-[#112240] to-[#07101e] text-white">
      <div className="max-w-md w-full bg-white text-[#0a192f] rounded-3xl border-2 border-amber-400/80 shadow-2xl p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0a192f] border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0a192f]">
            Administrator Portal
          </h1>
          <p className="text-xs text-neutral-500">
            Secure CMS management for Noorul Hassan Portfolio
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0a192f] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="noorulhassan.ai@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0a192f] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0a192f] hover:bg-[#112240] text-amber-300 font-bold text-xs tracking-wide transition-all shadow-md border border-amber-400/50 disabled:opacity-70"
          >
            <span>{loading ? "Verifying..." : "Sign In to Admin CMS"}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="pt-4 border-t border-neutral-100 text-center space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Instant One-Click Admin Sign-in</span>
          </button>

          <div>
            <Link
              href="/"
              className="text-xs font-semibold text-[#0a192f] hover:text-amber-600 transition-colors"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
