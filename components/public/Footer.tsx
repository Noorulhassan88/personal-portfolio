import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";

interface FooterProps {
  name?: string;
  designation?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export default function Footer({
  name = "Noorul Hassan",
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  email = "noorulhassan.ai@gmail.com",
}: FooterProps) {
  return (
    <footer className="mt-auto border-t border-amber-500/25 bg-[#050c18] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#0d1f38] border-2 border-amber-400 text-amber-400 flex items-center justify-center font-extrabold text-base tracking-wider shadow-md">
                NH
              </span>
              <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                {name}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              Full Stack Developer and AI Engineer passionate about building scalable
              applications, intelligent systems and innovative digital experiences using
              modern web technologies and artificial intelligence.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
              <span className="text-xs sm:text-sm font-semibold text-amber-300">
                Available for engineering opportunities & AI collaborations
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm sm:text-base font-medium text-slate-200">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-amber-300 transition-colors">
                  Technical Skills
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-300 transition-colors">
                  Projects Showcase
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-amber-300 transition-colors">
                  Experience & Timeline
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-amber-300 transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
              Connect
            </h4>
            <div className="flex flex-col space-y-3 text-sm sm:text-base font-medium">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-amber-400" />
                <span>GitHub</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400/70" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 text-amber-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-4 h-4 text-amber-400/70" />
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Clean and Large, No tech text, No 2026 */}
        <div className="pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300 font-medium text-center sm:text-left">
          <div className="text-center sm:text-left">
            <span className="text-white font-bold">{name}</span>
            <span className="mx-2.5 text-amber-400">•</span>
            <span className="text-amber-300">Full Stack Developer & AI Engineer</span>
          </div>
          <div>
            <Link href="/contact" className="text-amber-400 hover:text-amber-300 font-bold transition-colors inline-flex items-center gap-1.5">
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
