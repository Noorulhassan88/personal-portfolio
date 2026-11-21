import React from "react";
import Link from "next/link";
import {
  FolderGit2,
  Wrench,
  Award,
  Briefcase,
  Mail,
  Eye,
  Plus,
  Sparkles,
  FileText,
  Home,
} from "lucide-react";
import {
  getProjects,
  getSkills,
  getCertifications,
  getExperience,
  getContactMessages,
  getHomepageSettings,
} from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [projects, skills, certs, experience, messages, settings] =
    await Promise.all([
      getProjects(),
      getSkills(false),
      getCertifications(false),
      getExperience(false),
      getContactMessages(),
      getHomepageSettings(),
    ]);

  const unreadMessages = messages.filter((m) => !m.is_read);

  const stats = [
    {
      name: "Published Projects",
      value: projects.filter((p) => p.is_published).length,
      total: projects.length,
      icon: FolderGit2,
      href: "/admin/projects",
      color: "bg-[#0a192f] text-amber-400 border border-amber-400/30",
    },
    {
      name: "Technical Skills",
      value: skills.filter((s) => s.is_active).length,
      total: skills.length,
      icon: Wrench,
      href: "/admin/skills",
      color: "bg-[#112240] text-amber-300 border border-amber-400/30",
    },
    {
      name: "Certifications",
      value: certs.filter((c) => c.is_published).length,
      total: certs.length,
      icon: Award,
      href: "/admin/certifications",
      color: "bg-amber-50 text-amber-800 border border-amber-300",
    },
    {
      name: "Timeline Entries",
      value: experience.length,
      total: experience.length,
      icon: Briefcase,
      href: "/admin/experience",
      color: "bg-[#1b2f56] text-amber-300 border border-amber-400/30",
    },
    {
      name: "Inbox Messages",
      value: unreadMessages.length,
      label: "unread",
      total: messages.length,
      icon: Mail,
      href: "/admin/messages",
      color: "bg-amber-100 text-amber-900 border border-amber-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner - Navy & Gold Accent */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#0a192f] via-[#112240] to-[#0a192f] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg border border-amber-500/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PORTFOLIO CMS • NAVY & GOLD EDITION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {settings.name}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
            Manage your personal portfolio, edit technical projects, review contact messages,
            and customize website appearance in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a192f] text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Project</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b2f56] hover:bg-[#233e70] text-amber-200 border border-amber-400/40 text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>View Live Site</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="p-5 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-amber-200/80 font-medium mt-0.5">
                  {stat.label ? `${stat.label} of ${stat.total}` : `of ${stat.total} total`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Strip */}
      <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/homepage"
            className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] hover:bg-[#142c50] text-xs sm:text-sm font-bold text-white hover:text-amber-300 flex items-center gap-2.5 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Edit Hero & Profile</span>
          </Link>
          <Link
            href="/admin/projects"
            className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] hover:bg-[#142c50] text-xs sm:text-sm font-bold text-white hover:text-amber-300 flex items-center gap-2.5 transition-colors shadow-sm"
          >
            <FolderGit2 className="w-4 h-4 text-amber-400" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/admin/resume"
            className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] hover:bg-[#142c50] text-xs sm:text-sm font-bold text-white hover:text-amber-300 flex items-center gap-2.5 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Update Resume</span>
          </Link>
          <Link
            href="/admin/certifications"
            className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] hover:bg-[#142c50] text-xs sm:text-sm font-bold text-white hover:text-amber-300 flex items-center gap-2.5 transition-colors shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Add Certificate</span>
          </Link>
          <Link
            href="/admin/messages"
            className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] hover:bg-[#142c50] text-xs sm:text-sm font-bold text-white hover:text-amber-300 flex items-center gap-2.5 transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Check Inbox</span>
          </Link>
        </div>
      </div>

      {/* Two Columns: Recent Messages & Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Recent Messages */}
        <div className="lg:col-span-7 bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Recent Inbound Inquiries
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                View All ({messages.length})
              </Link>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      !msg.is_read
                        ? "bg-[#142c50] border-amber-400/60"
                        : "bg-[#071324] border-amber-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]" />
                        )}
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-200/80">
                        {formatDateTime(msg.created_at)}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-amber-300 mb-1">
                      {msg.subject}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Showcase */}
        <div className="lg:col-span-5 bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Projects Library
                </h3>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Manage ({projects.length})
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-[#071324] flex items-center justify-between transition-colors shadow-xs"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {project.title}
                      </h4>
                      {project.is_featured && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#142c50] text-amber-300 border border-amber-400/50">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-amber-200/80 font-mono">
                      {project.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
