"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
  className = "",
  colorClass = "bg-gradient-to-r from-[#FF4D8D] to-[#7C5CFF]",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-[#9A9AB0] mb-2 font-medium">
          <span>Progress</span>
          <span className="text-[#F5F5FA] font-semibold">{current} of {total}</span>
        </div>
      )}
      <div className="w-full h-2 bg-[#1C1C2B] rounded-full overflow-hidden border border-[#2A2A3D]/60 p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
