import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/db";
import "./globals.css";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const title =
    seo.global_title || "Noorul Hassan | Full Stack Developer & AI Engineer";
  const description =
    seo.global_description ||
    "Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer specializing in modern web applications, LLMs, RAG, and intelligent systems.";
  const ogImage = seo.og_image_url || "/profile.png";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth dark">
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#071324] text-[#f8fafc] selection:bg-amber-400 selection:text-[#071324]">
        {children}
      </body>
    </html>
  );
}
