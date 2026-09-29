"use client";

import React from "react";
import { Coffee, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface ValueAnchorCardProps {
  onUnlockClick: () => void;
}

export const ValueAnchorCard: React.FC<ValueAnchorCardProps> = ({ onUnlockClick }) => {
  return (
    <section className="bg-gradient-to-br from-[#1C1C2B] to-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 mb-8 shadow-lg relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/25 flex items-center gap-1">
          <Coffee className="w-3 h-3" /> The Dating Math
        </span>
        <span className="text-xs text-[#9A9AB0]">Why ₹99 is a no-brainer</span>
      </div>

      <h3 className="text-base font-bold text-white font-display mb-3">
        The Cost of Going Into Dates Blind
      </h3>

      <div className="space-y-3 mb-4">
        {/* Bad Date Cost */}
        <div className="bg-[#0B0B12]/80 border border-rose-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              1 Awkward / Failed First Date
            </span>
            <span className="font-black text-rose-400">~₹1,800 - ₹3,000+</span>
          </div>

          <div className="text-[11px] text-[#9A9AB0] space-y-1 pl-5">
            <p>• Drinks, dinner, or cafe bill: ₹1,200 – ₹2,500</p>
            <p>• Cabs / travel back & forth: ₹300 – ₹600</p>
            <p>• Weeks wasted overthinking: <em>"Why did they go cold?"</em></p>
          </div>
        </div>

        {/* DateReady Blueprint */}
        <div className="bg-[#0B0B12]/80 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Your DateReady Blueprint
            </span>
            <span className="font-black text-emerald-400 text-sm">Only ₹99</span>
          </div>

          <div className="text-[11px] text-[#E0E0EC] space-y-1 pl-5">
            <p>• Pinpoint your subconscious blindspot before your next date</p>
            <p>• Word-for-word conversation & rescue scripts</p>
            <p>• 7-day action plan to feel magnetic and confident</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#9A9AB0] text-center leading-relaxed mb-4 italic">
        "Skip one cold brew coffee. Never fumble a date with someone you genuinely like again."
      </p>

      <button
        onClick={onUnlockClick}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#7C5CFF] hover:opacity-95 text-xs font-bold text-white shadow-[0_4px_16px_rgba(255,77,141,0.3)] transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Get Your Personal Blueprint for ₹99</span>
      </button>
    </section>
  );
};
