import { Dimension, DIMENSIONS } from "@/config/dimensions";
import { allQuestionsMap } from "@/config/questions";
import { getProfile } from "@/config/profiles";

export interface ScoreResult {
  dimensions: Record<Dimension, number>; // each normalized 0–20
  rawDimensions: Record<Dimension, number>;
  maxDimensions: Record<Dimension, number>;
  total: number;                          // 0–100
  profile: string;
  primaryWeakness: Dimension;
  secondaryWeakness: Dimension;
  strengths: Dimension[];
  reportKey: string;
  totalAnswered: number;
}

// Tie-break priority when two weaknesses are equal: earlier = more urgent
export const TIE_ORDER: Dimension[] = [
  "approach",
  "resilience",
  "conversation",
  "social",
  "presentation",
];

/**
 * Compute scores from an adaptive answers map.
 *
 * Adaptive (non-core) questions carry 0.6× weight to avoid over-penalising
 * users who got harder follow-ups, and to keep core questions authoritative.
 */
export function computeScore(answers: Record<string, string>): ScoreResult {
  const raw: Record<Dimension, number> = {
    approach: 0,
    conversation: 0,
    social: 0,
    resilience: 0,
    presentation: 0,
  };

  const max: Record<Dimension, number> = {
    approach: 0,
    conversation: 0,
    social: 0,
    resilience: 0,
    presentation: 0,
  };

  // Core question IDs (q1–q12)
  const coreIds = new Set(
    ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12"]
  );

  let totalAnswered = 0;

  for (const [qId, answerId] of Object.entries(answers)) {
    const q = allQuestionsMap[qId];
    if (!q) continue; // skip unknown questions

    const opt = q.options.find((o) => o.id === answerId);
    if (!opt) continue;

    const weight = coreIds.has(qId) ? 1.0 : 0.6;
    raw[q.dimension] += opt.score * weight;
    max[q.dimension] += 3 * weight;
    totalAnswered++;
  }

  // Normalize each dimension to 0–20
  const dimensions = {} as Record<Dimension, number>;
  for (const d of DIMENSIONS) {
    if (max[d] === 0) {
      dimensions[d] = 10; // neutral fallback if no questions answered for dim
    } else {
      dimensions[d] = Math.round((raw[d] / max[d]) * 20);
    }
  }

  const total = DIMENSIONS.reduce((s, d) => s + dimensions[d], 0);

  // Sort ascending (lowest score = weakest dimension)
  const ranked = [...DIMENSIONS].sort((a, b) => {
    const diff = dimensions[a] - dimensions[b];
    if (diff !== 0) return diff;
    return TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b);
  });

  const primaryWeakness = ranked[0];
  const secondaryWeakness = ranked[1];
  const strengths = ranked.slice(-2).reverse();
  const reportKey = `${primaryWeakness}__${secondaryWeakness}`;

  return {
    dimensions,
    rawDimensions: raw,
    maxDimensions: max,
    total,
    profile: getProfile(total),
    primaryWeakness,
    secondaryWeakness,
    strengths,
    reportKey,
    totalAnswered,
  };
}
