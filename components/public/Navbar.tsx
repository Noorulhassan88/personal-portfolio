"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  User,
  Wrench,
  FolderGit2,
  Briefcase,
  Award,
  Mail,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  name?: string;
  designation?: string;
}

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Skills", href: "/skills", icon: Wrench },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Experience", href: "/experience", icon: Briefcase },
  { name: "Certifications", href: "/certifications", icon: Award },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar({ name = "Noorul Hassan" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatically close mobile menu & clear navigation indicator on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNavigatingTo(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open to prevent accidental background jumps
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Mobile navigation handler: uses React transition & router to guarantee navigation
  // without DOM unmount abortion bugs on mobile touchscreens
  const handleMobileNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (pathname === href) {
      setMobileMenuOpen(false);
      return;
    }

    setNavigatingTo(href);
    startTransition(() => {
      router.push(href);
    });

    // Close menu gracefully once transition is underway
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 120);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-none ${
          isScrolled || mobileMenuOpen
            ? "bg-[#071324]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)] py-2.5 sm:py-3 text-white"
            : "bg-transparent py-3.5 sm:py-5 text-white"
        }`}
      >
        {/* Top Glowing Route Loading Progress Bar */}
        {(isPending || navigatingTo) && (
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_12px_#f59e0b] animate-pulse z-60" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Monogram: Deep Navy & Gold */}
            <Link
              href="/"
              prefetch={true}
              onClick={() => {
                if (pathname !== "/") setNavigatingTo("/");
              }}
              className="group flex items-center gap-2.5 transition-colors cursor-pointer touch-manipulation"
            >
              <span className="w-8 h-8 rounded-lg bg-[#0d1f38] border border-amber-400 text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider group-hover:bg-amber-400 group-hover:text-[#071324] transition-all duration-200 shadow-md">
                NH
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {name}
                </span>
                <span className="text-[10px] text-amber-400 font-mono tracking-widest font-semibold uppercase">
                  AI & Full Stack
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#0d1f38]/95 backdrop-blur-md border border-amber-500/40 rounded-full px-4 py-1.5 shadow-lg">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    onClick={() => {
                      if (pathname !== link.href) setNavigatingTo(link.href);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
                      isActive
                        ? "bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 text-[#071324] font-extrabold shadow-md"
                        : "text-slate-200 hover:text-amber-300 hover:bg-[#142c50]/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Button - Glowing Gold Button */}
            <div className="hidden md:flex items-center">
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => {
                  if (pathname !== "/contact") setNavigatingTo("/contact");
                }}
                className="btn-shine inline-flex items-center justify-center text-sm sm:text-base font-extrabold bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] px-6 py-2.5 rounded-full shadow-[0_0_22px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] hover:scale-[1.02] active:scale-95 transition-all duration-150 border-2 border-amber-300 cursor-pointer"
              >
                <span>Get in Touch</span>
              </Link>
            </div>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-amber-300 hover:bg-[#0d1f38] transition-colors border border-amber-500/40 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer touch-manipulation active:scale-95 bg-[#0d1f38]/80 shadow-md"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-300 stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 text-amber-300 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            <div className="p-4 bg-[#0d1f38]/98 backdrop-blur-2xl border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col gap-1.5 text-white">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-1 flex items-center gap-1.5 border-b border-amber-500/20 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Navigation</span>
              </div>

              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                const isTarget = navigatingTo === link.href;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleMobileNavigation(e, link.href)}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between touch-manipulation cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? "bg-amber-400 text-[#071324] font-extrabold shadow-md"
                        : "text-neutral-200 hover:bg-[#142c50] hover:text-amber-300 active:bg-[#142c50]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#071324]" : "text-amber-400"
                        }`}
                      />
                      <span>{link.name}</span>
                    </div>

                    {isTarget ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[#071324]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 opacity-60" />
                    )}
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t border-amber-500/20">
                <a
                  href="/contact"
                  onClick={(e) => handleMobileNavigation(e, "/contact")}
                  className="w-full text-center py-3.5 px-4 text-xs font-extrabold bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 text-[#071324] rounded-xl hover:from-amber-500 hover:to-amber-700 block transition-all shadow-md active:scale-95 cursor-pointer touch-manipulation"
                >
                  Get in Touch • Contact Noorul
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Backdrop Overlay - closes menu when tapping outside */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-[#071324]/75 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}
    </>
  );
}
