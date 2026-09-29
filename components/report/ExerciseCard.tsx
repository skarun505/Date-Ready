"use client";

import React, { useState } from "react";
import { Check, Clock, ChevronDown } from "lucide-react";

interface ExerciseCardProps {
  id: string;
  name: string;
  time: string;
  steps: string[];
  whyItWorks: string;
  initialDone?: boolean;
  onToggleDone?: (id: string, isDone: boolean) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  name,
  time,
  steps,
  whyItWorks,
  initialDone = false,
  onToggleDone,
}) => {
  const [isDone, setIsDone] = useState(initialDone);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isDone;
    setIsDone(next);
    if (onToggleDone) onToggleDone(id, next);
  };

  return (
    <div
      className={`bg-[#14141F] border rounded-2xl p-4.5 transition-all duration-200 ${
        isDone ? "border-emerald-500/40 bg-emerald-950/10" : "border-[#2A2A3D] hover:border-[#3D3D58]"
      }`}
    >
      <div
        className="flex items-start justify-between gap-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
              isDone
                ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_12px_rgba(61,220,151,0.4)]"
                : "border-[#2A2A3D] bg-[#1C1C2B] text-transparent hover:border-[#FF4D8D]"
            }`}
            aria-label={isDone ? "Mark incomplete" : "Mark complete"}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>

          <div>
            <h4
              className={`text-sm sm:text-base font-bold transition-colors ${
                isDone ? "text-emerald-400 line-through opacity-85" : "text-white"
              }`}
            >
              {name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#9A9AB0] mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {time}
              </span>
              <span>•</span>
              <span className="text-[#FF4D8D] font-medium">Field Drill</span>
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#9A9AB0] transition-transform duration-200 mt-1 shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-[#2A2A3D]/60 space-y-3">
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#F5F5FA]/90 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-[#1C1C2B] text-[#9A9AB0] border border-[#2A2A3D] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#1C1C2B]/80 rounded-xl p-3 border border-[#2A2A3D]/40 text-xs">
            <span className="text-[#FF4D8D] font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
              Why this works:
            </span>
            <p className="text-[#9A9AB0] leading-relaxed">{whyItWorks}</p>
          </div>
        </div>
      )}
    </div>
  );
};
