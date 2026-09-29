"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface QuizHeaderProps {
  currentIndex: number;
  total: number;
  canGoBack: boolean;
  onBack: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentIndex,
  total,
  canGoBack,
  onBack,
}) => {
  return (
    <div className="w-full pt-4 pb-2 px-5 sticky top-0 bg-[#0B0B12]/95 backdrop-blur-md z-30 border-b border-[#2A2A3D]/40">
      <div className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            canGoBack
              ? "text-[#F5F5FA] bg-[#14141F] border border-[#2A2A3D] hover:bg-[#1C1C2B]"
              : "text-transparent pointer-events-none"
          }`}
          aria-label="Previous question"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-semibold tracking-wider uppercase text-[#9A9AB0]">
          Question {currentIndex + 1} of {total}
        </span>

        <div className="w-9" />
      </div>

      <ProgressBar current={currentIndex + 1} total={total} showLabel={false} />
    </div>
  );
};
