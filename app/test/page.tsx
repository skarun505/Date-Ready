"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { coreQuestions } from "@/config/questions";
import {
  AdaptiveState,
  initPipeline,
  recordAnswer,
  getNextQuestion,
  getProgress,
  getCurrentIndex,
  isComplete,
} from "@/lib/adaptive-quiz";
import { OptionButton } from "@/components/quiz/OptionButton";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { EmailCaptureModal } from "@/components/quiz/EmailCaptureModal";
import { MotivationPopup, MILESTONES, MotivationMessage } from "@/components/quiz/MotivationPopup";
import { track } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import { Sparkles, Zap, Brain, Flame, Hash } from "lucide-react";

const STORAGE_KEY_STATE = "dateready_adaptive_state_v2";
const STORAGE_KEY_ASSESSMENT_ID = "dateready_assessment_id";

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  situational: {
    icon: <Sparkles className="w-3.5 h-3.5" />,
    label: "Scenario",
    color: "text-[#FF4D8D] bg-[#FF4D8D]/10 border-[#FF4D8D]/20",
  },
  number: {
    icon: <Hash className="w-3.5 h-3.5" />,
    label: "Quick Rate",
    color: "text-[#3DDC97] bg-[#3DDC97]/10 border-[#3DDC97]/20",
  },
  puzzle: {
    icon: <Brain className="w-3.5 h-3.5" />,
    label: "Think",
    color: "text-[#7C5CFF] bg-[#7C5CFF]/10 border-[#7C5CFF]/20",
  },
  hot: {
    icon: <Flame className="w-3.5 h-3.5" />,
    label: "Hot Take",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  mindset: {
    icon: <Zap className="w-3.5 h-3.5" />,
    label: "Mindset",
    color: "text-[#7C5CFF] bg-[#7C5CFF]/10 border-[#7C5CFF]/20",
  },
};

