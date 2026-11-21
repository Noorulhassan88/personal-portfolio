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
      className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6"
    >
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Send a Direct Message
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          I will respond to all inquiries regarding roles, projects, and collaborations promptly.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Message delivered successfully!</p>
            <p className="text-emerald-700 mt-0.5">
              Thank you for reaching out. Your message is safely stored and I will get back to you shortly.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Unable to send message</p>
            <p className="text-red-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 uppercase tracking-wider">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 uppercase tracking-wider">
            Your Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-800 mb-1.5 uppercase tracking-wider">
          Subject *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Collaboration on AI / Full Stack Opportunity"
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-800 mb-1.5 uppercase tracking-wider">
          Message *
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your project, timeline, or engineering opportunity..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all duration-150 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
