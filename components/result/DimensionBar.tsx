"use client";

import React from "react";
import { Dimension, DIMENSION_DETAILS } from "@/config/dimensions";

interface DimensionBarProps {
  dimension: Dimension;
  score: number; // 0 to 20
  isWeakness?: boolean;
  isStrength?: boolean;
}

export const DimensionBar: React.FC<DimensionBarProps> = ({
  dimension,
  score,
  isWeakness = false,
  isStrength = false,
}) => {
  const meta = DIMENSION_DETAILS[dimension];
  const percentage = Math.min(100, Math.max(0, Math.round((score / 20) * 100)));

  let colorClass = "from-[#7C5CFF] to-[#FF4D8D]";
  let badgeText = "";
  let badgeClass = "";

  if (isStrength || score >= 14) {
    colorClass = "from-emerald-500 to-teal-400";
    badgeText = "Strength";
    badgeClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  } else if (isWeakness || score < 10) {
    colorClass = "from-rose-500 to-pink-500";
    badgeText = "Growth Area";
    badgeClass = "bg-rose-500/15 text-rose-400 border-rose-500/30";
  } else {
    colorClass = "from-amber-500 to-orange-400";
    badgeText = "Balanced";
    badgeClass = "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }

  return (
    <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 transition-all hover:border-[#3D3D58]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F5F5FA]">{meta.name}</span>
          {badgeText && (
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-[#F5F5FA] font-display">
          {score}<span className="text-[#9A9AB0] font-normal text-xs">/20</span>
        </span>
      </div>

      <p className="text-xs text-[#9A9AB0] mb-2.5 line-clamp-1">{meta.measures}</p>

      <div className="w-full h-2 bg-[#1C1C2B] rounded-full overflow-hidden border border-[#2A2A3D]/40">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
