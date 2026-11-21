import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import DomainsSection from "@/components/public/DomainsSection";
import FeaturedProjects from "@/components/public/FeaturedProjects";
import { getHomepageSettings, getProjects } from "@/lib/db";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export const revalidate = 0; // Dynamic on admin change

export default async function HomePage() {
  const settings = await getHomepageSettings();
  const allProjects = await getProjects({ publishedOnly: true });

  // Filter featured projects according to settings or fallback to first 3
  const featured = allProjects.filter((p) =>
    settings.featured_project_ids?.includes(p.id)
  );
  const displayProjects = featured.length > 0 ? featured : allProjects.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        {settings.sections_enabled?.hero !== false && <Hero settings={settings} />}

        {settings.sections_enabled?.domains !== false && <DomainsSection />}

        {settings.sections_enabled?.featured_projects !== false && (
          <FeaturedProjects projects={displayProjects} />
        )}

        {/* Quick Contact CTA Strip */}
        {settings.sections_enabled?.quick_contact !== false && (
          <section className="py-16 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Have an intelligent system or full stack project in mind?
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Let&apos;s build scalable web applications and AI solutions together.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get in Touch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="px-5 py-3 rounded-full border border-neutral-700 hover:bg-neutral-800 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  Read My Bio
                </Link>
              </div>
            </div>
          </section>
        )}
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
