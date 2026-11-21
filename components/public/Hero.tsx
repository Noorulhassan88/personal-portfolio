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
      {/* Subtle background mesh with golden & navy ambient glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0a192f]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Intro & Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* Intro Badge - Gold Accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-semibold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{settings.hero_intro}</span>
            </div>

            {/* Main Heading - Navy with Rich Presence */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#0a192f] leading-[1.14]">
              {settings.hero_heading}
            </h1>

            {/* Professional Designation - Gold / Amber with terminal prompt */}
            <div className="flex items-center gap-2 text-amber-600 font-bold text-base sm:text-lg tracking-tight">
              <Terminal className="w-4 h-4 shrink-0 text-[#0a192f]" />
              <span className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
                {settings.designation}
              </span>
            </div>

            {/* Description */}
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed max-w-2xl">
              {settings.description}
            </p>

            {/* Action Buttons - Navy & Gold Styling */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary: Deep Navy Blue with Gold Accent on hover */}
              <Link
                href={settings.button_explore_link || "/projects"}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0a192f] hover:bg-[#112240] text-amber-300 font-semibold text-xs sm:text-sm border border-amber-400/40 transition-all duration-200 shadow-md hover:shadow-lg hover:translate-y-[-1px]"
              >
                <span>{settings.button_explore_label || "Explore My Work"}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>

              {/* Secondary: Off-white with Gold Border */}
              <Link
                href={settings.button_about_link || "/about"}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#0a192f] border border-amber-300 hover:border-amber-500 font-semibold text-xs sm:text-sm hover:bg-amber-50/50 transition-all duration-200"
              >
                <span>{settings.button_about_label || "About Me"}</span>
              </Link>

              {/* Tertiary: Download Resume in Rich Gold Button */}
              {settings.resume_enabled && (
                <a
                  href={settings.resume_url || "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-950 border border-amber-400/80 font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-800" />
                  <span>{settings.button_resume_label || "Download Resume"}</span>
                </a>
              )}
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center gap-5 pt-3 border-t border-amber-900/10 w-full text-neutral-600">
              <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-amber-800">
                Connect
              </span>

              {settings.social_github && (
                <a
                  href={settings.social_github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0a192f] hover:text-amber-600 font-medium transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>GitHub</span>
                </a>
              )}

              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0a192f] hover:text-amber-600 font-medium transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>LinkedIn</span>
                </a>
              )}

              {settings.social_email && (
                <a
                  href={`mailto:${settings.social_email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0a192f] hover:text-amber-600 font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Photo Card with Gold Border & Navy Highlights */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-[380px]">
              {/* Decorative Navy & Gold Backdrop Frames */}
              <div className="absolute inset-0 rounded-2xl bg-[#0a192f] border border-amber-400/50 rotate-1 shadow-md transition-transform group-hover:rotate-0" />
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-tr from-amber-400 via-amber-300 to-[#0a192f] -rotate-1 -z-10 opacity-70" />

              {/* Main Photo Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-white shadow-xl flex flex-col">
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
                  /* Elegant Navy & Gold Monogram Placeholder */
                  <div className="w-full h-full bg-linear-to-b from-[#0a192f] to-[#112240] flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-[#0a192f] flex items-center justify-center text-2xl font-black tracking-wider mb-3 shadow-lg border-2 border-white/20">
                      NH
                    </div>
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {settings.name}
                    </h3>
                    <p className="text-[11px] text-amber-300 font-mono mt-0.5 font-medium">
                      {settings.designation}
                    </p>
                    <div className="mt-4 px-3.5 py-1 rounded-full bg-[#1b2f56] border border-amber-400/40 text-[10px] font-semibold text-amber-300 flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Ready for AI & Full Stack Roles</span>
                    </div>
                  </div>
                )}

                {/* Bottom Badge Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-[#0a192f]/95 backdrop-blur-md border border-amber-400/60 shadow-md flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-amber-200">
                      AI & Data Science • Crescent
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
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
