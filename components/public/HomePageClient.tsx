"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import { HomepageSettings } from "@/types/portfolio";

interface HomePageClientProps {
  initialSettings: HomepageSettings;
}

export default function HomePageClient({ initialSettings }: HomePageClientProps) {
  const [settings, setSettings] = useState<HomepageSettings>(initialSettings);

  useEffect(() => {
    const syncLocal = () => {
      try {
        const local = localStorage.getItem("portfolio_homepage_settings");
        if (local) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(local) }));
        }
        const seoLocal = localStorage.getItem("portfolio_seo");
        if (seoLocal) {
          const parsedSeo = JSON.parse(seoLocal);
          const customTitle = parsedSeo.page_meta?.["/"]?.title || parsedSeo.global_title;
          if (customTitle && typeof document !== "undefined") {
            document.title = customTitle;
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncLocal();

    fetch("/api/admin/data?section=homepage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem("portfolio_homepage_settings", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);

    const handleStorageChange = () => {
      syncLocal();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("portfolio_seo_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_seo_updated", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#071324] text-white overflow-hidden">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1 flex flex-col justify-center">
        <Hero settings={settings} />
      </main>

      {/* Navy & Gold Bottom Bar */}
      <footer className="py-3 px-4 border-t border-amber-500/20 bg-[#050c18] text-center text-xs sm:text-sm text-amber-200/90 font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="text-white font-bold">{settings.name}</span>
        <span className="text-amber-400">•</span>
        <span className="text-amber-300 font-semibold">{settings.designation}</span>
      </footer>
    </div>
  );
}
