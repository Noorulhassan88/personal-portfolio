import React from "react";
import AboutClient from "@/components/public/AboutClient";
import { getAboutContent, getHomepageSettings } from "@/lib/db";

export const revalidate = 0;

export async function generateMetadata() {
  const about = await getAboutContent();
  return {
    title: "About Me | Noorul Hassan",
    description:
      about.header_description ||
      "Biography, education at B.S. Abdur Rahman Crescent Institute of Science and Technology, and areas of specialization.",
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    getAboutContent(),
    getHomepageSettings(),
  ]);

  return <AboutClient initialAbout={about} settings={settings} />;
}
