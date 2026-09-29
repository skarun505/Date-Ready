"use client";

import React, { useState } from "react";
import { Share2, Check, MessageSquare } from "lucide-react";
import { track } from "@/lib/analytics";

interface ShareButtonProps {
  score: number;
  profile: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ score, profile }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `I just scored ${score}/100 on DateReady (Archetype: "${profile}"). How ready are you for dating? Take the free 60-second assessment:`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://dateready.subix.in";

  const handleShare = async () => {
    track("share_clicked", { score, profile });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `DateReady - ${profile}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or unsupported, fallback below
      }
    }

    // Direct WhatsApp share fallback on mobile / web
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`;

    window.open(waUrl, "_blank");

    // Also copy to clipboard for convenience
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center gap-1.5 my-3">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1C2B] hover:bg-[#252538] border border-[#2A2A3D] text-xs font-semibold text-[#E0E0EC] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#3DDC97]" />
            <span className="text-[#3DDC97]">Copied & Shared!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-[#FF4D8D]" />
            <span>Share My Score Archetype</span>
          </>
        )}
      </button>
      <span className="text-[10px] text-[#6A6A80]">
        Tap to share to WhatsApp or Stories
      </span>
    </div>
  );
};
