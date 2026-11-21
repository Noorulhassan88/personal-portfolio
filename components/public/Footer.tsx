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
    <footer className="mt-auto border-t border-amber-500/20 bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#112240] border border-amber-400/70 text-amber-400 flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                NH
              </span>
              <span className="font-bold text-base text-white tracking-tight">
                {name}
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-sm leading-relaxed">
              Full Stack Developer and AI Engineer passionate about building scalable
              applications, intelligent systems and innovative digital experiences using
              modern web technologies and artificial intelligence.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-medium text-amber-300">
                Available for engineering opportunities & AI collaborations
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
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
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Connect
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-500" />
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} {name}. Built with Next.js, TypeScript & Supabase.
          </div>
          <div>
            <Link href="/contact" className="hover:text-amber-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
