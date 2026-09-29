"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UpsellBannerProps {
  onUpgrade?: () => void;
  isLoading?: boolean;
}

export const UpsellBanner: React.FC<UpsellBannerProps> = ({ onUpgrade, isLoading = false }) => {
  return (
    <div className="bg-gradient-to-br from-[#1C1C2B] to-[#14141F] border border-[#FF4D8D]/30 rounded-3xl p-5 my-8 relative overflow-hidden shadow-[0_8px_32px_rgba(255,77,141,0.15)]">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF4D8D]/20 to-transparent rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FF4D8D]/20 text-[#FF4D8D] px-2.5 py-0.5 rounded-full border border-[#FF4D8D]/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Next Level
        </span>
        <span className="text-xs text-[#9A9AB0]">Optional Upgrade</span>
      </div>

      <h3 className="text-lg font-bold text-white font-display mb-1.5">
        The Complete Confidence Kit
      </h3>

      <p className="text-xs text-[#9A9AB0] leading-relaxed mb-4">
        Ready to accelerate? Get 14 advanced real-world conversation drills, dating app photo audit templates, and high-stakes social calibration.
      </p>

      <div className="flex items-baseline justify-between mb-4 bg-[#0B0B12]/60 rounded-xl p-3 border border-[#2A2A3D]">
        <div>
          <span className="text-xs text-[#9A9AB0] block font-medium">One-Time Member Price</span>
          <span className="text-xs text-[#3DDC97]">14-Day Blueprint Included</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#9A9AB0] line-through mr-1.5">₹999</span>
          <span className="text-xl font-extrabold text-white font-display">₹299</span>
        </div>
      </div>

      <Button
        variant="brand"
        size="md"
        fullWidth
        isLoading={isLoading}
        onClick={onUpgrade}
        icon={<ArrowRight className="w-4 h-4" />}
      >
        Upgrade to Confidence Kit (₹299)
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-[#9A9AB0]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
        <span>Instant lifetime access • Add to your DateReady account</span>
      </div>
    </div>
  );
};
