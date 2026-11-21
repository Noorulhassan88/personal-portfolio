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
    <section className="relative pt-24 pb-8 md:pt-28 md:pb-10 overflow-hidden bg-[#071324]">
      {/* Background radial gold glow and deep navy ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(212,175,55,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Intro & Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* Intro Badge - Gold on Navy */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d1f38] border border-amber-400/60 text-amber-300 text-xs font-mono font-bold tracking-wide shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
              <span>{settings.hero_intro}</span>
            </div>

            {/* Main Heading - High Contrast White with Gold Accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.14]">
              Building{" "}
              <span className="bg-linear-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Intelligent Products
              </span>{" "}
              & Digital Experiences.
            </h1>

            {/* Professional Designation - Luminous Gold */}
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg tracking-tight">
              <Terminal className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-amber-300 font-mono tracking-wide">
                {settings.designation}
              </span>
            </div>

            {/* Description - Slate/Silver text */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {settings.description}
            </p>

            {/* Action Buttons - Navy & Gold Styling with High Visibility */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary: Luminous Gold with Deep Navy text */}
              <Link
                href={settings.button_explore_link || "/projects"}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:scale-[1.03] transition-all duration-200 border-2 border-amber-300 tracking-wide"
              >
                <span>{settings.button_explore_label || "Explore My Work"}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              {/* Secondary: Navy Card with Gold Border */}
              <Link
                href={settings.button_about_link || "/about"}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0d1f38] text-amber-300 border-2 border-amber-400/80 hover:bg-[#142c50] hover:border-amber-300 font-bold text-sm sm:text-base transition-all duration-200 shadow-md tracking-wide"
              >
                <span>{settings.button_about_label || "About Me"}</span>
              </Link>

              {/* Tertiary: Download Resume */}
              {settings.resume_enabled && (
                <a
                  href={settings.resume_url || "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border-2 border-amber-400/80 font-bold text-sm sm:text-base transition-all duration-200 shadow-sm tracking-wide"
                >
                  <Download className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                  <span>{settings.button_resume_label || "Download Resume"}</span>
                </a>
              )}
            </div>

            {/* Social Links Bar */}
            <div className="flex items-center gap-5 pt-3 border-t border-amber-500/20 w-full text-neutral-400">
              <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-amber-400">
                Connect
              </span>

              {settings.social_github && (
                <a
                  href={settings.social_github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-300 font-medium transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>GitHub</span>
                </a>
              )}

              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-300 font-medium transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>LinkedIn</span>
                </a>
              )}

              {settings.social_email && (
                <a
                  href={`mailto:${settings.social_email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-300 font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Profile Photo Card with Gold Border & Navy Highlights */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-[380px]">
              {/* Outer Glowing Golden Border */}
              <div className="absolute -inset-1.5 rounded-3xl bg-linear-to-tr from-amber-400 via-amber-500 to-amber-300 opacity-60 blur-xs -z-10 animate-pulse" />

              {/* Decorative Navy Backdrop Frame */}
              <div className="absolute inset-0 rounded-2xl bg-[#0d1f38] border-2 border-amber-400/80 shadow-2xl transition-transform group-hover:rotate-0" />

              {/* Main Photo Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400 bg-[#071324] shadow-2xl flex flex-col">
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
                  /* Elegant Navy & Gold Monogram Card */
                  <div className="w-full h-full bg-linear-to-b from-[#0a192f] via-[#0d1f38] to-[#071324] flex flex-col items-center justify-center p-6 text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-[#071324] flex items-center justify-center text-2xl font-black tracking-wider mb-3 shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-amber-200">
                      NH
                    </div>
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {settings.name}
                    </h3>
                    <p className="text-[11px] text-amber-300 font-mono mt-0.5 font-semibold">
                      {settings.designation}
                    </p>
                    <div className="mt-4 px-3.5 py-1 rounded-full bg-[#142c50] border border-amber-400/60 text-[10px] font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Ready for AI & Full Stack Roles</span>
                    </div>
                  </div>
                )}

                {/* Bottom Badge Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-[#071324]/95 backdrop-blur-md border border-amber-400/70 shadow-lg flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]" />
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
