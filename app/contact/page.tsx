import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import ContactForm from "@/components/public/ContactForm";
import { getHomepageSettings, getSeoSettings } from "@/lib/db";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

export const revalidate = 0;

export async function generateMetadata() {
  const seo = await getSeoSettings();
  const contactMeta = seo.page_meta?.["/contact"] || {};
  return {
    title: contactMeta.title || "Contact | Noorul Hassan",
    description:
      contactMeta.description ||
      "Get in touch with Noorul Hassan for software engineering positions, AI consulting, or technical collaborations.",
  };
}

export default async function ContactPage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="GET IN TOUCH"
          title="Let's Build Something Intelligent"
          description="Have an ambitious software system to build, an AI opportunity, or want to collaborate on engineering research? Reach out directly."
          breadcrumb="Contact"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Direct Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
                  Direct Inquiries & Communication
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  I typically respond to inquiries within 24 business hours. You can
                  reach me through this form, email me directly, or connect on professional networks.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${settings.social_email}`}
                  className="interactive-card flex items-center gap-4 p-5 rounded-2xl bg-[#0d1f38] border border-amber-500/30 hover:border-amber-400 group transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#071324] text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-400 group-hover:text-[#071324] transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono text-slate-400">Email Directly</div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {settings.social_email}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </a>

                {settings.social_github && (
                  <a
                    href={settings.social_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-card flex items-center gap-4 p-5 rounded-2xl bg-[#0d1f38] border border-amber-500/30 hover:border-amber-400 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#071324] text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-400 group-hover:text-[#071324] transition-all">
                      <GithubIcon className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-slate-400">GitHub Profile</div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        View Repositories & Open Source
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  </a>
                )}

                {settings.social_linkedin && (
                  <a
                    href={settings.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-card flex items-center gap-4 p-5 rounded-2xl bg-[#0d1f38] border border-amber-500/30 hover:border-amber-400 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#071324] text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-400 group-hover:text-[#071324] transition-all">
                      <LinkedinIcon className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-slate-400">LinkedIn Profile</div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        Professional Network & Endorsements
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Interactive Form Component */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
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
