"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Footer from "@/components/public/Footer";
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
    window.addEventListener("portfolio_homepage_updated", handleStorageChange);
    window.addEventListener("portfolio_resume_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("portfolio_seo_updated", handleStorageChange);
      window.removeEventListener("portfolio_homepage_updated", handleStorageChange);
      window.removeEventListener("portfolio_resume_updated", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1 flex flex-col justify-center">
        <Hero settings={settings} />
      </main>

      <Footer
        name={settings.name}
        designation={settings.designation}
        githubUrl={settings.social_github}
        linkedinUrl={settings.social_linkedin}
        email={settings.social_email}
      />
    </div>
  );
}
