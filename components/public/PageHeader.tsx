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
  return (
    <div className="pt-28 pb-12 md:pt-36 md:pb-16 border-b border-amber-500/20 bg-linear-to-b from-[#0a192f] to-[#112240] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 mb-4 font-mono">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
            <span className="text-white font-semibold">{breadcrumb}</span>
          </div>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold tracking-wide mb-3 shadow-xs">
            {badge}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl">
          {title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
