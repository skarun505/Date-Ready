"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchaseId") || "";
  const assessmentId = searchParams.get("assessmentId") || "";
  const isSimulated = searchParams.get("simulated") === "true";

  const [status, setStatus] = useState<string>("polling");
  const [token, setToken] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    if (!purchaseId) return;

    let intervalId: any = null;
    let pollCount = 0;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/purchase/status?purchaseId=${encodeURIComponent(purchaseId)}`);
        const data = await res.json();

        if (data.isPaid) {
          setStatus("paid");
          if (data.token) setToken(data.token);
          if (data.product === "kit_299") {
            try {
              localStorage.setItem(`dateready_kit_unlocked_${data.assessmentId || assessmentId}`, "true");
              localStorage.setItem("dateready_has_kit", "true");
            } catch (e) {}
          }
          clearInterval(intervalId);

          try {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.4 },
              colors: ["#FF4D8D", "#7C5CFF", "#3DDC97"],
            });
          } catch (e) {}

          // Automatically redirect to report after short celebratory pause
          setTimeout(() => {
            const redirectUrl = `/report?id=${encodeURIComponent(data.assessmentId || assessmentId)}${
              data.token ? `&token=${encodeURIComponent(data.token)}` : ""
            }`;
            router.push(redirectUrl);
          }, 1800);
        } else if (data.status === "failed") {
          setStatus("failed");
          clearInterval(intervalId);
        }
      } catch (e) {
        // Continue polling
      }

      pollCount += 2;
      setSecondsElapsed(pollCount);

      if (pollCount >= 60) {
        clearInterval(intervalId);
        setStatus("timeout");
      }
    };

    // Initial check
    checkStatus();
    intervalId = setInterval(checkStatus, 2000);

    // Auto-trigger simulation in local development mode for seamless testing
    if (isSimulated) {
      const autoTimer = setTimeout(() => {
        handleSimulatePaymentWebhook();
      }, 800);
      return () => {
        clearInterval(intervalId);
        clearTimeout(autoTimer);
      };
    }

    return () => clearInterval(intervalId);
  }, [purchaseId, assessmentId, router, isSimulated]);

  // Handler for local development testing simulation
  const handleSimulatePaymentWebhook = async () => {
    setIsSimulating(true);
    try {
      // Determine if this is a kit_299 or report_99 purchase
      let detectedProduct = "report_99";
      let detectedAmount = 9900;

      try {
        const statusRes = await fetch(`/api/purchase/status?purchaseId=${encodeURIComponent(purchaseId)}`);
        const statusData = await statusRes.json();
        if (statusData.product === "kit_299") {
          detectedProduct = "kit_299";
          detectedAmount = 29900;
        }
      } catch (e) {}

      const res = await fetch("/api/webhooks/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `sim_evt_${Date.now()}`,
          type: "payment.succeeded",
          data: {
            payment_id: `dodo_sim_pay_${Date.now()}`,
            amount: detectedAmount,
            currency: "INR",
            metadata: {
              purchase_id: purchaseId,
              assessment_id: assessmentId,
              product: detectedProduct,
            },
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to simulate webhook");
      }
    } catch (e: any) {
      alert("Simulation error: " + e.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center px-5 py-12 text-center bg-[#0B0B12] max-w-sm mx-auto">
      {status === "polling" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF4D8D]/20 to-[#7C5CFF]/20 border border-[#FF4D8D]/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,77,141,0.25)]">
            <Loader2 className="w-8 h-8 text-[#FF4D8D] animate-spin" />
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display text-white mb-2">
              Confirming Your Payment...
            </h2>
            <p className="text-xs text-[#9A9AB0] leading-relaxed max-w-xs mx-auto">
              Please don't close this window. We're verifying your transaction with the payment gateway.
            </p>
          </div>

          <div className="bg-[#14141F] rounded-2xl p-4 border border-[#2A2A3D] text-xs text-[#9A9AB0]">
            <span>Elapsed: {secondsElapsed}s • Checking status</span>
          </div>

          {/* Development simulation helper */}
          {isSimulated && (
            <div className="mt-6 p-4 bg-[#1C1C2B] border border-[#FF4D8D]/40 rounded-2xl">
              <span className="text-xs font-bold text-[#FF4D8D] block mb-1">
                Developer Simulation Mode
              </span>
              <p className="text-[11px] text-[#9A9AB0] mb-3">
                Click below to trigger mock Dodo webhook `payment.succeeded`.
              </p>
              <Button
                variant="brand"
                size="sm"
                fullWidth
                isLoading={isSimulating}
                onClick={handleSimulatePaymentWebhook}
              >
                Simulate Payment Success
              </Button>
            </div>
          )}
        </div>
      )}

      {status === "paid" && (
        <div className="space-y-5 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(61,220,151,0.25)]">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display text-white mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-xs text-[#9A9AB0] leading-relaxed max-w-xs mx-auto">
              Your personalized DateReady report is now unlocked. Redirecting you to your report...
            </p>
          </div>

          <Button
            variant="brand"
            size="lg"
            fullWidth
            onClick={() =>
              router.push(
                `/report?id=${encodeURIComponent(assessmentId)}${
                  token ? `&token=${encodeURIComponent(token)}` : ""
                }`
              )
            }
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Open My Report Now
          </Button>
        </div>
      )}

      {status === "timeout" && (
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-amber-400" />
          </div>

          <h2 className="text-xl font-bold text-white font-display">
            Taking Longer Than Usual
          </h2>
          <p className="text-xs text-[#9A9AB0] leading-relaxed">
            If your bank has deducted the amount, don't worry! Your payment confirmation will complete in the background and an access link will be delivered to your email.
          </p>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => window.location.reload()}
          >
            Check Again
          </Button>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>

          <h2 className="text-xl font-bold text-white font-display">
            Payment Not Completed
          </h2>
          <p className="text-xs text-[#9A9AB0] leading-relaxed">
            The transaction was cancelled or interrupted. You can try again at any time.
          </p>

          <Button
            variant="brand"
            size="md"
            fullWidth
            onClick={() => router.push(`/result?id=${encodeURIComponent(assessmentId)}`)}
          >
            Back to Assessment
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
          <Loader2 className="w-8 h-8 text-[#FF4D8D] animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
