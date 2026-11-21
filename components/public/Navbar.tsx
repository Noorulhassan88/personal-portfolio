"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  name?: string;
  designation?: string;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/experience" },
  { name: "Certifications", href: "/certifications" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ name = "Noorul Hassan" }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#071324]/95 backdrop-blur-md border-b border-amber-500/25 shadow-lg py-3 text-white"
          : "bg-transparent py-4 sm:py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram: Deep Navy & Gold */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-colors"
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
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
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
              className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] px-6 py-2.5 rounded-full shadow-[0_0_22px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] hover:scale-[1.02] transition-all duration-150 border-2 border-amber-300"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-300 hover:bg-[#0d1f38] transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-[#0d1f38]/98 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col gap-2 text-white">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-amber-400 text-[#071324] font-bold"
                      : "text-neutral-200 hover:bg-[#142c50] hover:text-amber-300"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#071324]" />}
                </Link>
              );
            })}

            <div className="pt-2 mt-1 border-t border-amber-500/20">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-linear-to-r from-amber-400 to-amber-500 text-[#071324] rounded-xl hover:from-amber-500 hover:to-amber-600 block transition-all shadow-md"
              >
                Contact Noorul
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
