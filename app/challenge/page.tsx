"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ChallengePage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0B0B12] px-5 py-6 max-w-sm mx-auto w-full">
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-[#14141F] border border-[#2A2A3D] flex items-center justify-center text-[#9A9AB0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-[#9A9AB0]">
          Product 3 • DateReady Mastery
        </span>
      </header>

      <main className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4D8D]/20 to-[#7C5CFF]/20 border border-[#FF4D8D]/30 flex items-center justify-center shadow-lg">
          <Flame className="w-7 h-7 text-[#FF4D8D]" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">
            30-Day Transformation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            The 30-Day Dating Mastery Challenge
          </h1>
          <p className="text-sm text-[#9A9AB0] mt-2 leading-relaxed">
            A structured daily curriculum to take you from hesitant to effortlessly magnetic through calibrated progressive habit stacks.
          </p>
        </div>

        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Program Curriculum
          </h3>

          <div className="space-y-3 text-xs text-[#E0E0EC]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3DDC97] shrink-0 mt-0.5" />
              <span><strong>Week 1:</strong> Nervous system calming & physical presence drills</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3DDC97] shrink-0 mt-0.5" />
              <span><strong>Week 2:</strong> Conversational agility, banter & playful assumptions</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3DDC97] shrink-0 mt-0.5" />
              <span><strong>Week 3:</strong> Flirting, creating romantic tension & chemistry</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3DDC97] shrink-0 mt-0.5" />
              <span><strong>Week 4:</strong> Date planning, texting dynamics & closing with confidence</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1C1C2B] rounded-2xl p-4 border border-[#FF4D8D]/30 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#9A9AB0] block">Special Launch Price</span>
            <span className="text-xs text-[#3DDC97]">Includes all 30 days + community</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#9A9AB0] line-through mr-1">₹1,999</span>
            <span className="text-xl font-extrabold text-white font-display">₹499</span>
          </div>
        </div>

        <Button
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => alert("30-Day Challenge opens in Phase 2!")}
        >
          Join Waitlist for Next Cohort
        </Button>
      </main>
    </div>
  );
}
