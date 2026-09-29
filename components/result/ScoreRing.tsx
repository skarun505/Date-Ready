"use client";

import React, { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 190,
  strokeWidth = 14,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1200; // 1.2 seconds animation as per spec
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * score);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative flex flex-col items-center justify-center my-4">
      {/* Background glow */}
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#FF4D8D]/30 to-[#7C5CFF]/30 blur-2xl -z-10 animate-pulse-subtle" />

      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D8D" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>

        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#1C1C2B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold font-display text-white tracking-tight">
            {displayedScore}
          </span>
          <span className="text-xl font-medium text-[#9A9AB0] ml-1">/100</span>
        </div>
        <span className="text-xs uppercase font-bold tracking-wider text-[#FF4D8D] mt-1">
          Dating Readiness
        </span>
      </div>
    </div>
  );
};
