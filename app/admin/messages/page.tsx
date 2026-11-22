"use client";

import React, { useState, useEffect } from "react";
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
  Inbox,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ContactMessage } from "@/types/portfolio";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">("all");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMessages = () => {
      fetch("/api/admin/data?section=messages")
        .then((res) => res.json())
        .then((res) => {
          if (isMounted && res.success && Array.isArray(res.data)) {
            setMessages(res.data);
            setSelectedMessage((prev) => {
              if (prev) {
                return res.data.find((m: ContactMessage) => m.id === prev.id) || res.data[0] || null;
              }
              return res.data[0] || null;
            });
            try {
              localStorage.setItem("portfolio_messages", JSON.stringify(res.data));
            } catch {}
          }
        })
        .catch(console.error)
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    // Load from cache initially for fast rendering, filtering out legacy sample messages
    try {
      const cached = localStorage.getItem("portfolio_messages");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (m: any) =>
              m.id !== "msg-1" &&
              m.id !== "msg-2" &&
              !m.email?.includes("ai-institute.org") &&
              !m.email?.includes("techventures.io")
          );
          setMessages(clean);
          if (clean.length > 0) setSelectedMessage(clean[0]);
          setLoading(false);
        }
      }
    } catch {}

    loadMessages();

    const handleSync = () => loadMessages();
    window.addEventListener("portfolio_messages_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener("portfolio_messages_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

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
    const newMessages = messages.map((m) => (m.id === msg.id ? updated : m));
    setMessages(newMessages);
    if (selectedMessage?.id === msg.id) setSelectedMessage(updated);

    try {
      localStorage.setItem("portfolio_messages", JSON.stringify(newMessages));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_messages_updated"));
    } catch {}

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateMessage",
          payload: { id: msg.id, updates: { is_read: updated.is_read } },
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleArchive = async (msg: ContactMessage) => {
    const updated = { ...msg, is_archived: !msg.is_archived };
    const newMessages = messages.map((m) => (m.id === msg.id ? updated : m));
    setMessages(newMessages);
    if (selectedMessage?.id === msg.id) setSelectedMessage(updated);

    try {
      localStorage.setItem("portfolio_messages", JSON.stringify(newMessages));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_messages_updated"));
    } catch {}

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateMessage",
          payload: { id: msg.id, updates: { is_archived: updated.is_archived } },
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    const remaining = messages.filter((m) => m.id !== id);
    setMessages(remaining);
    if (selectedMessage?.id === id) {
      setSelectedMessage(remaining[0] || null);
    }

    try {
      localStorage.setItem("portfolio_messages", JSON.stringify(remaining));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("portfolio_messages_updated"));
    } catch {}

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteMessage", payload: { id } }),
      });
      setStatusMessage("Message deleted successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length;
  const inboxCount = messages.filter((m) => !m.is_archived).length;
  const archivedCount = messages.filter((m) => m.is_archived).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-amber-400" />
              <span>Inbound Messages & Inquiries</span>
            </h1>
            <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Live Inbox
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            Real inquiries submitted by visitors via your website contact form.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            fetch("/api/admin/data?section=messages")
              .then((r) => r.json())
              .then((res) => {
                if (res.success && Array.isArray(res.data)) {
                  setMessages(res.data);
                  setSelectedMessage(res.data[0] || null);
                }
              })
              .finally(() => setLoading(false));
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1f38] hover:bg-[#142c50] border border-amber-400/40 text-amber-300 text-xs font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs overflow-hidden min-h-[580px]">
        {/* Left 5 Cols: Messages List */}
        <div className="lg:col-span-5 border-r border-amber-500/30 flex flex-col">
          {/* Tabs & Search */}
          <div className="p-4 border-b border-amber-500/20 space-y-3">
            <div className="flex items-center gap-1 bg-[#071324] p-1 rounded-xl text-xs font-semibold border border-amber-500/20">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === "all"
                    ? "bg-amber-400 text-[#071324] font-bold shadow-xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Inbox ({inboxCount})
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === "unread"
                    ? "bg-amber-400 text-[#071324] font-bold shadow-xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === "archived"
                    ? "bg-amber-400 text-[#071324] font-bold shadow-xs"
                    : "text-amber-200/80 hover:text-white"
                }`}
              >
                Archived ({archivedCount})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-amber-500/10 max-h-[500px]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-2" />
                <p className="text-xs text-amber-200/80">Loading inquiries...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">No Messages in {activeTab === "all" ? "Inbox" : activeTab}</p>
                  <p className="text-xs text-amber-200/70 max-w-xs mt-1 leading-relaxed">
                    When visitors submit inquiries via your website Contact form, they will appear here instantly.
                  </p>
                </div>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) handleToggleRead(msg);
                  }}
                  className={`p-4 cursor-pointer transition-colors border-l-2 ${
                    selectedMessage?.id === msg.id
                      ? "bg-[#142c50] border-amber-400"
                      : "hover:bg-[#071324]/80 border-transparent"
                  } ${!msg.is_read ? "font-semibold" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] shrink-0" />
                      )}
                      <span className="text-xs text-white font-bold truncate max-w-[170px]">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-300/70 font-mono">
                      {formatDateTime(msg.created_at)}
                    </span>
                  </div>

                  <div className="text-xs text-amber-300 line-clamp-1 mb-1 font-medium">
                    {msg.subject}
                  </div>
                  <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-[#071324] text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                  >
                    <MailCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}</span>
                  </button>
                  <button
                    onClick={() => handleToggleArchive(selectedMessage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-[#071324] text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {selectedMessage.is_archived ? "Move to Inbox" : "Archive"}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#071324] transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {selectedMessage.subject}
                </h2>

                <div className="p-4 rounded-xl bg-[#071324] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">
                      {selectedMessage.name}
                    </span>{" "}
                    <span className="text-amber-300 font-mono">
                      &lt;{selectedMessage.email}&gt;
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    {formatDateTime(selectedMessage.created_at)}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#071324]/80 border border-amber-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line shadow-2xs">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Button */}
              <div className="pt-4 border-t border-amber-500/20">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
                >
                  <Reply className="w-4 h-4 stroke-[2.5]" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <Mail className="w-10 h-10 text-amber-400/40" />
              <p className="text-xs">Select an inquiry from the list to view its complete details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
