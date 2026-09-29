import { Dimension } from "./dimensions";

export interface Option {
  id: string;
  text: string;
  score: 0 | 1 | 2 | 3;
}

export type QuestionType =
  | "situational"   // classic scenario
  | "number"        // number-input style (scale of 1-4)
  | "puzzle"        // lateral thinking / logic
  | "hot"           // spicy / bold / personal
  | "mindset";      // mentality / psychology-focused

export interface Question {
  id: string;
  dimension: Dimension;
  type: QuestionType;
  text: string;
  subtitle?: string;
  emoji?: string;
  options: Option[];
  /** IDs of follow-up questions unlocked if score is low (≤1) */
  lowScoreUnlocks?: string[];
  /** IDs of follow-up questions unlocked if score is high (≥2) */
  highScoreUnlocks?: string[];
}

export const QUIZ_VERSION = "v2";

// ─────────────────────────────────────────────────────────────────
//  CORE 12 QUESTIONS (Concise, fast to read & answer)
// ─────────────────────────────────────────────────────────────────
export const coreQuestions: Question[] = [
  // ── APPROACH ────────────────────────────────────────────────────
  {
    id: "q1",
    dimension: "approach",
    type: "situational",
    emoji: "☕",
    text: "You spot someone attractive at a café. What's your move?",
    subtitle: "Natural first instinct",
    options: [
      { id: "a", text: "Walk over and start a friendly chat", score: 3 },
      { id: "b", text: "Smile, make eye contact, and wait for a signal", score: 2 },
      { id: "c", text: "Overthink what to say, but stay seated", score: 1 },
      { id: "d", text: "Look away and scroll on my phone", score: 0 },
    ],
    lowScoreUnlocks: ["qx_approach_a", "qx_approach_b"],
    highScoreUnlocks: ["qx_approach_h"],
  },
  {
    id: "q2",
    dimension: "approach",
    type: "situational",
    emoji: "🤝",
    text: "A close friend offers to set you up on a blind date. You say:",
    options: [
      { id: "a", text: "'I'm in! Let's set it up.'", score: 3 },
      { id: "b", text: "'Tell me about them first.'", score: 2 },
      { id: "c", text: "'What if it's super awkward?'", score: 1 },
      { id: "d", text: "'No thanks, too much pressure.'", score: 0 },
    ],
    lowScoreUnlocks: ["qx_approach_b"],
  },
  {
    id: "q3",
    dimension: "approach",
    type: "situational",
    emoji: "📊",
    text: "How often do you strike up conversations with strangers?",
    subtitle: "Cafés, queues, social events",
    options: [
      { id: "a", text: "Often — I genuinely enjoy it", score: 3 },
      { id: "b", text: "Sometimes — if the vibe feels right", score: 2 },
      { id: "c", text: "Rarely — only if they speak first", score: 1 },
      { id: "d", text: "Almost never — I keep to myself", score: 0 },
    ],
  },

  // ── CONVERSATION ────────────────────────────────────────────────
  {
    id: "q4",
    dimension: "conversation",
    type: "situational",
    emoji: "🗣️",
    text: "There's an awkward 5-second silence on a date. You:",
    options: [
      { id: "a", text: "Relax and let it breathe naturally", score: 3 },
      { id: "b", text: "Ask a playful follow-up question", score: 2 },
      { id: "c", text: "Panic and blurt out anything", score: 1 },
      { id: "d", text: "Check my phone to avoid eye contact", score: 0 },
    ],
    lowScoreUnlocks: ["qx_conv_a"],
  },
  {
    id: "q5",
    dimension: "conversation",
    type: "situational",
    emoji: "💬",
    text: "Your date asks: 'What do you do for fun outside work?' You:",
    options: [
      { id: "a", text: "Light up and share my real passions", score: 3 },
      { id: "b", text: "Give a quick summary, then ask them", score: 2 },
      { id: "c", text: "Downplay my interests or blank out", score: 1 },
      { id: "d", text: "Give a flat, 1-word answer", score: 0 },
    ],
    lowScoreUnlocks: ["qx_conv_b"],
    highScoreUnlocks: ["qx_hot_b"],
  },

  // ── SOCIAL ──────────────────────────────────────────────────────
  {
    id: "q6",
    dimension: "social",
    type: "situational",
    emoji: "🎉",
    text: "You arrive at a party where you only know the host. You:",
    options: [
      { id: "a", text: "Introduce myself to new groups easily", score: 3 },
      { id: "b", text: "Join a small, approachable cluster", score: 2 },
      { id: "c", text: "Hover near the host all evening", score: 1 },
      { id: "d", text: "Hide in a corner and leave early", score: 0 },
    ],
    lowScoreUnlocks: ["qx_social_a"],
  },
  {
    id: "q7",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "Entering an unfamiliar social event, your inner voice says:",
    subtitle: "Be 100% honest",
    options: [
      { id: "a", text: "'This could be fun — let's see who's here!'", score: 3 },
      { id: "b", text: "'I'll be fine once I warm up.'", score: 2 },
      { id: "c", text: "'Don't say anything weird or awkward.'", score: 1 },
      { id: "d", text: "'I really wish I was back home.'", score: 0 },
    ],
    lowScoreUnlocks: ["qx_mindset_a"],
  },

  // ── RESILIENCE ──────────────────────────────────────────────────
  {
    id: "q8",
    dimension: "resilience",
    type: "situational",
    emoji: "📱",
    text: "A great date takes 8+ hours to reply to your text. You:",
    options: [
      { id: "a", text: "Don't mind at all — people get busy", score: 3 },
      { id: "b", text: "Notice it, but focus on my own day", score: 2 },
      { id: "c", text: "Overthink and re-read our messages", score: 1 },
      { id: "d", text: "Assume they've lost interest completely", score: 0 },
    ],
    lowScoreUnlocks: ["qx_resilience_a"],
  },
  {
    id: "q9",
    dimension: "resilience",
    type: "situational",
    emoji: "😅",
    text: "You say something awkward on a date. How do you recover?",
    subtitle: "Handling clumsy moments",
    options: [
      { id: "a", text: "Laugh it off and keep moving", score: 3 },
      { id: "b", text: "Cringe briefly, pivot, and move on", score: 2 },
      { id: "c", text: "Replay it in my head for 10 minutes", score: 1 },
      { id: "d", text: "Freeze up and mentally check out", score: 0 },
    ],
    lowScoreUnlocks: ["qx_resilience_b", "qx_hot_a"],
  },
  {
    id: "q10",
    dimension: "resilience",
    type: "situational",
    emoji: "💪",
    text: "You ask someone out and they politely decline. You:",
    options: [
      { id: "a", text: "Smile, say 'no worries!', and move on", score: 3 },
      { id: "b", text: "Feel a brief sting, then shake it off", score: 2 },
      { id: "c", text: "Obsess over what I did wrong", score: 1 },
      { id: "d", text: "Decide dating isn't worth the risk", score: 0 },
    ],
  },

  // ── PRESENTATION ─────────────────────────────────────────────────
  {
    id: "q11",
    dimension: "presentation",
    type: "situational",
    emoji: "🪞",
    text: "Before stepping out for a date, how confident do you feel in your look?",
    options: [
      { id: "a", text: "Very confident — my style feels authentic", score: 3 },
      { id: "b", text: "Pretty good after checking the mirror", score: 2 },
      { id: "c", text: "Unsure — I worry I look too plain", score: 1 },
      { id: "d", text: "Insecure and uncomfortable in my clothes", score: 0 },
    ],
    lowScoreUnlocks: ["qx_pres_a"],
  },
  {
    id: "q12",
    dimension: "presentation",
    type: "mindset",
    emoji: "📸",
    text: "How would you describe your presence in social settings?",
    options: [
      { id: "a", text: "Warm, magnetic, and engaging", score: 3 },
      { id: "b", text: "Solid once I get comfortable", score: 2 },
      { id: "c", text: "Quiet, often fading into the background", score: 1 },
      { id: "d", text: "Invisible and self-conscious", score: 0 },
    ],
    lowScoreUnlocks: ["qx_mindset_b"],
  },
];

