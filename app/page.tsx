import React from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import { getHomepageSettings } from "@/lib/db";

export const revalidate = 0; // Dynamic on admin change

export default async function HomePage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#071324] text-white overflow-hidden">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1 flex flex-col justify-center">
        <Hero settings={settings} />
      </main>

      {/* Navy & Gold Bottom Bar */}
      <footer className="py-3.5 px-4 border-t border-amber-500/20 bg-[#050c18] text-center text-xs sm:text-sm text-amber-200/90 font-medium">
        <span className="text-white font-bold">{settings.name}</span>
        <span className="mx-2.5 text-amber-400">•</span>
        <span className="text-amber-400 font-semibold">Full Stack Developer & AI Engineer</span>
      </footer>
    </div>
  );
}
