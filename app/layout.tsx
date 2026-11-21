import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noorul Hassan | Full Stack Developer & AI Engineer",
  description:
    "Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer specializing in modern web applications, LLMs, RAG, and intelligent systems.",
};

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
