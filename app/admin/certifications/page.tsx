"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Award,
  ExternalLink,
  Calendar,
  X,
  Save,
  Upload,
} from "lucide-react";
import { Certification } from "@/types/portfolio";
import { initialCertifications } from "@/data/initialData";
import { formatDate } from "@/lib/utils";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] =
    useState<Certification[]>(initialCertifications);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    try {
      const local = localStorage.getItem("portfolio_certifications");
      if (local) {
        setCertifications(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/admin/data?section=certifications")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCertifications(res.data);
          try {
            localStorage.setItem("portfolio_certifications", JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditingCert({
          ...editingCert,
          image_url: data.url,
        });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenNew = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: "",
      issuing_organization: "",
      issue_date: new Date().toISOString().slice(0, 10),
      credential_id: "",
      verification_url: "",
      image_url:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      is_published: true,
      sort_order: certifications.length + 1,
    };
    setEditingCert(newCert);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const exists = certifications.some((c) => c.id === editingCert.id);
    const updated = exists
      ? certifications.map((c) => (c.id === editingCert.id ? editingCert : c))
      : [...certifications, editingCert];

    setCertifications(updated);
    try {
      localStorage.setItem("portfolio_certifications", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveCertification", payload: editingCert }),
      });

      setIsModalOpen(false);
      setStatusMessage("Certification saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save certification to cloud, but saved locally.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this certification?")) return;
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    try {
      localStorage.setItem("portfolio_certifications", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteCertification", payload: { id } }),
      });
      setStatusMessage("Certification removed.");
      setTimeout(() => setStatusMessage(""), 3000);
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
            Certifications Manager
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Add and manage verified credentials in AI, Deep Learning, and Web Architecture.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs overflow-hidden flex flex-col justify-between"
          >
            {cert.image_url && (
              <div className="relative h-36 w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={cert.image_url}
                  alt={cert.title}
                  fill
                  className="object-cover opacity-90"
                />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-blue-600 uppercase mb-1">
                  {cert.issuing_organization}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {cert.title}
                </h3>
                <div className="text-xs text-amber-200/80 font-mono mt-2">
                  Issued: {formatDate(cert.issue_date)}
                </div>
                {cert.credential_id && (
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    ID: {cert.credential_id}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      cert.is_published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#142c50] text-slate-300"
                    }`}
                  >
                    {cert.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setEditingCert({ ...cert });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-[#0d1f38] rounded-3xl border border-amber-500/30 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingCert.id.startsWith("cert-") ? "Add Certificate" : "Edit Certificate"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.issuing_organization}
                  onChange={(e) =>
                    setEditingCert({
                      ...editingCert,
                      issuing_organization: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-amber-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={editingCert.issue_date}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, issue_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-amber-300 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={editingCert.credential_id || ""}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        credential_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={editingCert.verification_url || ""}
                  onChange={(e) =>
                    setEditingCert({
                      ...editingCert,
                      verification_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-500/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-300 mb-1">
                  Certificate Image or Badge (Upload File or Enter URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCert.image_url || ""}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, image_url: e.target.value })
                    }
                    placeholder="https://... or upload photo"
                    className="flex-1 px-3 py-2 rounded-xl border border-amber-500/30 bg-[#071324] text-white"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] text-xs font-extrabold border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
