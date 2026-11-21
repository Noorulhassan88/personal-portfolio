import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { getCertifications, getHomepageSettings } from "@/lib/db";
import { Award, ExternalLink, Calendar, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export const revalidate = 0;

export const metadata = {
  title: "Certifications | Noorul Hassan",
  description:
    "Verified credentials and certifications in Deep Learning, Full Stack Engineering, and Machine Learning.",
};

export default async function CertificationsPage() {
  const [certifications, settings] = await Promise.all([
    getCertifications(true),
    getHomepageSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#071324] text-white">
      <Navbar name={settings.name} designation={settings.designation} />

      <main className="flex-1">
        <PageHeader
          badge="VERIFIED CREDENTIALS"
          title="Certifications & Specializations"
          description="Industry certifications demonstrating continuous technical rigor in AI, Deep Learning, and Web Architecture."
          breadcrumb="Certifications"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="interactive-card group bg-[#0d1f38] rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Certificate image preview */}
                {cert.image_url && (
                  <div className="relative h-44 w-full overflow-hidden bg-[#071324] border-b border-amber-500/30">
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      fill
                      unoptimized={
                        cert.image_url.startsWith("data:") ||
                        cert.image_url.startsWith("http")
                      }
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#071324]/90 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3 h-3 text-amber-400" />
                      <span>Verified</span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase mb-2">
                      <Award className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{cert.issuing_organization}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {cert.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-amber-200/80 font-mono mt-3">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Issued: {formatDate(cert.issue_date)}</span>
                    </div>

                    {cert.credential_id && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400">
                        ID: <span className="text-amber-300 font-bold">{cert.credential_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-amber-500/20">
                    {cert.verification_url ? (
                      <a
                        href={cert.verification_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-shine active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] text-sm font-extrabold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-300"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-4 h-4 text-[#071324] stroke-[2.5]" />
                      </a>
                    ) : (
                      <span className="text-xs text-amber-300/80 font-mono">
                        Credential ID verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
