"use client";

import React, { useState } from "react";
import {
  Mail,
  Trash2,
  Archive,
  CheckCircle2,
  MailCheck,
  Search,
  Filter,
  Reply,
  Calendar,
} from "lucide-react";
import { ContactMessage } from "@/types/portfolio";
import { initialContactMessages } from "@/data/initialData";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    messages[0] || null
  );

  const filteredMessages = messages.filter((m) => {
    const matchesTab =
      activeTab === "all"
        ? !m.is_archived
        : activeTab === "unread"
        ? !m.is_read && !m.is_archived
        : m.is_archived;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const handleToggleRead = async (msg: ContactMessage) => {
    const updated = { ...msg, is_read: !msg.is_read };
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateMessage",
          payload: { id: msg.id, updates: { is_read: updated.is_read } },
        }),
      });
      setMessages(messages.map((m) => (m.id === msg.id ? updated : m)));
      if (selectedMessage?.id === msg.id) setSelectedMessage(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleArchive = async (msg: ContactMessage) => {
    const updated = { ...msg, is_archived: !msg.is_archived };
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateMessage",
          payload: { id: msg.id, updates: { is_archived: updated.is_archived } },
        }),
      });
      setMessages(messages.map((m) => (m.id === msg.id ? updated : m)));
      if (selectedMessage?.id === msg.id) setSelectedMessage(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteMessage", payload: { id } }),
      });
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(messages.find((m) => m.id !== id) || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Inbound Messages & Inquiries
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Review submissions received via the public contact form.
          </p>
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs overflow-hidden min-h-[600px]">
        {/* Left 5 Cols: Messages List */}
        <div className="lg:col-span-5 border-r border-amber-500/30 flex flex-col">
          {/* Tabs & Search */}
          <div className="p-4 border-b border-amber-500/20 space-y-3">
            <div className="flex items-center gap-1 bg-[#142c50] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === "all"
                    ? "bg-[#0d1f38] text-white shadow-2xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Inbox ({messages.filter((m) => !m.is_archived).length})
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === "unread"
                    ? "bg-[#0d1f38] text-white shadow-2xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Unread ({messages.filter((m) => !m.is_read && !m.is_archived).length})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === "archived"
                    ? "bg-[#0d1f38] text-white shadow-2xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Archived
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-amber-500/30 text-xs text-white"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) handleToggleRead(msg);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id
                      ? "bg-blue-50/60"
                      : "hover:bg-[#071324]/80"
                  } ${!msg.is_read ? "font-semibold" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <span className="text-xs text-white truncate max-w-[160px]">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(msg.created_at)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-100 line-clamp-1 mb-1">
                    {msg.subject}
                  </div>
                  <div className="text-[11px] text-amber-200/80 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 7 Cols: Active Message Viewer */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Header Action Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-[#071324] text-xs font-semibold text-amber-300"
                  >
                    <MailCheck className="w-3.5 h-3.5" />
                    <span>{selectedMessage.is_read ? "Mark Unread" : "Mark Read"}</span>
                  </button>
                  <button
                    onClick={() => handleToggleArchive(selectedMessage)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-[#071324] text-xs font-semibold text-amber-300"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>
                      {selectedMessage.is_archived ? "Unarchive" : "Archive"}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message Details */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white">
                  {selectedMessage.subject}
                </h2>

                <div className="p-4 rounded-xl bg-[#071324] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white">
                      {selectedMessage.name}
                    </span>{" "}
                    <span className="text-amber-200/80">
                      &lt;{selectedMessage.email}&gt;
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {formatDateTime(selectedMessage.created_at)}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0d1f38] border border-amber-500/30/80 text-xs sm:text-sm text-amber-300 leading-relaxed whitespace-pre-line shadow-2xs">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Button */}
              <div className="pt-4 border-t border-amber-500/20">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-colors shadow-xs"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select an inquiry on the left to read full contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
