"use client";

import React from "react";
import { Lock, Sparkles, MessageSquare, Zap, Target, Calendar } from "lucide-react";
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
  const primaryMeta = DIMENSION_DETAILS[primaryWeakness] || DIMENSION_DETAILS.approach;
  const secondaryMeta = DIMENSION_DETAILS[secondaryWeakness] || DIMENSION_DETAILS.resilience;

  const lockedItems = [
    {
      title: `Full Psychological Bottleneck Audit: ${primaryMeta.name}`,
      teaser: `Detailed breakdown of the subconscious root causes behind your ${primaryMeta.focusTitle.toLowerCase()}, and why standard dating advice hasn't worked for your archetype.`,
      tag: "Deep Diagnosis",
      icon: <Zap className="w-3.5 h-3.5 text-[#FF4D8D]" />,
      actionText: "Read Complete Diagnosis",
    },
    {
      title: "Word-for-Word Conversation & Rescue Scripts",
      teaser: "Exact in-person lines to break awkward silences effortlessly, transition from polite small-talk to romantic chemistry, and the exact post-date text to lock in Date #2.",
      tag: "Action Scripts",
      icon: <MessageSquare className="w-3.5 h-3.5 text-[#7C5CFF]" />,
      actionText: "Unlock Word-for-Word Scripts",
    },
    {
      title: `The Pattern Synthesis: ${primaryMeta.shortName} × ${secondaryMeta.shortName}`,
      teaser: `How your ${primaryMeta.shortName} and ${secondaryMeta.shortName} secretly amplify each other in social settings, and the exact mental firewall to decouple them.`,
      tag: "Root Cause",
      icon: <Target className="w-3.5 h-3.5 text-[#3DDC97]" />,
      actionText: "View Decoupling Strategy",
    },
    {
      title: "3 Low-Pressure Field Exercises + 7-Day Blueprint",
      teaser: "5-minute daily low-stakes drills designed for Indian cafes, work breaks, and group hangouts to permanently lock in unshakeable social calibration.",
      tag: "Field Drills",
      icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />,
      actionText: "Unlock 7-Day Action Plan",
    },
  ];

  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF4D8D] block">
            Inside The ₹99 Report
          </span>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#FF4D8D]" />
            What You Unlock Instantly
          </h3>
        </div>
        <span className="text-[11px] text-[#3DDC97] font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Instant Web + PDF
        </span>
      </div>

      <div className="space-y-3">
        {lockedItems.map((item, idx) => (
          <div
            key={idx}
            onClick={onUnlockClick}
            className="group relative bg-[#14141F] border border-[#2A2A3D] hover:border-[#FF4D8D]/50 rounded-2xl p-4 cursor-pointer transition-all overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#1C1C2B] px-2.5 py-0.5 rounded-full border border-[#2A2A3D] flex items-center gap-1.5">
                {item.icon}
                {item.tag}
              </span>
              <div className="w-6 h-6 rounded-full bg-[#1C1C2B] border border-[#2A2A3D] group-hover:border-[#FF4D8D]/40 flex items-center justify-center text-[#9A9AB0] group-hover:text-[#FF4D8D] transition-colors shrink-0">
                <Lock className="w-3 h-3" />
              </div>
            </div>

            <h4 className="text-[14px] font-bold text-white group-hover:text-[#FF4D8D] transition-colors mb-1.5 leading-snug">
              {item.title}
            </h4>

            {/* Blurred Teaser Preview */}
            <div className="relative mb-2">
              <p className="text-xs text-[#9A9AB0] select-none filter blur-[2px] transition-all group-hover:blur-[1px] leading-relaxed">
                {item.teaser}
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5F5FA] bg-[#0B0B12]/95 px-3 py-1 rounded-full border border-[#2A2A3D] shadow-sm flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#FF4D8D]" /> Tap to Unlock
                </span>
              </div>
            </div>

            {/* Action hint */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#7C5CFF] pt-1 border-t border-[#2A2A3D]/40">
              <span>{item.actionText}</span>
              <span className="text-[10px] text-[#9A9AB0]">Included in ₹99</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
