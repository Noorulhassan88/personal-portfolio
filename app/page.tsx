import React from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import { getHomepageSettings } from "@/lib/db";

export const revalidate = 0; // Dynamic on admin change

export default async function HomePage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcfbf9] overflow-hidden">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1 flex flex-col justify-center">
        <Hero settings={settings} />
      </main>

      {/* Navy & Gold Bottom Bar */}
      <footer className="py-3 px-4 border-t border-amber-400/20 bg-[#0a192f] text-center text-[11px] text-amber-200/80">
        <span className="text-white font-medium">© {new Date().getFullYear()} {settings.name}</span>
        <span className="mx-2 text-amber-400">•</span>
        <span className="text-amber-400 font-semibold">Full Stack Developer & AI Engineer</span>
      </footer>
    </div>
  );
}
