export interface ProfileMeta {
  name: string;
  badge: string;
  tagline: string;
  tone: string;
  summary: string;
  badgeColor: string;
  description: string;
}

export const PROFILES: Record<string, ProfileMeta> = {
  "The Social Natural": {
    name: "The Social Natural",
    badge: "Top 5% Readiness",
    tagline: "Effortless, grounded, and socially magnetic",
    tone: "Challenge-oriented",
    summary: "You navigate social spaces with rare comfort and ease, turning initial encounters into genuine rapport.",
    badgeColor: "from-emerald-500 to-teal-400",
    description: "You initiate conversations with relaxed confidence and roll with social friction naturally. Your next step isn't basic comfort—it's creating deeper, more memorable emotional connections.",
  },
  "The Confident": {
    name: "The Confident",
    badge: "High Readiness",
    tagline: "Self-assured with clear dating momentum",
    tone: "Respectful & sharpening",
    summary: "You have a solid foundation and know who you are, with just a few subtle blindspots holding you back.",
    badgeColor: "from-indigo-500 to-purple-400",
    description: "You're comfortable stepping out of your comfort zone and handle social situations well. A few targeted adjustments in your primary growth area will elevate your dating experiences significantly.",
  },
  "The Developing": {
    name: "The Developing",
    badge: "Strong Potential",
    tagline: "You're much closer than you think",
    tone: "Encouraging & practical",
    summary: "You have natural strengths, but hesitation or overthinking sometimes dims your true personality.",
    badgeColor: "from-pink-500 to-rose-400",
    description: "When you feel comfortable, your warmth and humor shine through. The challenge is bridging that gap with people you find attractive before self-doubt creeps in. With a clear 7-day action plan, progress happens fast.",
  },
  "The Overthinker": {
    name: "The Overthinker",
    badge: "High Perception",
    tagline: "You notice more than most—now let's get you out of your head",
    tone: "Validating & grounding",
    summary: "Your brain runs ten steps ahead, analyzing every micro-expression and possible outcome.",
    badgeColor: "from-amber-500 to-orange-400",
    description: "You possess high emotional awareness and empathy. The catch is that your inner commentator often talks you out of taking action in the moment. Learning to lower the stakes will unlock your dating ease.",
  },
  "The Hesitant": {
    name: "The Hesitant",
    badge: "Fresh Start",
    tagline: "Everyone starts somewhere—confidence is a buildable skill",
    tone: "Gentle & supportive",
    summary: "Dating currently feels like high-stakes territory, but readiness is built through small, safe repetitions.",
    badgeColor: "from-sky-500 to-blue-400",
    description: "No one is born automatically knowing how to flirt or charm strangers. Confidence isn't a fixed personality trait—it's a set of small behavioral muscles. Starting with low-pressure 5-minute drills will change how you feel completely.",
  },
};

export function getProfile(total: number): string {
  if (total >= 85) return "The Social Natural";
  if (total >= 70) return "The Confident";
  if (total >= 60) return "The Developing";
  if (total >= 40) return "The Overthinker";
  return "The Hesitant";
}
