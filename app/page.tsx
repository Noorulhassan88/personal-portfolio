import React from "react";
import HomePageClient from "@/components/public/HomePageClient";
import { getHomepageSettings, getSeoSettings } from "@/lib/db";

export const revalidate = 0; // Dynamic on admin change

export async function generateMetadata() {
  const seo = await getSeoSettings();
  const homeMeta = seo.page_meta?.["/"] || {};
  return {
    title: homeMeta.title || seo.global_title || "Noorul Hassan | Full Stack Developer & AI Engineer",
    description:
      homeMeta.description ||
      seo.global_description ||
      "Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer specializing in modern web applications, LLMs, RAG, and intelligent systems.",
  };
}

export default async function HomePage() {
  const settings = await getHomepageSettings();

  return <HomePageClient initialSettings={settings} />;
}
