import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import ContactForm from "@/components/public/ContactForm";
import { getHomepageSettings } from "@/lib/db";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

export const revalidate = 0;

export const metadata = {
  title: "Contact | Noorul Hassan",
  description:
    "Get in touch with Noorul Hassan for software engineering positions, AI consulting, or technical collaborations.",
};

export default async function ContactPage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="GET IN TOUCH"
          title="Let's Connect & Collaborate"
          description="Have an intelligent AI product or full-stack software application you want to build? Reach out directly via the form or my social channels."
          breadcrumb="Contact"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Cols: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right 5 Cols: Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Direct Channels
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Connect through your preferred network.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href={`mailto:${settings.social_email}`}
                    className="group p-4 rounded-xl border border-neutral-100 hover:border-blue-200 bg-neutral-50/50 hover:bg-blue-50/30 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-400">
                          Email
                        </div>
                        <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {settings.social_email}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                  </a>

                  {settings.social_linkedin && (
                    <a
                      href={settings.social_linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-4 rounded-xl border border-neutral-100 hover:border-blue-200 bg-neutral-50/50 hover:bg-blue-50/30 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <LinkedinIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase text-neutral-400">
                            LinkedIn
                          </div>
                          <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            Professional Profile
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  )}

                  {settings.social_github && (
                    <a
                      href={settings.social_github}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-4 rounded-xl border border-neutral-100 hover:border-blue-200 bg-neutral-50/50 hover:bg-blue-50/30 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                          <GithubIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase text-neutral-400">
                            GitHub
                          </div>
                          <div className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            Source Repositories
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Notice */}
              <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Open for Opportunities
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Available for full-time Full Stack Developer and AI Engineering roles,
                  RAG pipeline architecture, and scalable software development.
                </p>
              </div>
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
