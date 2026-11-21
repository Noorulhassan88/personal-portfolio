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
    <div className="pt-28 pb-12 md:pt-36 md:pb-16 border-b border-neutral-200/80 bg-linear-to-b from-white to-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-medium">{breadcrumb}</span>
          </div>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-mono font-medium tracking-wide mb-3">
            {badge}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 max-w-3xl">
          {title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
