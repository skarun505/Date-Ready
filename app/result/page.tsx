"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Zap,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ScoreRing } from "@/components/result/ScoreRing";
import { DimensionBar } from "@/components/result/DimensionBar";
import { LockedSection } from "@/components/result/LockedSection";
import { PaywallBar } from "@/components/result/PaywallBar";
import { ShareButton } from "@/components/result/ShareButton";
import { TestimonialsSection } from "@/components/result/TestimonialsSection";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { PROFILES } from "@/config/profiles";
import { DIMENSIONS, DIMENSION_DETAILS, Dimension } from "@/config/dimensions";
import { track } from "@/lib/analytics";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") || "";
  const token = searchParams.get("t") || "";

  const [scoreData, setScoreData] = useState<any>(null);
  const [userName, setUserName] = useState<string>("there");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fire analytics
    track("result_viewed", { assessmentId });
    track("paywall_viewed", { assessmentId });

    // 2. Trigger celebratory subtle confetti burst on high potential
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.3 },
        colors: ["#FF4D8D", "#7C5CFF", "#3DDC97"],
      });
    } catch (e) {}

    // 3. Load result from localStorage or fetch from API
    try {
      const stored = localStorage.getItem("dateready_result_data");
      const storedName = localStorage.getItem("dateready_user_name");
      if (storedName) setUserName(storedName);

      if (stored) {
        const parsed = JSON.parse(stored);
        setScoreData(parsed);
      } else {
        // Fallback default demo data
        setScoreData({
          score: 65,
          profile: "The Developing",
          primaryWeakness: "approach",
          secondaryWeakness: "resilience",
          dimensions: {
            approach: 10,
            conversation: 16,
            social: 14,
            resilience: 11,
            presentation: 14,
          },
        });
      }
    } catch (e) {
      // Fallback
    }
  }, [assessmentId]);

  if (!scoreData) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
        <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileMeta = PROFILES[scoreData.profile] || PROFILES["The Developing"];
  const primaryWeaknessMeta = DIMENSION_DETAILS[scoreData.primaryWeakness as Dimension] || DIMENSION_DETAILS.approach;

  const handleOpenCheckout = () => {
    track("unlock_clicked", { assessmentId });
    setIsSheetOpen(true);
  };

  const handleProceedToPayment = async () => {
    if (!termsAccepted || isCheckingOut) return;
    setIsCheckingOut(true);
    track("checkout_started", { assessmentId, amount: 99 });

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessmentId || "demo-assessment-id",
          product: "report_99",
          termsAccepted: true,
          termsVersion: "v1",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Redirect to Dodo Checkout or simulated verification
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      alert(err.message || "Failed to start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  const faqs = [
    {
      q: "What do I get in the ₹99 report?",
      a: "You get immediate web access and a downloadable PDF containing your in-depth primary weakness diagnosis, your 3 situational field drills, the bridge analysis connecting your patterns, and your personalized 7-day action blueprint.",
    },
    {
      q: "How fast is access delivered?",
      a: "Instantly. As soon as your payment confirms, your interactive web report unlocks immediately on screen, and an access link is emailed to you.",
    },
    {
      q: "Is this purchase confidential?",
      a: "100% private. Your report is encrypted, accessible only via your signed link, and billed discreetly.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] pb-36 bg-[#0B0B12]">
      {/* Top Bar */}
      <header className="px-5 py-3.5 flex items-center justify-between border-b border-[#2A2A3D]/40 bg-[#0B0B12]/80 backdrop-blur-md sticky top-0 z-30">
        <span className="font-extrabold text-lg font-display tracking-tight text-white">
          Date<span className="text-[#FF4D8D]">Ready</span>
        </span>
        <span className="text-xs font-semibold text-[#9A9AB0]">
          Report Assessment Complete
        </span>
      </header>

      <main className="px-5 pt-6 max-w-sm mx-auto w-full">
        {/* User Greeting */}
        <div className="text-center mb-3">
          <span className="text-xs uppercase tracking-widest font-bold text-[#9A9AB0]">
            Assessment Result
          </span>
          <h1 className="text-2xl font-extrabold text-white font-display mt-1">
            Hey {userName}!
          </h1>

          {/* Urgency Badge */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-semibold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Analysis & Archetype saved for 24 hours</span>
          </div>
        </div>

        {/* 1. Animated Score Ring */}
        <ScoreRing score={scoreData.score || 65} />

        {/* 2. Profile Badge & Summary */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF4D8D]/20 to-[#7C5CFF]/20 border border-[#FF4D8D]/40 text-xs font-bold text-[#FF4D8D] mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{scoreData.profile}</span>
          </div>

          <p className="text-sm text-[#F5F5FA] font-medium max-w-xs mx-auto mb-1">
            {profileMeta.tagline}
          </p>
          <p className="text-xs text-[#9A9AB0] max-w-xs mx-auto leading-relaxed">
            {profileMeta.summary}
          </p>

          {/* Social Share Button */}
          <ShareButton
            score={scoreData.score || 65}
            profile={scoreData.profile || "The Developing"}
          />
        </div>

        {/* 4. 5 Dimension Bars */}
        <div className="mb-8 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Dimension Scores
            </h3>
            <span className="text-xs text-[#9A9AB0]">Normalized /20</span>
          </div>

          {DIMENSIONS.map((dim) => (
            <DimensionBar
              key={dim}
              dimension={dim}
              score={scoreData.dimensions?.[dim] ?? 12}
              isWeakness={dim === scoreData.primaryWeakness}
              isStrength={scoreData.dimensions?.[dim] >= 15}
            />
          ))}
        </div>

        {/* 5. One Free Insight (Tied to primary growth area) */}
        <div className="bg-gradient-to-br from-[#1C1C2B] to-[#14141F] border border-[#3DDC97]/40 rounded-3xl p-5 mb-8 shadow-[0_4px_24px_rgba(61,220,151,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#3DDC97]/20 text-[#3DDC97] px-2.5 py-0.5 rounded-full border border-[#3DDC97]/30">
              Free Key Insight
            </span>
            <span className="text-xs text-[#9A9AB0]">Your #1 Opportunity</span>
          </div>

          <h3 className="text-base font-bold text-white font-display mb-1.5">
            Your Biggest Growth Area: {primaryWeaknessMeta.name}
          </h3>

          <p className="text-xs sm:text-[13px] text-[#E0E0EC] leading-relaxed mb-3">
            Your assessment revealed that hesitation in <strong>{primaryWeaknessMeta.focusTitle.toLowerCase()}</strong> is what keeps your dating readiness from reaching the top tier. It's not a lack of charm—it's that your nervous system is waiting for 100% certainty before taking action.
          </p>

          <div className="bg-[#0B0B12]/80 rounded-xl p-3 border border-[#2A2A3D] text-xs text-[#9A9AB0]">
            <span className="text-[#3DDC97] font-semibold block mb-0.5">Quick Mindset Shift:</span>
            "Certainty is the enemy of initiation. Shift your goal from making an impression to simply checking their vibe."
          </div>
        </div>

        {/* 6. Money Quote */}
        <div className="text-center py-4 px-2 my-2">
          <p className="text-base sm:text-lg font-bold text-white font-display leading-snug">
            "Your score isn't the problem. <br />
            <span className="text-brand-gradient">Knowing what to work on is."</span>
          </p>
        </div>

        {/* 7. Locked Section Previews */}
        <LockedSection
          primaryWeakness={scoreData.primaryWeakness as Dimension}
          secondaryWeakness={scoreData.secondaryWeakness as Dimension}
          onUnlockClick={handleOpenCheckout}
        />

        {/* Verified Reader Testimonials */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <section className="mt-8 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 text-center">
            Questions About Your Report
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 flex items-center justify-between text-left text-xs sm:text-[13px] font-semibold text-white gap-2"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#9A9AB0] transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 pb-3.5 pt-0 text-xs text-[#9A9AB0] leading-relaxed border-t border-[#2A2A3D]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 text-center text-xs text-[#9A9AB0] pt-4 pb-2">
          <span>✓ UPI / Cards</span>
          <span>•</span>
          <span>✓ Instant Access</span>
          <span>•</span>
          <span>✓ 100% Confidential</span>
        </div>
      </main>

      {/* 8. Sticky Paywall Bar */}
      <PaywallBar onUnlock={handleOpenCheckout} />

      {/* 9. Checkout Confirmation Bottom Sheet */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Unlock Your Personal Report"
      >
        <div className="space-y-4">
          <div className="bg-[#1C1C2B] rounded-2xl p-4 border border-[#2A2A3D]">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-bold text-white">DateReady Full Report</span>
              <span className="text-lg font-extrabold text-white font-display">₹99</span>
            </div>
            <p className="text-xs text-[#9A9AB0]">
              Personalized web report + downloadable PDF + 7-day action plan.
            </p>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#2A2A3D] text-[#FF4D8D] focus:ring-[#FF4D8D] accent-[#FF4D8D]"
              />
              <span className="text-xs text-[#9A9AB0] leading-relaxed select-none group-hover:text-white transition-colors">
                I understand this is an instant digital product and non-refundable, except for failed delivery or duplicate charge.
              </span>
            </label>
          </div>

          <Button
            variant="brand"
            size="lg"
            fullWidth
            disabled={!termsAccepted}
            isLoading={isCheckingOut}
            onClick={handleProceedToPayment}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Pay ₹99 & View Report
          </Button>

          {/* Payment Methods Badges in Sheet */}
          <div className="pt-1 flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#C5C5D8]">
              <span>GPay</span>
              <span>•</span>
              <span>PhonePe</span>
              <span>•</span>
              <span>Paytm</span>
              <span>•</span>
              <span>BHIM UPI</span>
              <span>•</span>
              <span>Cards</span>
            </div>
            <p className="text-center text-[10px] text-[#9A9AB0]">
              🔒 Encrypted 256-bit checkout • Instant web report + PDF download
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
          <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
