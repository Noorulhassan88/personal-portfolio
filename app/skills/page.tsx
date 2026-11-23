import React from "react";
import {
  getSkillCategories,
  getSkills,
  getHomepageSettings,
  getSeoSettings,
} from "@/lib/db";
import SkillsClient from "@/components/public/SkillsClient";

export const revalidate = 30;

export async function generateMetadata() {
  const seo = await getSeoSettings();
  const skillsMeta = seo.page_meta?.["/skills"] || {};
  return {
    title: skillsMeta.title || "Technical Skills | Noorul Hassan",
    description:
      skillsMeta.description ||
      "Comprehensive skills across Frontend, Backend, AI & Machine Learning, Databases, and DevOps Tools.",
  };
}

export default async function SkillsPage() {
  const [categories, skills, settings] = await Promise.all([
    getSkillCategories(),
    getSkills(true),
    getHomepageSettings(),
  ]);

  return (
    <SkillsClient
      initialCategories={categories}
      initialSkills={skills}
      settings={settings}
    />
  );
}
