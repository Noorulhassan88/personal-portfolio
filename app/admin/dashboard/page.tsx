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
  ArrowRight,
  ExternalLink,
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
      color: "bg-blue-50 text-blue-700",
    },
    {
      name: "Technical Skills",
      value: skills.filter((s) => s.is_active).length,
      total: skills.length,
      icon: Wrench,
      href: "/admin/skills",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      name: "Certifications",
      value: certs.filter((c) => c.is_published).length,
      total: certs.length,
      icon: Award,
      href: "/admin/certifications",
      color: "bg-amber-50 text-amber-700",
    },
    {
      name: "Timeline Entries",
      value: experience.length,
      total: experience.length,
      icon: Briefcase,
      href: "/admin/experience",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      name: "Inbox Messages",
      value: unreadMessages.length,
      label: "unread",
      total: messages.length,
      icon: Mail,
      href: "/admin/messages",
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-blue-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO CMS ACTIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {settings.name}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Manage your personal portfolio, edit technical projects, review contact messages,
            and customize website appearance in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4" />
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
              className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-500">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {stat.label ? `${stat.label} of ${stat.total}` : `of ${stat.total} total`}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Strip */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/homepage"
            className="p-3 rounded-xl border border-neutral-200 hover:border-blue-400 bg-neutral-50/50 hover:bg-white text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Edit Hero & Profile</span>
          </Link>
          <Link
            href="/admin/projects"
            className="p-3 rounded-xl border border-neutral-200 hover:border-blue-400 bg-neutral-50/50 hover:bg-white text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/admin/resume"
            className="p-3 rounded-xl border border-neutral-200 hover:border-blue-400 bg-neutral-50/50 hover:bg-white text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Update Resume</span>
          </Link>
          <Link
            href="/admin/certifications"
            className="p-3 rounded-xl border border-neutral-200 hover:border-blue-400 bg-neutral-50/50 hover:bg-white text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>Add Certificate</span>
          </Link>
          <Link
            href="/admin/messages"
            className="p-3 rounded-xl border border-neutral-200 hover:border-blue-400 bg-neutral-50/50 hover:bg-white text-xs font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Check Inbox</span>
          </Link>
        </div>
      </div>

      {/* Two Columns: Recent Messages & Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Recent Messages */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Recent Inbound Inquiries
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All ({messages.length})
              </Link>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      !msg.is_read
                        ? "bg-blue-50/40 border-blue-200"
                        : "bg-neutral-50/60 border-neutral-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                        <span className="text-xs font-bold text-neutral-900">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {formatDateTime(msg.created_at)}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-neutral-700 mb-1">
                      {msg.subject}
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Published Projects List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Featured Showcase
                </h3>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Manage ({projects.length})
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/40 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {project.title}
                      </h4>
                      {project.is_featured && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-100 text-blue-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {project.category}
                    </span>
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
