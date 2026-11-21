import React from "react";
import ExperienceClient from "@/components/public/ExperienceClient";
import { getExperience, getHomepageSettings, getSeoSettings } from "@/lib/db";

export const revalidate = 0;

export async function generateMetadata() {
  const seo = await getSeoSettings();
  const expMeta = seo.page_meta?.["/experience"] || {};
  return {
    title: expMeta.title || "Experience & Timeline | Noorul Hassan",
    description:
      expMeta.description ||
      "Professional journey, internships, technical training, and engineering contributions in AI and Full Stack Development.",
  };
}

export default async function ExperiencePage() {
  const [experience, settings] = await Promise.all([
    getExperience(true),
    getHomepageSettings(),
  ]);

  return (
    <ExperienceClient
      initialExperience={experience}
      settings={settings}
    />
  );
}
