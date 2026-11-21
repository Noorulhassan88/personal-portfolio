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
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
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
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-200/90 shadow-md space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0a192f] tracking-tight">
                    Direct Channels
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Connect through your preferred network.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href={`mailto:${settings.social_email}`}
                    className="group p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase text-amber-800 font-bold">
                          Email
                        </div>
                        <div className="text-xs font-bold text-[#0a192f] group-hover:text-amber-600 transition-colors">
                          {settings.social_email}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-amber-600 transition-colors" />
                  </a>

                  {settings.social_linkedin && (
                    <a
                      href={settings.social_linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-xs">
                          <LinkedinIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase text-amber-800 font-bold">
                            LinkedIn
                          </div>
                          <div className="text-xs font-bold text-[#0a192f] group-hover:text-amber-600 transition-colors">
                            Professional Profile
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-amber-600 transition-colors" />
                    </a>
                  )}

                  {settings.social_github && (
                    <a
                      href={settings.social_github}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-xs">
                          <GithubIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono uppercase text-amber-800 font-bold">
                            GitHub
                          </div>
                          <div className="text-xs font-bold text-[#0a192f] group-hover:text-amber-600 transition-colors">
                            Source Repositories
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-amber-600 transition-colors" />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Notice - Deep Navy & Gold */}
              <div className="p-6 rounded-2xl bg-[#0a192f] text-white shadow-xl border border-amber-400/40 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Open for Opportunities
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
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
