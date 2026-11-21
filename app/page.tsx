import React from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import { getHomepageSettings } from "@/lib/db";

export const revalidate = 0; // Dynamic on admin change

export default async function HomePage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] overflow-hidden">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1 flex flex-col justify-center">
        <Hero settings={settings} />
      </main>

      {/* Subtle minimal bottom bar to complete the viewport without scrolling */}
      <footer className="py-3 px-4 border-t border-neutral-200/60 bg-white/40 text-center text-[11px] text-neutral-500">
        © {new Date().getFullYear()} {settings.name} • Full Stack Developer & AI Engineer
      </footer>
    </div>
  );
}
