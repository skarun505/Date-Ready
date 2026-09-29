"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") || "";
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!termsAccepted || isProcessing) return;
    setIsProcessing(true);

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
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");

      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      alert(e.message || "Checkout error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0B0B12] px-5 py-8 max-w-sm mx-auto flex flex-col justify-between">
      <div>
        <Link
          href={`/result?id=${encodeURIComponent(assessmentId)}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A9AB0] hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessment
        </Link>

        <h1 className="text-2xl font-bold font-display text-white mb-1">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#9A9AB0] mb-6">
          Unlock your personalized DateReady web report + PDF download.
        </p>

        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 mb-6 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-white">DateReady Full Report</span>
            <span className="text-xl font-bold font-display text-white">₹99</span>
          </div>

          <ul className="text-xs text-[#9A9AB0] space-y-1.5 pt-2 border-t border-[#2A2A3D]">
            <li>✓ Full breakdown of your #1 bottleneck</li>
            <li>✓ 3 situational field exercises</li>
            <li>✓ Personalized 7-day action plan</li>
            <li>✓ Permanent web access + PDF download</li>
          </ul>
        </div>

        <div className="p-4 bg-[#1C1C2B] rounded-2xl border border-[#2A2A3D] mb-6">
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
      </div>

      <div className="space-y-3 pt-4">
        <Button
          variant="brand"
          size="lg"
          fullWidth
          disabled={!termsAccepted}
          isLoading={isProcessing}
          onClick={handlePay}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Pay ₹99 Securely
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9A9AB0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3DDC97]" />
          <span>256-bit encrypted • UPI, Cards & NetBanking</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
          <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
