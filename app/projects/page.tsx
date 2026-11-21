import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getProjects, getHomepageSettings, getSeoSettings } from "@/lib/db";
import ProjectsGallery from "@/components/public/ProjectsGallery";

export const revalidate = 0;

export async function generateMetadata() {
  const seo = await getSeoSettings();
  const projectsMeta = seo.page_meta?.["/projects"] || {};
  return {
    title: projectsMeta.title || "Projects Showcase | Noorul Hassan",
    description:
      projectsMeta.description ||
      "Explore CalQuity, RAG Chatbot with Voice & Emotion Detection, Heart Disease Prediction, Stock Price Prediction, and MNIST Digit Recognition.",
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getHomepageSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="PORTFOLIO WORK"
          title="Engineered Projects & Systems"
          description="A curated showcase of applications in artificial intelligence, full-stack web platforms, retrieval evaluation, and deep learning architectures."
          breadcrumb="Projects"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <ProjectsGallery initialProjects={projects} />
        </div>
      </main>

      <Footer
        name={settings.name}
        designation={settings.designation}
        githubUrl={settings.social_github}
        linkedinUrl={settings.social_linkedin}
        email={settings.social_email}
      />
    </div>
  );
}
