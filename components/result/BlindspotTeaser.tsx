"use client";

import React from "react";
import { AlertTriangle, Lock, ArrowRight, Sparkles, ShieldAlert } from "lucide-react";
import { Dimension, DIMENSION_DETAILS } from "@/config/dimensions";

interface BlindspotTeaserProps {
  primaryWeakness: Dimension;
  onUnlockClick: () => void;
}

interface BlindspotData {
  title: string;
  trapName: string;
  symptom: string;
  cost: string;
  solutionTeaser: string;
}

const BLINDSPOTS: Record<Dimension, BlindspotData> = {
  approach: {
    title: "Primary Blindspot Detected",
    trapName: "The 'Polite Interview' Trap",
    symptom:
      "You are courteous and respectful, but you wait too long for the 'perfect opening'. Your energy comes across as polite and safe rather than captivating.",
    cost: "Dates find you pleasant, but feel zero romantic tension—often leading to the dreaded 'I didn't feel a romantic spark' text.",
    solutionTeaser:
      "How to introduce subtle, playful romantic tension in the first 3 minutes without ever feeling awkward or creepy.",
  },
  conversation: {
    title: "Primary Blindspot Detected",
    trapName: "The 'Resume Interrogation' Loop",
    symptom:
      "When silences appear, you default to resume-style questions ('Where did you study?', 'How long have you worked there?') instead of emotionally resonant topics.",
    cost: "The date begins to feel like a corporate HR interview. Both of you leave feeling drained rather than connected.",
    solutionTeaser:
      "The 2-question emotional pivot formula that gets dates to passionately open up about what makes them tick.",
  },
  social: {
    title: "Primary Blindspot Detected",
    trapName: "The 'Invisible Spectator' Effect",
    symptom:
      "In group settings or busy spots, you wait for someone else to invite you into the flow of conversation or set the vibe.",
    cost: "People mistakenly perceive you as aloof or unapproachable, and you miss out on promising connections standing right beside you.",
    solutionTeaser:
      "The 3-second entrance calibration to naturally command warmth and presence the moment you walk into any room.",
  },
  resilience: {
    title: "Primary Blindspot Detected",
    trapName: "The 'Delayed Reply' Panic Spiral",
    symptom:
      "When someone takes hours to reply or cancels, your brain immediately starts re-analyzing past messages for hidden mistakes.",
    cost: "You unintentionally project anxious energy in your follow-ups, which subconsciously pushes away the exact people you like most.",
    solutionTeaser:
      "The outcome-independence mental firewall and the exact casual reset text that reignites their curiosity.",
  },
  presentation: {
    title: "Primary Blindspot Detected",
    trapName: "The 'Low-Signal Presence' Gap",
    symptom:
      "Your inner depth, humor, and values are high, but your initial vocal tone, eye contact, and posture don't broadcast them quickly enough.",
    cost: "First impressions form in just 7 seconds. Dates make snap subconscious judgments before you even get a chance to show who you are.",
    solutionTeaser:
      "The 3 micro-adjustments in posture, gaze cadence, and style that 3x your perceived charisma instantly.",
  },
};

export const BlindspotTeaser: React.FC<BlindspotTeaserProps> = ({
  primaryWeakness,
  onUnlockClick,
}) => {
  const blindspot = BLINDSPOTS[primaryWeakness] || BLINDSPOTS.approach;
  const dimensionMeta = DIMENSION_DETAILS[primaryWeakness] || DIMENSION_DETAILS.approach;

  return (
    <section className="bg-gradient-to-b from-[#1C1C2B] to-[#14141F] border border-amber-500/40 rounded-3xl p-5 mb-8 relative overflow-hidden shadow-[0_4px_24px_rgba(245,158,11,0.12)]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/35 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          High-Risk Blindspot
        </span>
        <span className="text-xs text-[#9A9AB0]">Bottleneck: {dimensionMeta.name}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white font-display mb-1.5 flex items-center gap-2">
        <span>{blindspot.trapName}</span>
      </h3>

      {/* The Symptom */}
      <div className="space-y-3 mb-4 text-xs sm:text-[13px] leading-relaxed">
        <p className="text-[#E0E0EC]">
          <strong className="text-white">What's happening: </strong>
          {blindspot.symptom}
        </p>

        <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-3 text-rose-200">
          <strong className="text-rose-300 block mb-0.5 font-semibold">
            Why it costs you 2nd dates:
          </strong>
          {blindspot.cost}
        </div>
      </div>

      {/* Locked Solution Preview */}
      <div
        onClick={onUnlockClick}
        className="group bg-[#0B0B12]/80 border border-[#2A2A3D] hover:border-[#FF4D8D]/50 rounded-2xl p-3.5 cursor-pointer transition-all relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-[#3DDC97] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            In Your Full Report (₹99)
          </span>
          <span className="text-[10px] uppercase font-bold text-[#FF4D8D] bg-[#FF4D8D]/15 px-2 py-0.5 rounded-full border border-[#FF4D8D]/30 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        </div>

        <p className="text-xs text-[#9A9AB0] leading-relaxed mb-2">
          {blindspot.solutionTeaser}
        </p>

        <div className="flex items-center justify-between text-xs text-white font-semibold group-hover:text-[#FF4D8D] transition-colors pt-1 border-t border-[#2A2A3D]/60">
          <span>Unlock the complete diagnosis & step-by-step fix</span>
          <ArrowRight className="w-4 h-4 text-[#FF4D8D] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </section>
  );
};
