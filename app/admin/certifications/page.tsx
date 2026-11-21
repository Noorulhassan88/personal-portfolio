"use client";

import React, { useState } from "react";
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

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveCertification", payload: editingCert }),
      });

      const exists = certifications.some((c) => c.id === editingCert.id);
      if (exists) {
        setCertifications(
          certifications.map((c) => (c.id === editingCert.id ? editingCert : c))
        );
      } else {
        setCertifications([...certifications, editingCert]);
      }

      setIsModalOpen(false);
      setStatusMessage("Certification saved successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save certification.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this certification?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteCertification", payload: { id } }),
      });
      setCertifications(certifications.filter((c) => c.id !== id));
      setStatusMessage("Certification removed.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Certifications Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Add and manage verified credentials in AI, Deep Learning, and Web Architecture.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide transition-all shadow-xs"
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
            className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden flex flex-col justify-between"
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
                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {cert.title}
                </h3>
                <div className="text-xs text-neutral-500 font-mono mt-2">
                  Issued: {formatDate(cert.issue_date)}
                </div>
                {cert.credential_id && (
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    ID: {cert.credential_id}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      cert.is_published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
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
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setEditingCert({ ...cert });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600"
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
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCert.id.startsWith("cert-") ? "Add Certificate" : "Edit Certificate"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={editingCert.issue_date}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, issue_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Image or Badge URL
                </label>
                <input
                  type="text"
                  value={editingCert.image_url || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
