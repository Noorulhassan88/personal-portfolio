"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Copy,
  Trash2,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";
import { MediaItem } from "@/types/portfolio";
import { formatBytes, formatDateTime } from "@/lib/utils";

const initialMedia: MediaItem[] = [
  {
    id: "m-1",
    name: "profile.png",
    url: "/profile.png",
    file_type: "image",
    size: 450200,
    bucket: "profile-images",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "m-2",
    name: "calquity-cover.jpg",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    file_type: "image",
    size: 890100,
    bucket: "project-images",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "m-3",
    name: "noorul-hassan-resume.pdf",
    url: "/resume.pdf",
    file_type: "pdf",
    size: 142050,
    bucket: "resume",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "m-4",
    name: "deeplearning-certificate.jpg",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    file_type: "image",
    size: 610000,
    bucket: "certificates",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMedia = mediaList.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newItem: MediaItem = {
        id: `m-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file_type: file.type.includes("pdf") ? "pdf" : "image",
        size: file.size,
        bucket: "website-assets",
        created_at: new Date().toISOString(),
      };
      setMediaList([newItem, ...mediaList]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Media Library & Storage
          </h1>
          <p className="text-xs text-amber-200/80 mt-1">
            Centralized file assets across profile photos, project screenshots, and PDF certificates.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#071324] font-extrabold text-sm sm:text-base px-6 py-3 border border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wide transition-all shadow-xs">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            onChange={handleUploadSimulate}
            className="hidden"
            accept="image/*,.pdf"
          />
        </label>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1f38] border border-amber-500/30 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-500/30 text-xs text-white"
          />
        </div>
        <span className="text-xs text-amber-200/80 font-mono">
          {filteredMedia.length} files stored
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group bg-[#0d1f38] rounded-2xl border border-amber-500/30 shadow-2xs overflow-hidden flex flex-col justify-between"
          >
            {/* Preview Box */}
            <div className="relative h-40 w-full bg-[#142c50] flex items-center justify-center overflow-hidden">
              {item.file_type === "image" ? (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-amber-200/80">
                  <FileText className="w-10 h-10 text-red-500 mb-2" />
                  <span className="text-[10px] font-mono font-bold uppercase">
                    PDF Document
                  </span>
                </div>
              )}

              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#0d1f38]/90 text-slate-100 shadow-2xs">
                {item.bucket}
              </span>
            </div>

            {/* Meta */}
            <div className="p-4 space-y-2">
              <div className="text-xs font-bold text-white truncate" title={item.name}>
                {item.name}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{formatBytes(item.size)}</span>
                <span>{formatDateTime(item.created_at)}</span>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === item.id ? "Copied!" : "Copy URL"}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
