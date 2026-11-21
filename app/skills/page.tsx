import React from "react";
import { getSkillCategories, getSkills, getHomepageSettings } from "@/lib/db";
import SkillsClient from "@/components/public/SkillsClient";

export const revalidate = 0;

export const metadata = {
  title: "Technical Skills | Noorul Hassan",
  description:
    "Comprehensive skills across Frontend, Backend, AI & Machine Learning, Databases, and DevOps Tools.",
};

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
