import React from "react";
import AboutClient from "@/components/public/AboutClient";
import { getAboutContent, getHomepageSettings, getSeoSettings } from "@/lib/db";

export const revalidate = 30;

export async function generateMetadata() {
  const [about, seo] = await Promise.all([
    getAboutContent(),
    getSeoSettings(),
  ]);
  const aboutMeta = seo.page_meta?.["/about"] || {};
  return {
    title: aboutMeta.title || "About Me | Noorul Hassan",
    description:
      aboutMeta.description ||
      about.header_description ||
      "Biography, academic foundation, areas of specialization, and technical engineering expertise.",
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getAboutContent(),
    getHomepageSettings(),
  ]);

  return <AboutClient initialAbout={about} settings={settings} />;
}
