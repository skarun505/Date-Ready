/**
 * lib/adaptive-quiz.ts
 *
 * Adaptive pipeline engine that builds the ordered question sequence
 * dynamically based on the user's prior answers.
 *
 * Rules:
 *  1. Always start with the 12 core questions.
 *  2. After each core question answer, unlock adaptive follow-ups
 *     based on score thresholds.
 *  3. Adaptive questions are injected right after the question that
 *     unlocked them (domain-context grouping).
 *  4. Never show the same question twice.
 *  5. Cap total questions at MAX_QUESTIONS.
 *  6. Adaptive questions are shuffled within each unlock batch so
 *     every run feels fresh.
 */

import {
  Question,
  coreQuestions,
  allQuestionsMap,
} from "@/config/questions";

export const MAX_QUESTIONS = 18; // cap to keep the quiz snappy

/** Score for a given answer in a question */
function getAnswerScore(question: Question, optionId: string): number {
  const opt = question.options.find((o) => o.id === optionId);
  return opt?.score ?? 0;
}

/** Shuffle an array (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface AdaptiveState {
  /** Ordered list of question IDs to present */
  pipeline: string[];
  /** Answers so far: questionId → optionId */
  answers: Record<string, string>;
}

/** Build initial pipeline from core questions */
export function initPipeline(): AdaptiveState {
  return {
    pipeline: coreQuestions.map((q) => q.id),
    answers: {},
  };
}

/**
 * Record an answer and expand the pipeline with any newly unlocked
 * adaptive questions.
 */
export function recordAnswer(
  state: AdaptiveState,
  questionId: string,
  optionId: string
): AdaptiveState {
  const question = allQuestionsMap[questionId];
  if (!question) return state;

  const score = getAnswerScore(question, optionId);
  const newAnswers = { ...state.answers, [questionId]: optionId };

  // Determine which adaptive questions to unlock
  const toUnlock: string[] = [];

  if (score <= 1 && question.lowScoreUnlocks) {
    toUnlock.push(...shuffle(question.lowScoreUnlocks));
  }
  if (score >= 2 && question.highScoreUnlocks) {
    toUnlock.push(...shuffle(question.highScoreUnlocks));
  }

  // Filter out already queued or answered
  const existing = new Set(state.pipeline);
  const freshUnlocks = toUnlock.filter(
    (id) => !existing.has(id) && !(id in newAnswers) && allQuestionsMap[id]
  );

  if (freshUnlocks.length === 0) {
    return { ...state, answers: newAnswers };
  }

  // Inject unlocked questions right after the current question's position
  const insertAfter = state.pipeline.indexOf(questionId);
  const insertAt = insertAfter === -1 ? state.pipeline.length : insertAfter + 1;

  const newPipeline = [
    ...state.pipeline.slice(0, insertAt),
    ...freshUnlocks,
    ...state.pipeline.slice(insertAt),
  ].slice(0, MAX_QUESTIONS);

  return { pipeline: newPipeline, answers: newAnswers };
}

/** Return the next unanswered question */
export function getNextQuestion(
  state: AdaptiveState
): Question | null {
  for (const id of state.pipeline) {
    if (!(id in state.answers) && allQuestionsMap[id]) {
      return allQuestionsMap[id];
    }
  }
  return null;
}

/** Return progress fraction [0, 1] */
export function getProgress(state: AdaptiveState): number {
  const answered = Object.keys(state.answers).length;
  const total = state.pipeline.length;
  return total === 0 ? 0 : answered / total;
}

/** Return index of current question in pipeline */
export function getCurrentIndex(state: AdaptiveState): number {
  const answered = Object.keys(state.answers).length;
  return answered;
}

/** True when all pipeline questions are answered */
export function isComplete(state: AdaptiveState): boolean {
  return state.pipeline.every((id) => id in state.answers);
}
