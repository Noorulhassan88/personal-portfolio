"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  User,
  Wrench,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Mail,
  Image as ImageIcon,
  Palette,
  Search,
  Settings,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Homepage", href: "/admin/homepage", icon: Home },
  { name: "About Me", href: "/admin/about", icon: User },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Resume", href: "/admin/resume", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail, hasBadge: true },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Appearance", href: "/admin/appearance", icon: Palette },
  { name: "SEO Meta", href: "/admin/seo", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  unreadMessagesCount = 0,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-2xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="h-16 px-6 border-b border-neutral-100 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
                NH
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-neutral-900">
                  Portfolio CMS
                </span>
                <span className="text-[10px] text-blue-600 font-mono font-medium">
                  Administrator
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Content Management
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-blue-400"
                          : "text-neutral-400 group-hover:text-neutral-700"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.hasBadge && unreadMessagesCount > 0 ? (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {unreadMessagesCount}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Preview Site Link */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
