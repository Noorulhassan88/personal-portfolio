"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth =
      typeof window !== "undefined" &&
      (localStorage.getItem("admin_auth") === "true" ||
        sessionStorage.getItem("admin_auth") === "true");

    if (isAuth) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071324] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-amber-300">Loading Administrator Portal...</p>
      </div>
    </div>
  );
}
