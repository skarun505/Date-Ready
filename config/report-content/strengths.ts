import { Dimension } from "@/config/dimensions";

export interface StrengthBlock {
  dimension: Dimension;
  title: string;
  tagline: string;
  description: string;
  howToLeverage: string;
}

export const strengthsContent: Record<Dimension, StrengthBlock> = {
  approach: {
    dimension: "approach",
    title: "Proactive Initiation",
    tagline: "You take bold first steps where others stay frozen",
    description: "You have an innate willingness to break the ice and start interactions. While most people spend years waiting to be noticed, you take action.",
    howToLeverage: "Use your initiating courage to set an easy, welcoming tone right from the opening sentence.",
  },
  conversation: {
    dimension: "conversation",
    title: "Natural Conversationalist",
    tagline: "Engaging, attentive, and easy to talk to",
    description: "You listen well and express yourself with clarity. People feel heard and comfortable around you, creating immediate warmth.",
    howToLeverage: "Lean into your curiosity—bring genuine interest to what they care about, and conversation becomes magnetic.",
  },
  social: {
    dimension: "social",
    title: "Social Ease & Presence",
    tagline: "At home in dynamic social environments",
    description: "You adapt naturally to group settings and social gatherings. Your presence is open, grounded, and non-threatening.",
    howToLeverage: "Be the person who introduces others and connects people; social status flows from generosity.",
  },
  resilience: {
    dimension: "resilience",
    title: "Grounded Emotional Poise",
    tagline: "Unshakable self-worth that isn't easily rattled",
    description: "You take delayed replies, awkward moments, and polite turn-downs in stride. You understand that compatibility isn't universal.",
    howToLeverage: "Your calm certainty is extraordinarily attractive. When you don't panic, you bring immense comfort to dates.",
  },
  presentation: {
    dimension: "presentation",
    title: "Polished Self-Assurance",
    tagline: "Confident in how you show up and carry yourself",
    description: "You understand fit, grooming, and personal aesthetic. You present yourself with self-respect and authenticity.",
    howToLeverage: "Let your visual confidence allow you to relax completely into your natural warmth and humor.",
  },
};
