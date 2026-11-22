"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";
import { FooterSettings } from "@/types/portfolio";
import { initialFooterSettings } from "@/data/initialData";

interface FooterProps {
  name?: string;
  designation?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export default function Footer({
  name,
  githubUrl,
  linkedinUrl,
  email,
}: FooterProps) {
  const [footerData, setFooterData] = useState<FooterSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("portfolio_footer_settings");
        if (local) {
          return { ...initialFooterSettings, ...JSON.parse(local) };
        }
      } catch {}
    }
    return {
      ...initialFooterSettings,
      brand_name: name || initialFooterSettings.brand_name,
      github_url: githubUrl || initialFooterSettings.github_url,
      linkedin_url: linkedinUrl || initialFooterSettings.linkedin_url,
      email: email || initialFooterSettings.email,
    };
  });

  useEffect(() => {
    const syncFooter = () => {
      try {
        const local = localStorage.getItem("portfolio_footer_settings");
        if (local) {
          const parsed = JSON.parse(local);
          setFooterData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Footer localStorage sync error:", e);
      }
    };

    syncFooter();

    fetch("/api/admin/data?section=footer")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setFooterData((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_footer_settings", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);

    const handleStorageChange = () => {
      syncFooter();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_footer_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_footer_updated", handleStorageChange);
    };
  }, []);

  return (
    <footer className="mt-auto border-t border-amber-500/25 bg-[#050c18] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#0d1f38] border-2 border-amber-400 text-amber-400 flex items-center justify-center font-extrabold text-base tracking-wider shadow-md">
                {footerData.brand_monogram || "NH"}
              </span>
              <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                {footerData.brand_name || name || "Noorul Hassan"}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              {footerData.bio_description ||
                "Full Stack Developer and AI Engineer passionate about building scalable applications, intelligent systems and innovative digital experiences using modern web technologies and artificial intelligence."}
            </p>
            {footerData.status_enabled && (
              <div className="flex items-center gap-2.5 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                <span className="text-xs sm:text-sm font-semibold text-amber-300">
                  {footerData.status_text ||
                    "Available for engineering opportunities & AI collaborations"}
                </span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
              {footerData.nav_title || "Navigation"}
            </h4>
            <ul className="space-y-3 text-sm sm:text-base font-medium text-slate-200">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-amber-300 transition-colors">
                  Technical Skills
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-300 transition-colors">
                  Projects Showcase
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-amber-300 transition-colors">
                  Experience & Timeline
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-amber-300 transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column - Clean links WITHOUT arrow marks */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
              {footerData.connect_title || "Connect"}
            </h4>
            <div className="flex flex-col space-y-3 text-sm sm:text-base font-medium">
              <a
                href={footerData.github_url || githubUrl || "https://github.com"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-amber-400" />
                <span>GitHub</span>
              </a>
              <a
                href={footerData.linkedin_url || linkedinUrl || "https://linkedin.com"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 text-amber-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${footerData.email || email || "noorulhassan.ai@gmail.com"}`}
                className="inline-flex items-center gap-2.5 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{footerData.email || email || "noorulhassan.ai@gmail.com"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean and Large WITHOUT arrow mark on Get in Touch */}
        <div className="pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300 font-medium text-center sm:text-left">
          <div className="text-center sm:text-left">
            <span className="text-amber-200 font-semibold">
              {footerData.bottom_left_text ||
                `${footerData.brand_name || name || "Noorul Hassan"} • Full Stack Developer & AI Engineer`}
            </span>
          </div>
          <div>
            <Link
              href={footerData.cta_link || "/contact"}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors inline-flex items-center"
            >
              <span>{footerData.cta_text || "Get in Touch"}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
