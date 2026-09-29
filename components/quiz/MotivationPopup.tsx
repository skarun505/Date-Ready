/**
 * components/quiz/MotivationPopup.tsx
 *
 * Animated motivational overlay that appears at key milestones
 * during the quiz. Dismisses automatically after 2 seconds.
 */
"use client";

import React, { useEffect, useState } from "react";

export interface MotivationMessage {
  emoji: string;
  headline: string;
  subtext: string;
  color: "pink" | "purple" | "green";
}

const colorMap = {
  pink: {
    bg: "from-[#FF4D8D]/20 to-[#FF4D8D]/5",
    border: "border-[#FF4D8D]/40",
    glow: "shadow-[0_0_40px_rgba(255,77,141,0.25)]",
    text: "text-[#FF4D8D]",
  },
  purple: {
    bg: "from-[#7C5CFF]/20 to-[#7C5CFF]/5",
    border: "border-[#7C5CFF]/40",
    glow: "shadow-[0_0_40px_rgba(124,92,255,0.25)]",
    text: "text-[#7C5CFF]",
  },
  green: {
    bg: "from-[#3DDC97]/20 to-[#3DDC97]/5",
    border: "border-[#3DDC97]/40",
    glow: "shadow-[0_0_40px_rgba(61,220,151,0.25)]",
    text: "text-[#3DDC97]",
  },
};

interface Props {
  message: MotivationMessage;
  onDismiss: () => void;
}

export function MotivationPopup({ message, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 30);
    // Auto-dismiss after 2.4 s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDismiss]);

  const c = colorMap[message.color];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5 pointer-events-none"
      aria-live="polite"
    >
      <div
        onClick={() => {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className={`pointer-events-auto max-w-sm w-full bg-gradient-to-br ${c.bg} border ${c.border} ${c.glow} rounded-3xl px-6 py-7 text-center transition-all duration-400 ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4"
        }`}
        style={{ transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="text-5xl mb-3 animate-bounce">{message.emoji}</div>
        <h3 className={`text-xl font-extrabold font-display ${c.text} mb-1`}>
          {message.headline}
        </h3>
        <p className="text-sm text-[#C0C0D8] leading-relaxed">{message.subtext}</p>
        <p className="text-[11px] text-[#6A6A80] mt-3">Tap to continue →</p>
      </div>
    </div>
  );
}

// ─── Milestone definitions ────────────────────────────────────────────────────
export const MILESTONES: Record<number, MotivationMessage> = {
  3: {
    emoji: "🔥",
    headline: "You're on fire!",
    subtext: "3 questions done. Your instincts are already revealing a lot about you.",
    color: "pink",
  },
  6: {
    emoji: "⚡",
    headline: "Halfway there!",
    subtext: "Your pattern is becoming clear. Keep following your gut — no right answers here.",
    color: "purple",
  },
  9: {
    emoji: "🌟",
    headline: "Almost there!",
    subtext: "Just a few more to go. You're building a real picture of your dating readiness.",
    color: "green",
  },
  12: {
    emoji: "🎉",
    headline: "That's the core!",
    subtext: "You've nailed the main set. A couple of bonus insights coming up just for you.",
    color: "pink",
  },
};
