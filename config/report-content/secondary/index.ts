import { Dimension } from "@/config/dimensions";

export interface SecondaryBlock {
  dimension: Dimension;
  title: string;
  focusLabel: string;
  whatItLooksLike: string;
  exercise: {
    name: string;
    time: string;
    description: string;
  };
  keyTip: string;
}

export const secondaryBlocks: Record<Dimension, SecondaryBlock> = {
  approach: {
    dimension: "approach",
    title: "Secondary Focus: Lowering Approach Friction",
    focusLabel: "Making the first move easier",
    whatItLooksLike:
      "While not your biggest bottleneck, hesitation still crops up when someone really catches your eye. You tend to delay just long enough for the natural moment to evaporate.",
    exercise: {
      name: "The 5-Second Action Rule",
      time: "2 mins",
      description: "When you notice someone interesting, count down '5-4-3-2-1' and take physical steps toward them before your brain can construct doubts.",
    },
    keyTip: "Never negotiate with hesitation. The first 3 seconds are always the easiest.",
  },
  conversation: {
    dimension: "conversation",
    title: "Secondary Focus: Conversational Agility",
    focusLabel: "Smoothing dialogue transitions",
    whatItLooksLike:
      "You can carry dialogue, but you occasionally fall back on familiar polite topics rather than leaning into playful curiosity and banter.",
    exercise: {
      name: "Curiosity First Reframe",
      time: "5 mins",
      description: "In your next chat, uncover what they are genuinely passionate about outside of work within the first 5 minutes.",
    },
    keyTip: "Interesting people are interested people. Lead with genuine curiosity.",
  },
  social: {
    dimension: "social",
    title: "Secondary Focus: Group Dynamic Calibration",
    focusLabel: "Commanding ease in mixed groups",
    whatItLooksLike:
      "You do fine once settled, but the initial transition into new social rooms or loud social circles takes extra effort.",
    exercise: {
      name: "The Open Stance Check",
      time: "2 mins",
      description: "Keep hands out of pockets, maintain an open chest, and smile warmly when listening to group stories.",
    },
    keyTip: "Your non-verbal presence speaks before your voice ever does.",
  },
  resilience: {
    dimension: "resilience",
    title: "Secondary Focus: Detaching From Quick Outcomes",
    focusLabel: "Staying steady through delayed replies",
    whatItLooksLike:
      "You have good baseline confidence, but sudden silence or vague replies still create unnecessary mental noise in the back of your mind.",
    exercise: {
      name: "The Abundance Reality Check",
      time: "3 mins",
      description: "Remind yourself that one person's texting speed does not dictate your dating reality or personal value.",
    },
    keyTip: "People respond when they have space. Give them space and keep building your life.",
  },
  presentation: {
    dimension: "presentation",
    title: "Secondary Focus: Elevating Your Visual & Physical Polish",
    focusLabel: "Sharpening personal aesthetic",
    whatItLooksLike:
      "You dress comfortably, but haven't dialed in the specific grooming, fit, or posture cues that give you effortless magnetism.",
    exercise: {
      name: "Signature Style Upgrade",
      time: "10 mins",
      description: "Pick one signature item—a tailored shirt, classic timepiece, or subtle woody fragrance—that gives you an instant boost.",
    },
    keyTip: "When you feel sharp on the outside, your internal confidence follows naturally.",
  },
};
