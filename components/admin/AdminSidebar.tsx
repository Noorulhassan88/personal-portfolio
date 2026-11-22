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
  PanelBottom,
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
  { name: "Footer", href: "/admin/footer", icon: PanelBottom },
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
          className="fixed inset-0 bg-[#07101e]/60 z-40 lg:hidden backdrop-blur-2xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a192f] border-r border-amber-500/20 text-white transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Header - Navy & Gold */}
          <div className="h-16 px-6 border-b border-amber-500/20 flex items-center justify-between bg-[#07101e]/60">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#112240] border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
                NH
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white">
                  Portfolio CMS
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-medium">
                  Administrator
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400/80 font-bold">
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
                      ? "bg-[#112240] text-amber-300 border-l-4 border-amber-400 shadow-xs"
                      : "text-neutral-300 hover:text-amber-300 hover:bg-[#112240]/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-amber-400"
                          : "text-neutral-400 group-hover:text-amber-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.hasBadge && unreadMessagesCount > 0 ? (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-amber-400 text-[#0a192f]"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                      }`}
                    >
                      {unreadMessagesCount}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Preview Site Link */}
        <div className="p-3 border-t border-amber-500/20 bg-[#07101e]/60">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/30 bg-[#112240] hover:bg-[#1b2f56] transition-colors text-xs font-semibold text-amber-300"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Open Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
