"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { WebsiteSettings } from "@/types/portfolio";
import { initialWebsiteSettings } from "@/data/initialData";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateSettings", payload: settings }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            System & Website Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure contact availability, site maintenance mode, and general metadata.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>{status === "saving" ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {status === "saved" && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            General Portfolio Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                GitHub Organization / User URL
              </label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) =>
                  setSettings({ ...settings, github_url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin_url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3">
            Features & Toggles
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Enable Public Contact Form
              </div>
              <p className="text-[11px] text-neutral-500">
                Allows public visitors to submit inquiries directly into your admin inbox.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.contact_form_enabled}
              onChange={(e) =>
                setSettings({ ...settings, contact_form_enabled: e.target.checked })
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Maintenance Mode
              </div>
              <p className="text-[11px] text-neutral-500">
                Displays a friendly update notice to public visitors while you make major modifications.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) =>
                setSettings({ ...settings, maintenance_mode: e.target.checked })
              }
              className="w-5 h-5 accent-amber-600 cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
