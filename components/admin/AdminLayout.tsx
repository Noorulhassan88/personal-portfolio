"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render without sidebar
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If not login page, check auth state
    if (!isLoginPage) {
      const isAuth =
        localStorage.getItem("admin_auth") === "true" ||
        sessionStorage.getItem("admin_auth") === "true";
      if (!isAuth) {
        // Automatically allow demo access or redirect to login
        // For convenience in testing, set default session if not set
        sessionStorage.setItem("admin_auth", "true");
      }
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#071324] text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#071324] text-white flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadMessagesCount={unreadCount}
      />

      {/* Main Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-[#071324]">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-[#071324] text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
