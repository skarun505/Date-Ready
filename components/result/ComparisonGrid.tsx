"use client";

import React from "react";
import { Check, X, Lock, Sparkles } from "lucide-react";

interface ComparisonGridProps {
  onUnlockClick: () => void;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({ onUnlockClick }) => {
  const features = [
    { name: "Overall Dating Readiness Score (0-100)", free: true, paid: true },
    { name: "Personal Archetype & Core Strengths", free: true, paid: true },
    { name: "5-Dimension Balance Analysis", free: true, paid: true },
    { name: "Subconscious Dating Blindspot Audit", free: "Teaser", paid: true },
    { name: "Word-for-Word Conversation & Rescue Scripts", free: false, paid: true },
    { name: "3 Low-Pressure Real-World Field Drills", free: false, paid: true },
    { name: "Custom 7-Day Micro-Action Blueprint", free: false, paid: true },
    { name: "Confidential Downloadable PDF to Keep", free: false, paid: true },
  ];

  return (
    <section className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 mb-8">
      <div className="text-center mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF4D8D] bg-[#FF4D8D]/10 px-2.5 py-0.5 rounded-full border border-[#FF4D8D]/25 inline-flex items-center gap-1 mb-1.5">
          <Sparkles className="w-3 h-3" /> Transparent Comparison
        </span>
        <h3 className="text-base font-bold text-white font-display">
          Free Preview vs. ₹99 Full Report
        </h3>
        <p className="text-xs text-[#9A9AB0] mt-0.5">
          See exactly what unlocks with your one-time ₹99 access
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#2A2A3D]/70 bg-[#0B0B12]/80">
        <div className="grid grid-cols-12 text-[11px] font-bold py-2.5 px-3 bg-[#1C1C2B] border-b border-[#2A2A3D] text-[#9A9AB0]">
          <div className="col-span-6 text-left">Feature / Deliverable</div>
          <div className="col-span-3 text-center">Free</div>
          <div className="col-span-3 text-center text-[#FF4D8D]">Full (₹99)</div>
        </div>

        <div className="divide-y divide-[#2A2A3D]/50 text-xs">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center py-2.5 px-3 hover:bg-[#14141F]/80 transition-colors"
            >
              <div className="col-span-6 text-left text-[#E0E0EC] font-medium text-[11px] sm:text-xs pr-1">
                {f.name}
              </div>

              {/* Free column */}
              <div className="col-span-3 flex justify-center">
                {f.free === true ? (
                  <Check className="w-4 h-4 text-[#3DDC97]" />
                ) : f.free === "Teaser" ? (
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Teaser
                  </span>
                ) : (
                  <X className="w-4 h-4 text-[#6A6A80]" />
                )}
              </div>

              {/* Paid column */}
              <div className="col-span-3 flex justify-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3 text-emerald-400" /> Yes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onUnlockClick}
        className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4D8D]/20 to-[#7C5CFF]/20 hover:from-[#FF4D8D]/30 hover:to-[#7C5CFF]/30 border border-[#FF4D8D]/40 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
      >
        <Lock className="w-3.5 h-3.5 text-[#FF4D8D]" />
        <span>Unlock Everything for ₹99</span>
      </button>
    </section>
  );
};
