"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver message. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An error occurred while submitting."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-8 md:p-10 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xl space-y-5 sm:space-y-6 text-white"
    >
      <div className="border-b border-amber-500/20 pb-4">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
          Send a Direct Message
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          I will respond to all inquiries regarding roles, projects, and collaborations promptly.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400 text-amber-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-amber-300">Message delivered successfully!</p>
            <p className="text-amber-200 mt-0.5">
              Thank you for reaching out. Your message is safely stored and I will get back to you shortly.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-400 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Unable to send message</p>
            <p className="text-red-200 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
            Your Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
          Subject *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Collaboration on AI / Full Stack Opportunity"
          className="w-full px-4 py-2.5 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
          Message *
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your project, timeline, or engineering opportunity..."
          className="w-full px-4 py-3 rounded-xl border border-amber-500/30 bg-[#071324] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-full bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base tracking-wide transition-all duration-150 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:scale-[1.02] active:scale-95 border-2 border-amber-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-[#071324]" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5 stroke-[2.5]" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
