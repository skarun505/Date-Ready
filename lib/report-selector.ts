import { Dimension } from "@/config/dimensions";
import { ScoreResult } from "./scoring";
import { approachPrimary } from "@/config/report-content/primary/approach";
import { conversationPrimary } from "@/config/report-content/primary/conversation";
import { socialPrimary } from "@/config/report-content/primary/social";
import { resiliencePrimary } from "@/config/report-content/primary/resilience";
import { presentationPrimary } from "@/config/report-content/primary/presentation";
import { secondaryBlocks, SecondaryBlock } from "@/config/report-content/secondary";
import { getBridge } from "@/config/report-content/bridges";
import { strengthsContent, StrengthBlock } from "@/config/report-content/strengths";
import { PROFILES, ProfileMeta } from "@/config/profiles";

const primaryMap: Record<Dimension, any> = {
  approach: approachPrimary,
  conversation: conversationPrimary,
  social: socialPrimary,
  resilience: resiliencePrimary,
  presentation: presentationPrimary,
};

export interface FullReportData {
  reportKey: string;
  totalScore: number;
  profile: ProfileMeta;
  dimensions: Record<Dimension, number>;
  primary: {
    dimension: Dimension;
    focusLabel: string;
    title: string;
    whatItLooksLike: string;
    whyItHappens: string;
    bandText: string;
    exercises: Array<{
      name: string;
      time: string;
      steps: string[];
      whyItWorks: string;
    }>;
    plan7day: Array<{
      day: number;
      action: string;
      time: string;
      reflection: string;
    }>;
  };
  secondary: SecondaryBlock;
  bridge: string;
  strengths: StrengthBlock[];
}

export function selectReport(score: ScoreResult): FullReportData {
  const primaryRaw = primaryMap[score.primaryWeakness];
  const secondary = secondaryBlocks[score.secondaryWeakness];
  const bridge = getBridge(score.primaryWeakness, score.secondaryWeakness);
  const profile = PROFILES[score.profile] || PROFILES["The Developing"];

  // Select score band text for primary weakness
  const primaryScore = score.dimensions[score.primaryWeakness] || 0;
  let bandText = primaryRaw.bands.mid;
  if (primaryScore < 10) bandText = primaryRaw.bands.low;
  else if (primaryScore >= 15) bandText = primaryRaw.bands.high;

  // Select top 2 strengths
  const strength1 = strengthsContent[score.strengths[0]] || strengthsContent.conversation;
  const strength2 = strengthsContent[score.strengths[1]] || strengthsContent.social;

  return {
    reportKey: score.reportKey,
    totalScore: score.total,
    profile,
    dimensions: score.dimensions,
    primary: {
      dimension: score.primaryWeakness,
      focusLabel: primaryRaw.focusLabel,
      title: primaryRaw.title,
      whatItLooksLike: primaryRaw.whatItLooksLike,
      whyItHappens: primaryRaw.whyItHappens,
      bandText,
      exercises: primaryRaw.exercises,
      plan7day: primaryRaw.plan7day,
    },
    secondary,
    bridge,
    strengths: [strength1, strength2],
  };
}