export default function QuizPage() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<AdaptiveState>(initPipeline());
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [motivation, setMotivation] = useState<MotivationMessage | null>(null);
  const [animKey, setAnimKey] = useState(0); // force re-render for slide animation
  const pendingMilestone = useRef<number | null>(null);

  // Restore / init session
  useEffect(() => {
    track("quiz_viewed");
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      if (saved) {
        setQuizState(JSON.parse(saved));
      }

      const savedId = localStorage.getItem(STORAGE_KEY_ASSESSMENT_ID);
      if (savedId) {
        setAssessmentId(savedId);
      } else {
        fetch("/api/assessment/start", { method: "POST" })
          .then((r) => r.json())
          .then((d) => {
            const id = d.assessmentId || crypto.randomUUID();
            setAssessmentId(id);
            localStorage.setItem(STORAGE_KEY_ASSESSMENT_ID, id);
          })
          .catch(() => {
            const id = crypto.randomUUID();
            setAssessmentId(id);
            localStorage.setItem(STORAGE_KEY_ASSESSMENT_ID, id);
          });
      }
    } catch {}
  }, []);

  const currentQ = getNextQuestion(quizState);
  const currentIndex = getCurrentIndex(quizState);
  const totalInPipeline = quizState.pipeline.length;

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isAdvancing || !currentQ) return;
      setIsAdvancing(true);

      const nextState = recordAnswer(quizState, currentQ.id, optionId);

      track("question_answered", {
        questionId: currentQ.id,
        answerId: optionId,
        dimension: currentQ.dimension,
        type: currentQ.type,
        index: currentIndex + 1,
      });

      // Persist
      try {
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(nextState));
      } catch {}

      // Check milestone
      const nextIndex = currentIndex + 1;
      if (MILESTONES[nextIndex]) {
        pendingMilestone.current = nextIndex;
      }

      setTimeout(() => {
        setQuizState(nextState);
        setAnimKey((k) => k + 1);

        if (isComplete(nextState)) {
          track("quiz_completed", { totalQuestions: nextState.pipeline.length });
          if (pendingMilestone.current !== null) {
            setMotivation(MILESTONES[pendingMilestone.current]);
            pendingMilestone.current = null;
            setTimeout(() => setShowEmailCapture(true), 2800);
          } else {
            setShowEmailCapture(true);
          }
        } else {
          if (pendingMilestone.current !== null) {
            setMotivation(MILESTONES[pendingMilestone.current]);
            pendingMilestone.current = null;
          }
        }
        setIsAdvancing(false);
      }, 220);
    },
    [isAdvancing, currentQ, quizState, currentIndex]
  );

  const handleBack = useCallback(() => {
    if (isAdvancing || currentIndex === 0) return;
    const prevId = quizState.pipeline[currentIndex - 1];
    if (!prevId) return;
    const newAnswers = { ...quizState.answers };
    delete newAnswers[prevId];
    const newState = { ...quizState, answers: newAnswers };
    setQuizState(newState);
    setAnimKey((k) => k + 1);
    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(newState));
    } catch {}
  }, [isAdvancing, currentIndex, quizState]);

  // Desktop keyboard navigation (1-4, A-D, Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showEmailCapture || isAdvancing || !currentQ) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      if (key === "1" || key === "a") {
        if (currentQ.options[0]) handleSelectOption(currentQ.options[0].id);
      } else if (key === "2" || key === "b") {
        if (currentQ.options[1]) handleSelectOption(currentQ.options[1].id);
      } else if (key === "3" || key === "c") {
        if (currentQ.options[2]) handleSelectOption(currentQ.options[2].id);
      } else if (key === "4" || key === "d") {
        if (currentQ.options[3]) handleSelectOption(currentQ.options[3].id);
      } else if (key === "backspace" || key === "arrowleft") {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEmailCapture, isAdvancing, currentQ, handleSelectOption, handleBack]);

  const handleEmailSubmit = async ({ email, name }: { email: string; name: string }) => {
    setIsSubmitting(true);
    track("email_submitted", { email });

    try {
      const activeId =
        assessmentId ||
        localStorage.getItem(STORAGE_KEY_ASSESSMENT_ID) ||
        crypto.randomUUID();
      const utm = getStoredUtm();

      // Convert adaptive answers to flat format for API
      const flatAnswers: Record<string, string> = quizState.answers;

      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: activeId,
          answers: flatAnswers,
          email,
          name,
          utm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      localStorage.setItem("dateready_result_data", JSON.stringify(data));
      localStorage.setItem("dateready_user_name", name || "there");
      localStorage.setItem("dateready_token", data.token);
      localStorage.removeItem(STORAGE_KEY_STATE);

      router.push(
        `/result?id=${encodeURIComponent(data.assessmentId)}&t=${encodeURIComponent(data.token)}`
      );
    } catch (err: any) {
      alert(err.message || "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (showEmailCapture) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center bg-[#0B0B12]">
        <EmailCaptureModal onSubmit={handleEmailSubmit} isLoading={isSubmitting} />
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0B12]">
        <div className="w-8 h-8 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const typeMeta = TYPE_META[currentQ.type] || TYPE_META.situational;
  const isAdaptive = !coreQuestions.find((q) => q.id === currentQ.id);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0B0B12]">
      {/* Motivation popup overlay */}
      {motivation && (
        <MotivationPopup
          message={motivation}
          onDismiss={() => setMotivation(null)}
        />
      )}

      <QuizHeader
        currentIndex={currentIndex}
        total={totalInPipeline}
        canGoBack={currentIndex > 0}
        onBack={handleBack}
      />

      <main
        key={animKey}
        className="flex-1 px-5 pt-5 pb-12 flex flex-col max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {/* Adaptive badge */}
        {isAdaptive && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[11px] font-bold text-[#7C5CFF] self-start">
            <Zap className="w-3 h-3" />
            Personalised for you
          </div>
        )}

        {/* Type badge + emoji */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${typeMeta.color}`}
          >
            {typeMeta.icon}
            {typeMeta.label}
          </span>
          {currentQ.emoji && (
            <span className="text-xl">{currentQ.emoji}</span>
          )}
        </div>

        {/* Question text */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
            {currentQ.text}
          </h2>
          {currentQ.subtitle && (
            <p className="text-xs text-[#9A9AB0] mt-2 leading-relaxed">
              {currentQ.subtitle}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {currentQ.options.map((opt) => (
            <OptionButton
              key={opt.id}
              id={opt.id}
              text={opt.text}
              isSelected={quizState.answers[currentQ.id] === opt.id}
              disabled={isAdvancing}
              onSelect={() => handleSelectOption(opt.id)}
            />
          ))}
        </div>

        {/* Hint */}
        <div className="pt-5 text-center text-xs text-[#6A6A80] flex items-center justify-center gap-2">
          <span>Tap any answer to continue</span>
          <span className="hidden sm:inline text-[#4A4A60]">•</span>
          <span className="hidden sm:inline text-[#4A4A60]">Press 1–4 or A–D</span>
        </div>
      </main>
    </div>
  );
}
