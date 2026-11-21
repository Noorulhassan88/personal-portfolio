"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

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
          ? "bg-[#0a192f]/95 backdrop-blur-md border-b border-amber-500/20 shadow-md py-3 text-white"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram: Navy & Gold */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-[#0a192f] border border-amber-400/80 text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider group-hover:bg-amber-400 group-hover:text-[#0a192f] transition-all duration-200 shadow-xs">
              NH
            </span>
            <div className="flex flex-col">
              <span
                className={`font-semibold text-sm tracking-tight transition-colors ${
                  isScrolled
                    ? "text-white group-hover:text-amber-400"
                    : "text-[#0a192f] group-hover:text-amber-600"
                }`}
              >
                {name}
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest font-mono font-medium ${
                  isScrolled ? "text-amber-400/90" : "text-amber-700"
                }`}
              >
                AI & Full Stack
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 backdrop-blur-xs rounded-full px-3 py-1 shadow-xs border ${
              isScrolled
                ? "bg-[#112240]/80 border-amber-500/30"
                : "bg-white/80 border-neutral-200/80"
            }`}
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-[#0a192f] text-amber-400 border border-amber-400/60 shadow-xs"
                      : isScrolled
                      ? "text-neutral-300 hover:text-amber-300 hover:bg-[#0a192f]/60"
                      : "text-neutral-700 hover:text-[#0a192f] hover:bg-amber-50/80"
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0a192f] px-4 py-2 rounded-full shadow-xs hover:shadow-md transition-all duration-150 border border-amber-400/50"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-white hover:bg-[#112240]"
                : "text-[#0a192f] hover:bg-amber-50"
            }`}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-[#0a192f]/98 backdrop-blur-lg border border-amber-500/30 rounded-2xl shadow-xl flex flex-col gap-2 text-white">
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
                      ? "bg-[#112240] text-amber-400 border border-amber-400/40"
                      : "text-neutral-300 hover:bg-[#112240]/60 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              );
            })}

            <div className="pt-2 mt-1 border-t border-amber-500/20">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold bg-amber-500 text-[#0a192f] rounded-xl hover:bg-amber-400 block transition-colors"
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
