import React from "react";
import HomePageClient from "@/components/public/HomePageClient";
import { getHomepageSettings } from "@/lib/db";

export const revalidate = 0; // Dynamic on admin change

export default async function HomePage() {
  const settings = await getHomepageSettings();

  return <HomePageClient initialSettings={settings} />;
}
