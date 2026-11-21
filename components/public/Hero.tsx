"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  Mail,
  User,
  Sparkles,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/SocialIcons";
import { HomepageSettings } from "@/types/portfolio";

interface HeroProps {
  settings: HomepageSettings;
}

export default function Hero({ settings }: HeroProps) {
  const [imgError, setImgError] = useState(false);

  const photoPos = settings.profile_photo_position || { x: 50, y: 50, scale: 1 };

  return (
    <section className="relative pt-24 pb-8 md:pt-28 md:pb-10 overflow-hidden">
      {/* Subtle background mesh/dots */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Intro & Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* Small Intro Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <span>{settings.hero_intro}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-neutral-900 leading-[1.14]">
              {settings.hero_heading}
            </h1>

            {/* Professional Designation */}
            <div className="flex items-center gap-2 text-blue-600 font-medium text-base sm:text-lg tracking-tight">
              <Terminal className="w-4 h-4 shrink-0" />
              <span>{settings.designation}</span>
            </div>

            {/* Description */}
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {settings.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={settings.button_explore_link || "/projects"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-xs sm:text-sm hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md hover:translate-y-[-1px]"
              >
                <span>{settings.button_explore_label || "Explore My Work"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={settings.button_about_link || "/about"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-800 border border-neutral-300 font-medium text-xs sm:text-sm hover:bg-neutral-50 transition-all duration-200 hover:border-neutral-400"
              >
                <span>{settings.button_about_label || "About Me"}</span>
              </Link>

              {settings.resume_enabled && (
                <a
                  href={settings.resume_url || "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-medium text-xs sm:text-sm hover:bg-blue-100/70 transition-all duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{settings.button_resume_label || "Download Resume"}</span>
                </a>
              )}
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center gap-5 pt-3 border-t border-neutral-200/80 w-full text-neutral-500">
              <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400">
                Connect
              </span>

              {settings.social_github && (
                <a
                  href={settings.social_github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}

              {settings.social_email && (
                <a
                  href={`mailto:${settings.social_email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Photo Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-[380px]">
              {/* Decorative Frame */}
              <div className="absolute inset-0 rounded-2xl bg-neutral-100 border border-neutral-200 rotate-1 shadow-sm transition-transform group-hover:rotate-0" />
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-tr from-blue-500/10 via-transparent to-neutral-200 -rotate-1 -z-10" />

              {/* Main Photo Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-300/80 bg-white shadow-lg flex flex-col">
                {settings.profile_photo_url && !imgError ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={settings.profile_photo_url}
                      alt={settings.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      style={{
                        objectPosition: `${photoPos.x}% ${photoPos.y}%`,
                        transform: `scale(${photoPos.scale || 1})`,
                      }}
                      onError={() => setImgError(true)}
                      priority
                    />
                  </div>
                ) : (
                  /* Elegant Minimalist Placeholder */
                  <div className="w-full h-full bg-linear-to-b from-neutral-50 to-neutral-100 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-neutral-900 text-white flex items-center justify-center text-2xl font-bold tracking-wider mb-3 shadow-md">
                      NH
                    </div>
                    <h3 className="font-semibold text-base text-neutral-900 tracking-tight">
                      {settings.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      {settings.designation}
                    </p>
                    <div className="mt-4 px-3 py-1 rounded-full bg-neutral-200/60 text-[10px] font-medium text-neutral-700 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Ready for AI & Full Stack Roles</span>
                    </div>
                  </div>
                )}

                {/* Subtle bottom badge overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-medium text-neutral-800">
                      AI & Data Science • Crescent
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
