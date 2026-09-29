export type Dimension = "approach" | "conversation" | "social" | "resilience" | "presentation";

export interface DimensionMeta {
  key: Dimension;
  name: string;
  shortName: string;
  measures: string;
  focusTitle: string;
  description: string;
}

export const DIMENSIONS: Dimension[] = [
  "approach",
  "conversation",
  "social",
  "resilience",
  "presentation",
];

export const DIMENSION_DETAILS: Record<Dimension, DimensionMeta> = {
  approach: {
    key: "approach",
    name: "Approach Confidence",
    shortName: "Approach",
    measures: "Initiating interaction without hesitation",
    focusTitle: "Starting conversations effortlessly",
    description: "Your comfort with starting new interactions, breaking the ice, and making the first move in varied environments.",
  },
  conversation: {
    key: "conversation",
    name: "Conversation Confidence",
    shortName: "Conversation",
    measures: "Keeping dialogue engaging and natural",
    focusTitle: "Maintaining effortless natural dialogue",
    description: "Your ability to keep conversations flowing naturally, navigate pauses without panic, and share authentically.",
  },
  social: {
    key: "social",
    name: "Social Comfort",
    shortName: "Social",
    measures: "Ease in social spaces and groups",
    focusTitle: "Thriving in group & social settings",
    description: "How relaxed and energized you feel walking into unfamiliar rooms, group gatherings, and active social environments.",
  },
  resilience: {
    key: "resilience",
    name: "Emotional Resilience",
    shortName: "Resilience",
    measures: "Handling awkwardness, silence & rejection",
    focusTitle: "Unshakable calm through awkwardness & delays",
    description: "Your psychological stability when facing delayed replies, awkward moments, or polite disinterest without taking it personally.",
  },
  presentation: {
    key: "presentation",
    name: "Self-Presentation",
    shortName: "Presentation",
    measures: "Comfort presenting yourself with ease",
    focusTitle: "Showing up with genuine self-assurance",
    description: "Your internal ease regarding your personal style, photos, posture, and showing up authentically without over-editing yourself.",
  },
};
