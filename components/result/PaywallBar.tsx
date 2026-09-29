"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaywallBarProps {
  onUnlock: () => void;
  isLoading?: boolean;
}

export const PaywallBar: React.FC<PaywallBarProps> = ({
  onUnlock,
  isLoading = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-[480px] pointer-events-auto bg-[#0B0B12]/95 backdrop-blur-2xl border-t border-[#2A2A3D] px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-sm font-bold text-white block">
              Full Personal Report
            </span>
            <span className="text-[11px] text-[#3DDC97] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 fill-[#3DDC97]" /> Instant Web Access + PDF Download
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-[#9A9AB0] line-through">₹499</span>
              <span className="text-xl font-extrabold text-white font-display">₹99</span>
            </div>
            <span className="text-[10px] text-[#9A9AB0] block uppercase tracking-wider font-semibold">
              Launch Offer
            </span>
          </div>
        </div>

        <Button
          variant="brand"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={onUnlock}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Unlock Full Report Now
        </Button>

        {/* UPI & Payment Trust Strip */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#9A9AB0] px-1">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Instant Web + Email Access
          </span>
          <span className="font-semibold tracking-wide text-[#C5C5D8]">
            UPI • GPay • PhonePe • Cards
          </span>
        </div>
      </div>
    </div>
  );
};
