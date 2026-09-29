"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  BarChart3,
  HeartHandshake,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { captureUtm } from "@/lib/utm";
import { track } from "@/lib/analytics";

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    captureUtm();
    track("landing_viewed");
  }, []);

  const handleStartQuiz = () => {
    track("cta_clicked", { location: "hero_landing" });
    track("quiz_started");
    router.push("/test");
  };

  const faqs = [
    {
      q: "Is the assessment really 100% free?",
      a: "Yes! Taking all 12 situational questions, receiving your total dating readiness score (0-100), your profile archetype, and your top personalized insight is completely free.",
    },
    {
      q: "Is this a psychological or clinical diagnosis?",
      a: "Not at all. DateReady is a private self-reflection and communication tool designed specifically for everyday dating confidence. We never use clinical jargon or diagnose anything.",
    },
    {
      q: "Is my data and answers kept private?",
      a: "Strictly private and confidential. We never sell your data, show your scores to anyone else, or spam your inbox. You can request deletion of your information anytime.",
    },
    {
      q: "How long does the assessment take?",
      a: "Just 60 to 90 seconds. There are 12 real-world scenarios with 4 simple choices each. No lengthy essays or typing required.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] pb-32">
      {/* Top Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#2A2A3D]/40 bg-[#0B0B12]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4D8D] to-[#7C5CFF] flex items-center justify-center shadow-[0_0_15px_rgba(255,77,141,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl font-display tracking-tight text-white">
            Date<span className="text-[#FF4D8D]">Ready</span>
          </span>
        </div>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#9A9AB0] bg-[#14141F] border border-[#2A2A3D] px-2.5 py-1 rounded-full">
          By Subix
        </span>
      </header>

      {/* Hero Section */}
      <main className="px-5 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C2B] border border-[#2A2A3D] text-xs font-semibold text-[#FF4D8D] mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D8D]" />
          <span>India's #1 Dating Readiness Assessment</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-[1.18] mb-4">
          How Ready Are You <br />
          <span className="text-brand-gradient">For Dating?</span>
        </h1>

        <p className="text-[15px] sm:text-base text-[#9A9AB0] leading-relaxed max-w-sm mb-6">
          A 60-second assessment. Discover your real confidence score, communication blindspots, and an actionable 7-day growth plan.
        </p>

        {/* Feature Badges */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#F5F5FA] mb-8 bg-[#14141F]/80 border border-[#2A2A3D] px-4 py-2.5 rounded-2xl">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FF4D8D]" /> 60 Sec
          </span>
          <span className="text-[#2A2A3D]">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" /> 100% Private
          </span>
          <span className="text-[#2A2A3D]">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#7C5CFF]" /> Free
          </span>
        </div>

        {/* Inline Hero CTA */}
        <div className="w-full max-w-sm mb-4">
          <Button
            variant="brand"
            size="xl"
            fullWidth
            onClick={handleStartQuiz}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Check My Score Now
          </Button>
          <p className="text-xs text-[#9A9AB0] mt-2.5 font-medium">
            12 situational questions • No signup to start
          </p>
        </div>

        {/* Sample Score Card Teaser Preview */}
        <div className="w-full max-w-sm mt-8 bg-gradient-to-b from-[#14141F] to-[#0B0B12] border border-[#2A2A3D] rounded-3xl p-5 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4D8D]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A9AB0]">
              Sample Result Preview
            </span>
            <span className="text-xs font-bold text-[#FF4D8D] bg-[#FF4D8D]/10 px-2 py-0.5 rounded-full border border-[#FF4D8D]/20">
              Score: 68/100
            </span>
          </div>

          <h3 className="text-lg font-bold text-white font-display mb-1">
            "The Developing"
          </h3>
          <p className="text-xs text-[#9A9AB0] mb-4">
            Natural warmth and humor, with subtle hesitation during initial approaches.
          </p>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs font-semibold text-[#F5F5FA]">
              <span>Approach Confidence</span>
              <span className="text-[#FF4D8D]">11/20 (Growth Area)</span>
            </div>
            <div className="w-full h-1.5 bg-[#1C1C2B] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 w-[55%]" />
            </div>

            <div className="flex justify-between text-xs font-semibold text-[#F5F5FA] pt-1">
              <span>Conversation Confidence</span>
              <span className="text-[#3DDC97]">16/20 (Strength)</span>
            </div>
            <div className="w-full h-1.5 bg-[#1C1C2B] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[80%]" />
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="w-full max-w-sm mt-12 text-left">
          <h2 className="text-xl font-bold font-display text-white mb-5 text-center">
            How It Works
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 text-[#FF4D8D] font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Answer 12 Scenarios</h4>
                <p className="text-xs text-[#9A9AB0] leading-relaxed">
                  Real dating moments—cafés, delayed replies, group outings. Takes under a minute.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF] font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Get Your Score & Profile</h4>
                <p className="text-xs text-[#9A9AB0] leading-relaxed">
                  See where you stand across 5 core dimensions, plus your #1 free breakthrough insight.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4">
              <div className="w-8 h-8 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/30 text-[#3DDC97] font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Unlock Your 7-Day Plan</h4>
                <p className="text-xs text-[#9A9AB0] leading-relaxed">
                  Get custom 5-minute daily drills tailored to your exact profile and weaknesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-sm mt-12 text-left">
          <h2 className="text-xl font-bold font-display text-white mb-4 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-white gap-2 select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#9A9AB0] transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#9A9AB0] leading-relaxed border-t border-[#2A2A3D]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-sm mt-16 pt-8 border-t border-[#2A2A3D]/60 text-center text-xs text-[#9A9AB0] space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <p className="text-[11px] leading-relaxed text-[#6A6A80]">
            DateReady is a self-reflection tool by Subix. Not a psychological, medical, or clinical assessment. You must be 18+ to participate.
          </p>

          <p className="text-[11px] text-[#6A6A80]">
            © {new Date().getFullYear()} DateReady. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Sticky Bottom CTA Bar */}
      <StickyCTA subtitle="⏱ 60 sec • 🔒 100% Private • Free Assessment">
        <Button
          variant="brand"
          size="lg"
          fullWidth
          onClick={handleStartQuiz}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Check My Score →
        </Button>
      </StickyCTA>
    </div>
  );
}
