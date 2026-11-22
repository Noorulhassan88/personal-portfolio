import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumb?: string;
}

export default function PageHeader({
  badge,
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  // Sanitize description in case legacy text containing 'development philosophy' is passed
  const cleanDescription = description?.includes("development philosophy")
    ? "Discover my background, education, and technical expertise in building scalable software systems and applied AI."
    : description;

  return (
    <div className="pt-24 pb-8 sm:pt-28 sm:pb-12 md:pt-36 md:pb-16 border-b border-amber-500/20 bg-linear-to-b from-[#050c18] via-[#071324] to-[#0d1f38] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-300 mb-3 sm:mb-4 font-mono">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
            <span className="text-white font-semibold">{breadcrumb}</span>
          </div>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400 text-amber-300 text-xs font-mono font-bold tracking-wide mb-2.5 sm:mb-3 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            {badge}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.2] break-words">
          {title}
        </h1>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed break-words">
          {cleanDescription}
        </p>
      </div>
    </div>
  );
}
