"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ScoreRing } from "@/components/result/ScoreRing";
import { DimensionBar } from "@/components/result/DimensionBar";
import { ExerciseCard } from "@/components/report/ExerciseCard";
import { DayPlanAccordion } from "@/components/report/DayPlanAccordion";
import { UpsellBanner } from "@/components/report/UpsellBanner";
import { Button } from "@/components/ui/Button";
import { DIMENSIONS, Dimension } from "@/config/dimensions";
import { track } from "@/lib/analytics";

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") || "";
  const token = searchParams.get("token") || "";

  const [reportData, setReportData] = useState<any>(null);
  const [userName, setUserName] = useState<string>("Friend");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requiresPayment, setRequiresPayment] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  useEffect(() => {
    track("report_viewed", { assessmentId });

    const fetchReport = async () => {
      try {
        const url = `/api/report/${encodeURIComponent(assessmentId || "mock-assessment-demo")}${
          token ? `?token=${encodeURIComponent(token)}` : ""
        }`;

        const res = await fetch(url);
        const data = await res.json();

        if (res.status === 402 || data.requiresPayment) {
          setRequiresPayment(true);
          setIsLoading(false);
          return;
        }

        if (data.report) {
          setReportData(data.report);
          if (data.userName) setUserName(data.userName);
        }
      } catch (e) {
        console.error("Failed to load report", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [assessmentId, token]);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    track("pdf_downloaded", { assessmentId });

    try {
      const pdfUrl = `/api/report/${encodeURIComponent(assessmentId || "mock-assessment-demo")}/pdf${
        token ? `?token=${encodeURIComponent(token)}` : ""
      }`;
      window.open(pdfUrl, "_blank");
    } catch (e) {
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  const handleUpgradeKit = async () => {
    setIsUpgrading(true);
    track("upsell_clicked", { assessmentId, product: "kit_299" });

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessmentId || "demo-assessment-id",
          product: "kit_299",
          termsAccepted: true,
          termsVersion: "v1",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");

      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      alert(e.message || "Failed to start checkout. Please try again.");
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
        <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user navigated directly without paying
  if (requiresPayment) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center px-5 py-12 text-center bg-[#0B0B12] max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-[#FF4D8D]/15 border border-[#FF4D8D]/40 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-[#FF4D8D]" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display mb-2">
          Report Locked
        </h2>
        <p className="text-xs text-[#9A9AB0] leading-relaxed mb-6">
          To view this comprehensive personal dating readiness report and action plan, unlock it for ₹99.
        </p>
        <Button
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => router.push(`/result?id=${encodeURIComponent(assessmentId)}`)}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Go to Checkout (₹99)
        </Button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center px-5 text-center bg-[#0B0B12]">
        <p className="text-sm text-[#9A9AB0] mb-4">Report not found.</p>
        <Button variant="secondary" size="md" onClick={() => router.push("/")}>
          Return Home
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "scores", label: "Scores" },
    { id: "focus", label: "Growth Focus" },
    { id: "drills", label: "Field Drills" },
    { id: "plan", label: "7-Day Plan" },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] pb-24 bg-[#0B0B12]">
      {/* Sticky Top Bar */}
      <header className="px-5 py-3 flex items-center justify-between border-b border-[#2A2A3D]/50 bg-[#0B0B12]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg font-display tracking-tight text-white">
            Date<span className="text-[#FF4D8D]">Ready</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#3DDC97] bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1">
            Unlocked
          </span>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloadingPdf}
          className="h-8 px-3 rounded-xl bg-[#1C1C2B] hover:bg-[#2A2A3D] border border-[#2A2A3D] text-xs font-semibold text-[#F5F5FA] flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#FF4D8D]" />
          <span>{isDownloadingPdf ? "Generating..." : "Download PDF"}</span>
        </button>
      </header>

      {/* Horizontal Sticky Tab Bar */}
      <nav className="sticky top-[53px] z-20 bg-[#0B0B12]/95 backdrop-blur-md border-b border-[#2A2A3D]/40 px-5 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#FF4D8D] to-[#7C5CFF] text-white shadow-sm"
                : "bg-[#14141F] text-[#9A9AB0] hover:text-white border border-[#2A2A3D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Report Story Container */}
      <main className="px-5 pt-6 max-w-sm mx-auto w-full space-y-6">
        {/* Cover Card */}
        <section className="bg-gradient-to-br from-[#1C1C2B] to-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A9AB0] block">
                Personalized Blueprint
              </span>
              <h1 className="text-xl font-bold font-display text-white mt-0.5">
                Prepared for {userName}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-display text-[#FF4D8D]">
                {reportData.totalScore}
              </span>
              <span className="text-xs text-[#9A9AB0]">/100</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4D8D]/15 border border-[#FF4D8D]/30 text-xs font-bold text-[#FF4D8D] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{reportData.profile.name}</span>
          </div>

          <p className="text-xs text-[#E0E0EC] leading-relaxed">
            {reportData.profile.description}
          </p>
        </section>

        {/* 1. Dimension Breakdown (Scores Tab) */}
        {(activeTab === "overview" || activeTab === "scores") && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Dimension Balance
            </h3>
            <div className="space-y-2">
              {DIMENSIONS.map((dim) => (
                <DimensionBar
                  key={dim}
                  dimension={dim}
                  score={reportData.dimensions[dim] || 12}
                  isWeakness={dim === reportData.primary.dimension}
                  isStrength={reportData.dimensions[dim] >= 14}
                />
              ))}
            </div>
          </section>
        )}

        {/* 2. Top Strengths */}
        {(activeTab === "overview" || activeTab === "scores") && (
          <section className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Top Strengths
              </span>
              <span className="text-xs text-[#9A9AB0]">What makes you compelling</span>
            </div>

            {reportData.strengths.map((str: any, idx: number) => (
              <div key={idx} className="border-t border-[#2A2A3D]/60 pt-3 first:border-0 first:pt-0">
                <h4 className="text-sm font-bold text-white mb-0.5">{str.title}</h4>
                <p className="text-xs text-[#3DDC97] font-medium mb-1">{str.tagline}</p>
                <p className="text-xs text-[#9A9AB0] leading-relaxed mb-1.5">{str.description}</p>
                <p className="text-[11px] text-[#7C5CFF] italic">
                  <strong>How to leverage:</strong> {str.howToLeverage}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* 3. Primary Growth Area Deep Dive (Focus Tab) */}
        {(activeTab === "overview" || activeTab === "focus") && (
          <section className="bg-gradient-to-b from-[#1C1C2B] to-[#14141F] border border-[#FF4D8D]/30 rounded-3xl p-5 space-y-4 shadow-[0_4px_24px_rgba(255,77,141,0.12)]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FF4D8D]/20 text-[#FF4D8D] px-2.5 py-0.5 rounded-full border border-[#FF4D8D]/30">
                Primary Bottleneck
              </span>
              <span className="text-xs text-[#9A9AB0]">High Leverage Focus</span>
            </div>

            <h3 className="text-base font-bold text-white font-display leading-snug">
              {reportData.primary.title}
            </h3>

            <div>
              <span className="text-xs font-semibold text-[#FF4D8D] block mb-1">
                What it looks like in practice:
              </span>
              <p className="text-xs text-[#E0E0EC] leading-relaxed">
                {reportData.primary.whatItLooksLike}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#7C5CFF] block mb-1">
                Why your nervous system does this:
              </span>
              <p className="text-xs text-[#9A9AB0] leading-relaxed">
                {reportData.primary.whyItHappens}
              </p>
            </div>

            <div className="bg-[#0B0B12]/80 rounded-2xl p-3.5 border border-[#2A2A3D] text-xs">
              <span className="text-white font-semibold block mb-1">Score Band Analysis:</span>
              <p className="text-[#9A9AB0] leading-relaxed">{reportData.primary.bandText}</p>
            </div>
          </section>
        )}

        {/* 4. Bridge & Secondary Area */}
        {(activeTab === "overview" || activeTab === "focus") && (
          <section className="bg-[#14141F] border border-[#2A2A3D] rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#7C5CFF]/20 text-[#7C5CFF] px-2.5 py-0.5 rounded-full border border-[#7C5CFF]/30">
                Pattern Synthesis
              </span>
              <span className="text-xs text-[#9A9AB0]">How they trigger each other</span>
            </div>

            <div className="bg-[#1C1C2B] rounded-2xl p-3.5 border border-[#7C5CFF]/30 text-xs sm:text-[13px] text-[#F5F5FA] leading-relaxed">
              <p>{reportData.bridge}</p>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-bold text-white mb-1">
                {reportData.secondary.title}
              </h4>
              <p className="text-xs text-[#9A9AB0] leading-relaxed mb-3">
                {reportData.secondary.whatItLooksLike}
              </p>
              <div className="bg-[#1C1C2B] rounded-xl p-3 border border-[#2A2A3D] text-xs">
                <span className="text-[#3DDC97] font-semibold block mb-0.5">Golden Rule:</span>
                <p className="text-white">{reportData.secondary.keyTip}</p>
              </div>
            </div>
          </section>
        )}

        {/* 5. Field Exercises (Drills Tab) */}
        {(activeTab === "overview" || activeTab === "drills") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Targeted Field Drills
              </h3>
              <span className="text-xs text-[#9A9AB0]">Interactive Checklist</span>
            </div>

            <div className="space-y-3">
              {reportData.primary.exercises.map((ex: any, idx: number) => (
                <ExerciseCard
                  key={idx}
                  id={`ex_${idx}`}
                  name={ex.name}
                  time={ex.time}
                  steps={ex.steps}
                  whyItWorks={ex.whyItWorks}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. 7-Day Plan (Plan Tab) */}
        {(activeTab === "overview" || activeTab === "plan") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Your 7-Day Action Blueprint
              </h3>
              <span className="text-xs text-[#9A9AB0]">5-10 min/day</span>
            </div>

            <DayPlanAccordion days={reportData.primary.plan7day} />
          </section>
        )}

        {/* 7. Confidence Kit Upsell */}
        <UpsellBanner onUpgrade={handleUpgradeKit} isLoading={isUpgrading} />

        {/* Footer */}
        <footer className="text-center pt-4 pb-8 border-t border-[#2A2A3D]/40 text-xs text-[#6A6A80] space-y-2">
          <p>DateReady by Subix • Confidential Assessment Report</p>
          <p>Questions? Reach out to support@dateready.subix.in</p>
        </footer>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12] text-white">
          <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
