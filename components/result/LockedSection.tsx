"use client";

import React from "react";
import { Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Dimension, DIMENSION_DETAILS } from "@/config/dimensions";

interface LockedSectionProps {
  primaryWeakness: Dimension;
  secondaryWeakness: Dimension;
  onUnlockClick: () => void;
}

export const LockedSection: React.FC<LockedSectionProps> = ({
  primaryWeakness,
  secondaryWeakness,
  onUnlockClick,
}) => {
  const primaryMeta = DIMENSION_DETAILS[primaryWeakness];
  const secondaryMeta = DIMENSION_DETAILS[secondaryWeakness];

  const lockedItems = [
    {
      title: `Your #1 Growth Area: ${primaryMeta.name}`,
      teaser: `Deep psychological breakdown of why ${primaryMeta.focusTitle.toLowerCase()} triggers hesitation, plus the exact 3 drills to rewire it.`,
      tag: "Deep Dive",
    },
    {
      title: `The Hidden Link: ${primaryMeta.shortName} × ${secondaryMeta.shortName}`,
      teaser: "Why your primary and secondary patterns trigger each other in social environments, and how to decouple them.",
      tag: "Root Cause",
    },
    {
      title: "3 Low-Pressure Field Exercises",
      teaser: "Step-by-step 5-minute everyday drills designed for Indian cafes, group outings, and daily commutes.",
      tag: "Field Exercises",
    },
    {
      title: "Custom 7-Day Micro-Action Plan",
      teaser: "Day-by-day 5-10 minute actions with reflection prompts to take your readiness to the next level.",
      tag: "Action Plan",
    },
  ];

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF4D8D]" />
          What's Inside Your Full Report
        </h3>
        <span className="text-xs text-[#9A9AB0] font-medium">Locked Premium</span>
      </div>

      <div className="space-y-3">
        {lockedItems.map((item, idx) => (
          <div
            key={idx}
            onClick={onUnlockClick}
            className="group relative bg-[#14141F] border border-[#2A2A3D] hover:border-[#FF4D8D]/40 rounded-2xl p-4.5 cursor-pointer transition-all overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D8D] bg-[#FF4D8D]/10 px-2 py-0.5 rounded-full border border-[#FF4D8D]/20">
                {item.tag}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#1C1C2B] border border-[#2A2A3D] group-hover:border-[#FF4D8D]/40 flex items-center justify-center text-[#9A9AB0] group-hover:text-[#FF4D8D] transition-colors shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <h4 className="text-[15px] font-semibold text-white group-hover:text-[#FF4D8D] transition-colors mb-1.5">
              {item.title}
            </h4>

            {/* Blurred Teaser Preview */}
            <div className="relative">
              <p className="text-xs text-[#9A9AB0] select-none filter blur-[2px] transition-all group-hover:blur-[1.5px] leading-relaxed">
                {item.teaser}
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-[#F5F5FA] bg-[#1C1C2B]/90 px-2.5 py-1 rounded-full border border-[#2A2A3D] shadow-sm flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#FF4D8D]" /> Tap to Unlock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
