import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#071324] text-white flex flex-col items-center justify-center p-4">
      {/* Top Gold Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_12px_#f59e0b] animate-pulse z-50" />

      <div className="flex flex-col items-center gap-4">
        {/* Monogram Badge */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0d1f38] border-2 border-amber-400 text-amber-400 flex items-center justify-center font-extrabold text-lg tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse">
            NH
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/40 animate-ping" />
        </div>

        {/* Loading status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-amber-300">
            Loading section...
          </span>
        </div>
      </div>
    </div>
  );
}
