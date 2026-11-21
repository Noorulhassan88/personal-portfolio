"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { WebsiteSettings } from "@/types/portfolio";
import { initialWebsiteSettings } from "@/data/initialData";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>(initialWebsiteSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_settings");
      if (local) {
        setSettings(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
          try {
            localStorage.setItem("portfolio_settings", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");

    try {
      localStorage.setItem("portfolio_settings", JSON.stringify(settings));
    } catch (err) {
      console.error(err);
    }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System & Website Settings
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Configure contact availability, site maintenance mode, and general metadata.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs"
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
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
            General Portfolio Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                GitHub Organization / User URL
              </label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) =>
                  setSettings({ ...settings, github_url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 uppercase mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin_url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-amber-500/20 pb-3">
            Features & Toggles
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-amber-500/20">
            <div>
              <div className="text-xs font-bold text-white">
                Enable Public Contact Form
              </div>
              <p className="text-[11px] text-amber-200/80">
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
              <div className="text-xs font-bold text-white">
                Maintenance Mode
              </div>
              <p className="text-[11px] text-amber-200/80">
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