// ─────────────────────────────────────────────────────────────────
//  ADAPTIVE / UNLOCKABLE QUESTIONS (Concise & punchy)
// ─────────────────────────────────────────────────────────────────
export const adaptiveQuestions: Question[] = [
  // ── APPROACH UNLOCKABLE ─────────────────────────────────────────
  {
    id: "qx_approach_a",
    dimension: "approach",
    type: "mindset",
    emoji: "💡",
    text: "When hesitation hits right before you approach, you:",
    subtitle: "Real-world reaction",
    options: [
      { id: "a", text: "Remind myself there's zero pressure", score: 3 },
      { id: "b", text: "Take a breath and do it anyway", score: 2 },
      { id: "c", text: "Overthink until the moment is gone", score: 1 },
      { id: "d", text: "Freeze up and back out completely", score: 0 },
    ],
  },
  {
    id: "qx_approach_b",
    dimension: "approach",
    type: "hot",
    emoji: "🔥",
    text: "When you imagine flirting with someone you like, you feel:",
    subtitle: "Gut check",
    options: [
      { id: "a", text: "Excited — playful tension is fun", score: 3 },
      { id: "b", text: "Curious, but a bit cautious", score: 2 },
      { id: "c", text: "Awkward — I don't know how to flirt", score: 1 },
      { id: "d", text: "Terrified of making them cringe", score: 0 },
    ],
  },
  {
    id: "qx_approach_h",
    dimension: "approach",
    type: "hot",
    emoji: "🌶️",
    text: "When you make a move, how often does it land well?",
    subtitle: "Meaningful connection or date",
    options: [
      { id: "a", text: "Most of the time — great results", score: 3 },
      { id: "b", text: "About 50/50 — depends on the vibe", score: 2 },
      { id: "c", text: "I start well, but fumble follow-up", score: 1 },
      { id: "d", text: "Rarely leads to a real connection", score: 0 },
    ],
  },

  // ── CONVERSATION UNLOCKABLE ──────────────────────────────────────
  {
    id: "qx_conv_a",
    dimension: "conversation",
    type: "situational",
    emoji: "⚖️",
    text: "How balanced is your conversation on a date?",
    options: [
      { id: "a", text: "Effortless 50/50 give and take", score: 3 },
      { id: "b", text: "I listen a lot more than I share", score: 2 },
      { id: "c", text: "I talk too fast or run out of things", score: 1 },
      { id: "d", text: "Stiff — feels like a job interview", score: 0 },
    ],
  },
  {
    id: "qx_conv_b",
    dimension: "conversation",
    type: "number",
    emoji: "📊",
    text: "How many engaging questions do you ask on a first date?",
    subtitle: "Beyond simple yes/no questions",
    options: [
      { id: "a", text: "Plenty — I'm genuinely curious", score: 3 },
      { id: "b", text: "A few, but sometimes run dry", score: 2 },
      { id: "c", text: "Only 1 or 2 — I let them drive", score: 1 },
      { id: "d", text: "Almost none — I just answer theirs", score: 0 },
    ],
  },

  // ── SOCIAL UNLOCKABLE ───────────────────────────────────────────
  {
    id: "qx_social_a",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "When you feel left out in a group, what's usually the reason?",
    options: [
      { id: "a", text: "Waiting for a good opening to speak", score: 3 },
      { id: "b", text: "Unsure how to join without interrupting", score: 2 },
      { id: "c", text: "Feel like others are more charismatic", score: 1 },
      { id: "d", text: "Assume people don't care to talk to me", score: 0 },
    ],
  },

  // ── RESILIENCE UNLOCKABLE ───────────────────────────────────────
  {
    id: "qx_resilience_a",
    dimension: "resilience",
    type: "mindset",
    emoji: "🛡️",
    text: "Someone you're excited about suddenly goes cold. You feel:",
    subtitle: "Outcome independence check",
    options: [
      { id: "a", text: "Completely unbothered — my worth is solid", score: 3 },
      { id: "b", text: "Mild disappointment, then move on", score: 2 },
      { id: "c", text: "Anxious — wondering what went wrong", score: 1 },
      { id: "d", text: "Deeply insecure and discouraged", score: 0 },
    ],
  },
  {
    id: "qx_resilience_b",
    dimension: "resilience",
    type: "hot",
    emoji: "🔥",
    text: "If asked why you're currently single, your honest answer is:",
    options: [
      { id: "a", text: "'Focusing on myself and my goals'", score: 3 },
      { id: "b", text: "'Haven't found the right match yet'", score: 2 },
      { id: "c", text: "'Putting myself out there, but no luck'", score: 1 },
      { id: "d", text: "'Afraid of getting hurt again'", score: 0 },
    ],
  },

  // ── MINDSET UNLOCKABLE ──────────────────────────────────────────
  {
    id: "qx_mindset_a",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "What's the biggest gap to your ideal social self?",
    options: [
      { id: "a", text: "Execution — I know what to do, just hesitate", score: 3 },
      { id: "b", text: "Consistency — some days great, others off", score: 2 },
      { id: "c", text: "Knowledge — not sure how to act naturally", score: 1 },
      { id: "d", text: "Belief — doubt people find me attractive", score: 0 },
    ],
  },
  {
    id: "qx_mindset_b",
    dimension: "presentation",
    type: "mindset",
    emoji: "💡",
    text: "What creates true personal magnetism and presence?",
    options: [
      { id: "a", text: "Inner security and self-acceptance", score: 3 },
      { id: "b", text: "Social practice and confident posture", score: 2 },
      { id: "c", text: "Natural looks and genetics", score: 1 },
      { id: "d", text: "You're either born with it or not", score: 0 },
    ],
  },

  // ── HOT QUESTIONS ────────────────────────────────────────────────
  {
    id: "qx_hot_a",
    dimension: "resilience",
    type: "hot",
    emoji: "🌶️",
    text: "Ever kept feelings secret to avoid risking rejection?",
    subtitle: "Risk tolerance check",
    options: [
      { id: "a", text: "No — I'd rather know than wonder", score: 3 },
      { id: "b", text: "Once — and I still regret staying silent", score: 2 },
      { id: "c", text: "Yes — safer to keep things as they are", score: 1 },
      { id: "d", text: "Always — rejection feels too terrifying", score: 0 },
    ],
  },
  {
    id: "qx_hot_b",
    dimension: "conversation",
    type: "hot",
    emoji: "🔥",
    text: "On a date, they ask: 'Tell me a secret about you.' You:",
    options: [
      { id: "a", text: "Share something vulnerable and authentic", score: 3 },
      { id: "b", text: "Share something fun, but keep it light", score: 2 },
      { id: "c", text: "Deflect with a joke", score: 1 },
      { id: "d", text: "Give a safe, generic answer", score: 0 },
    ],
  },

  // ── PRESENTATION UNLOCKABLE ─────────────────────────────────────
  {
    id: "qx_pres_a",
    dimension: "presentation",
    type: "situational",
    emoji: "✨",
    text: "How consistent is your grooming, fitness, and style routine?",
    subtitle: "First impression baseline",
    options: [
      { id: "a", text: "Daily and sharp — I take real pride in it", score: 3 },
      { id: "b", text: "Decent, with a few areas to upgrade", score: 2 },
      { id: "c", text: "Inconsistent — only for special events", score: 1 },
      { id: "d", text: "Minimal — rarely think about it", score: 0 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  QUESTION BANK (Union & lookup map)
// ─────────────────────────────────────────────────────────────────
export const questions: Question[] = [...coreQuestions, ...adaptiveQuestions];

export const allQuestionsMap: Record<string, Question> = Object.fromEntries(
  questions.map((q) => [q.id, q])
);
