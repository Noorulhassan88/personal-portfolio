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
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
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
                className="group bg-white rounded-2xl border border-amber-200/90 overflow-hidden shadow-md hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Certificate image preview */}
                {cert.image_url && (
                  <div className="relative h-44 w-full overflow-hidden bg-[#0a192f] border-b border-amber-500/30">
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0a192f]/90 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3 h-3 text-amber-400" />
                      <span>Verified</span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 uppercase mb-2">
                      <Award className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{cert.issuing_organization}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#0a192f] tracking-tight leading-snug">
                      {cert.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono mt-3">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Issued: {formatDate(cert.issue_date)}</span>
                    </div>

                    {cert.credential_id && (
                      <div className="mt-2 text-[11px] font-mono text-neutral-500">
                        ID: <span className="text-[#0a192f] font-bold">{cert.credential_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    {cert.verification_url ? (
                      <a
                        href={cert.verification_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-[#112240] text-amber-300 text-xs font-bold transition-colors shadow-xs border border-amber-400/40"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-400 font-mono">
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
