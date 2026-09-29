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
//  CORE 12 QUESTIONS  (always shown, in this order)
// ─────────────────────────────────────────────────────────────────
export const coreQuestions: Question[] = [
  // ── APPROACH ────────────────────────────────────────────────────
  {
    id: "q1",
    dimension: "approach",
    type: "situational",
    emoji: "☕",
    text: "You see someone you're interested in at a café. What do you do?",
    subtitle: "Be honest about your natural first instinct.",
    options: [
      { id: "a", text: "Walk over and start a warm, casual conversation", score: 3 },
      { id: "b", text: "Make brief eye contact or smile and wait for an opening", score: 2 },
      { id: "c", text: "Mentally rehearse lines for ten minutes but stay put", score: 1 },
      { id: "d", text: "Look away and scroll your phone until the moment passes", score: 0 },
    ],
    lowScoreUnlocks: ["qx_approach_a", "qx_approach_b"],
    highScoreUnlocks: ["qx_approach_h"],
  },
  {
    id: "q2",
    dimension: "approach",
    type: "situational",
    emoji: "🤝",
    text: "A close friend offers to set you up with someone they think you'd click with. Your reaction?",
    options: [
      { id: "a", text: "Excited — 'Set it up, let's grab coffee this weekend!'", score: 3 },
      { id: "b", text: "Open to it, but I ask for details first to mentally prepare", score: 2 },
      { id: "c", text: "Hesitant — what if it's awkward if we don't hit it off?", score: 1 },
      { id: "d", text: "Politely deflect or make an excuse to avoid the pressure", score: 0 },
    ],
    lowScoreUnlocks: ["qx_approach_b"],
  },
  {
    id: "q3",
    dimension: "approach",
    type: "situational",
    emoji: "📊",
    text: "How often do you start conversations with new people in everyday life?",
    subtitle: "Think about the last 30 days — shops, queues, events, anywhere.",
    options: [
      { id: "a", text: "Regularly — I genuinely enjoy talking to new people", score: 3 },
      { id: "b", text: "Sometimes — when the setting feels natural and the vibe is right", score: 2 },
      { id: "c", text: "Rarely — usually only if someone speaks to me first", score: 1 },
      { id: "d", text: "Almost never — I prefer to keep to myself", score: 0 },
    ],
  },

  // ── CONVERSATION ────────────────────────────────────────────────
  {
    id: "q4",
    dimension: "conversation",
    type: "situational",
    emoji: "🗣️",
    text: "There's a 5-second silence in your one-on-one conversation. What do you do?",
    options: [
      { id: "a", text: "Stay relaxed — let it breathe and pick up naturally", score: 3 },
      { id: "b", text: "Gently build on something they said earlier", score: 2 },
      { id: "c", text: "Feel anxious and blurt out any random topic", score: 1 },
      { id: "d", text: "Assume things are going badly and check your phone", score: 0 },
    ],
    lowScoreUnlocks: ["qx_conv_a"],
  },
  {
    id: "q5",
    dimension: "conversation",
    type: "situational",
    emoji: "💬",
    text: "Someone asks: 'So, tell me about yourself outside of work.' You...",
    options: [
      { id: "a", text: "Light up and share a couple of passions or fun stories with ease", score: 3 },
      { id: "b", text: "Give a decent overview, then quickly bounce the question back", score: 2 },
      { id: "c", text: "Downplay interests or blank out on what makes you interesting", score: 1 },
      { id: "d", text: "Give a flat 1-sentence reply and wait for them to fill the gap", score: 0 },
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
    text: "You're at a rooftop party where you only know the host. What do you do?",
    options: [
      { id: "a", text: "Say hi to the host, grab a drink, naturally introduce yourself around", score: 3 },
      { id: "b", text: "Find someone approachable-looking and ease into their group", score: 2 },
      { id: "c", text: "Stick near the host until someone approaches you first", score: 1 },
      { id: "d", text: "Find a quiet corner, nurse your drink, and plan an early exit", score: 0 },
    ],
    lowScoreUnlocks: ["qx_social_a"],
  },
  {
    id: "q7",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "Which statement best describes your internal voice when walking into an unfamiliar social setting?",
    subtitle: "Pick the one that's most honest, not most flattering.",
    options: [
      { id: "a", text: "'This could be fun — new people, new energy!'", score: 3 },
      { id: "b", text: "'I'll be okay once I warm up for a bit'", score: 2 },
      { id: "c", text: "'I hope I don't say something weird or embarrassing'", score: 1 },
      { id: "d", text: "'I wish I could skip this altogether'", score: 0 },
    ],
    lowScoreUnlocks: ["qx_mindset_a"],
  },

  // ── RESILIENCE ──────────────────────────────────────────────────
  {
    id: "q8",
    dimension: "resilience",
    type: "situational",
    emoji: "📱",
    text: "Someone you had a great first date with takes 8 hours to reply to your text. Your usual reaction?",
    options: [
      { id: "a", text: "Carry on completely unaffected — people get busy", score: 3 },
      { id: "b", text: "Notice the delay, but keep busy without obsessing over it", score: 2 },
      { id: "c", text: "Re-read the last messages analyzing if you came off too eager", score: 1 },
      { id: "d", text: "Assume they've lost interest and feel deflated", score: 0 },
    ],
    lowScoreUnlocks: ["qx_resilience_a"],
  },
  {
    id: "q9",
    dimension: "resilience",
    type: "situational",
    emoji: "😅",
    text: "You accidentally say something awkward or clumsy on a date. How do you recover?",
    subtitle: "How you handle clumsy moments reveals your core resilience.",
    options: [
      { id: "a", text: "Laugh it off openly with a smile and smoothly keep the conversation flowing", score: 3 },
      { id: "b", text: "Feel a brief flush of embarrassment, quickly pivot, and move past it", score: 2 },
      { id: "c", text: "Replay the blunder in my head for the next ten minutes, distracted", score: 1 },
      { id: "d", text: "Cringe and mentally shut down, struggling to recover for the rest of the date", score: 0 },
    ],
    lowScoreUnlocks: ["qx_resilience_b", "qx_hot_a"],
  },
  {
    id: "q10",
    dimension: "resilience",
    type: "situational",
    emoji: "💪",
    text: "You ask someone out for coffee and they politely say no. You...",
    options: [
      { id: "a", text: "Smile, say 'totally understand, have a great week!' — and move on", score: 3 },
      { id: "b", text: "Feel a sting for a few minutes, but shake it off quickly", score: 2 },
      { id: "c", text: "Wonder what you did wrong, replaying the conversation in detail", score: 1 },
      { id: "d", text: "Take it as proof that putting yourself out there isn't worth the risk", score: 0 },
    ],
  },

  // ── PRESENTATION ─────────────────────────────────────────────────
  {
    id: "q11",
    dimension: "presentation",
    type: "situational",
    emoji: "🪞",
    text: "Before a date or social evening, how do you feel about your appearance?",
    options: [
      { id: "a", text: "Solid and authentic — clothes fit well, feel fresh and comfortable", score: 3 },
      { id: "b", text: "Pretty good after trying a couple of outfits and checking grooming", score: 2 },
      { id: "c", text: "Uncertain — I worry my style doesn't stand out enough", score: 1 },
      { id: "d", text: "Self-conscious and uncomfortable, wishing I looked different", score: 0 },
    ],
    lowScoreUnlocks: ["qx_pres_a"],
  },
  {
    id: "q12",
    dimension: "presentation",
    type: "mindset",
    emoji: "📸",
    text: "Which mindset most accurately describes your relationship with your own energy in social situations?",
    options: [
      { id: "a", text: "I know my presence is an asset and I lead with warmth", score: 3 },
      { id: "b", text: "I can hold my own once I'm comfortable in the environment", score: 2 },
      { id: "c", text: "I often feel like I fade into the background without meaning to", score: 1 },
      { id: "d", text: "I feel invisible or unnoticed and it affects my confidence", score: 0 },
    ],
    lowScoreUnlocks: ["qx_mindset_b"],
  },
];

// ─────────────────────────────────────────────────────────────────
//  ADAPTIVE / UNLOCKABLE QUESTIONS
//  (shown based on low/high scores in core questions)
// ─────────────────────────────────────────────────────────────────
export const adaptiveQuestions: Question[] = [
  // ── APPROACH UNLOCKABLE ─────────────────────────────────────────
  {
    id: "qx_approach_a",
    dimension: "approach",
    type: "mindset",
    emoji: "💡",
    text: "When fear of rejection makes you hesitate to approach someone, what is your mindset?",
    subtitle: "Be honest about how you handle the hesitation in real life.",
    options: [
      { id: "a", text: "I remind myself there's no pressure — I just want to share a friendly moment", score: 3 },
      { id: "b", text: "I push myself past the initial fear and take the leap anyway", score: 2 },
      { id: "c", text: "I try to talk myself into it, but usually overthink until the moment passes", score: 1 },
      { id: "d", text: "I freeze up — the fear of looking awkward or being rejected stops me cold", score: 0 },
    ],
  },
  {
    id: "qx_approach_b",
    dimension: "approach",
    type: "hot",
    emoji: "🔥",
    text: "Honest question: When you imagine flirting with someone you like, what's your gut reaction?",
    subtitle: "No judgment here — this reveals a lot.",
    options: [
      { id: "a", text: "Excited — I enjoy the playfulness and tension of it", score: 3 },
      { id: "b", text: "Curious but cautious — I don't want it to come off weird", score: 2 },
      { id: "c", text: "Uncomfortable — I'm not sure I even know how to flirt naturally", score: 1 },
      { id: "d", text: "Terrified — what if they take it the wrong way or cringe?", score: 0 },
    ],
  },
  {
    id: "qx_approach_h",
    dimension: "approach",
    type: "hot",
    emoji: "🌶️",
    text: "Since you approach easily — what's your honest success rate when you do?",
    subtitle: "Success = getting a number, a date, or a genuinely positive response.",
    options: [
      { id: "a", text: "High — most approaches lead somewhere meaningful", score: 3 },
      { id: "b", text: "Decent — maybe 50/50, depends on the vibe I read", score: 2 },
      { id: "c", text: "Mixed — I approach but often fumble the follow-through", score: 1 },
      { id: "d", text: "Low — I approach often but rarely convert to anything real", score: 0 },
    ],
  },

  // ── CONVERSATION UNLOCKABLE ──────────────────────────────────────
  {
    id: "qx_conv_a",
    dimension: "conversation",
    type: "situational",
    emoji: "⚖️",
    text: "During a date, how balanced does your conversational flow usually feel?",
    subtitle: "Think about whether you naturally trade stories or get caught listening/talking too much.",
    options: [
      { id: "a", text: "Naturally balanced — I share engaging stories and ask great follow-up questions", score: 3 },
      { id: "b", text: "I'm a good listener, but I sometimes hesitate to share much about myself", score: 2 },
      { id: "c", text: "I get nervous and either talk too much or blurt out random topics", score: 1 },
      { id: "d", text: "Strained — it often feels like an awkward interview with forced questions", score: 0 },
    ],
  },
  {
    id: "qx_conv_b",
    dimension: "conversation",
    type: "number",
    emoji: "📊",
    text: "Approximately how many open-ended questions do you typically ask on a first date?",
    subtitle: "Open-ended = questions that can't be answered with yes/no.",
    options: [
      { id: "a", text: "6+ — I'm genuinely curious and love getting people to open up", score: 3 },
      { id: "b", text: "3–5 — I ask questions but sometimes run dry", score: 2 },
      { id: "c", text: "1–2 — I tend to wait for them to steer the conversation", score: 1 },
      { id: "d", text: "0 — I answer questions but rarely generate my own", score: 0 },
    ],
  },

  // ── SOCIAL UNLOCKABLE ───────────────────────────────────────────
  {
    id: "qx_social_a",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "When you feel 'left out' in a group setting, what is the most honest reason why?",
    options: [
      { id: "a", text: "I just haven't found the right conversational entry point yet", score: 3 },
      { id: "b", text: "I'm not sure how to insert myself without seeming desperate", score: 2 },
      { id: "c", text: "I feel like others are more interesting or socially fluid than me", score: 1 },
      { id: "d", text: "I assume people don't really want to talk to me anyway", score: 0 },
    ],
  },

  // ── RESILIENCE UNLOCKABLE ───────────────────────────────────────
  {
    id: "qx_resilience_a",
    dimension: "resilience",
    type: "mindset",
    emoji: "🛡️",
    text: "When someone you're excited about suddenly acts distant or leaves you on read, what happens to your confidence?",
    subtitle: "Honest answer — this measures your outcome independence.",
    options: [
      { id: "a", text: "Completely unshaken — my self-worth doesn't depend on anyone's text reply", score: 3 },
      { id: "b", text: "I feel a brief dip, but I quickly shake it off and focus on my own day", score: 2 },
      { id: "c", text: "It stings — I spend hours re-reading messages and wondering what went wrong", score: 1 },
      { id: "d", text: "It knocks my confidence hard and makes me question my overall dating appeal", score: 0 },
    ],
  },
  {
    id: "qx_resilience_b",
    dimension: "resilience",
    type: "hot",
    emoji: "🔥",
    text: "Hot take: You've been single for a while and someone asks why. What's your honest answer?",
    subtitle: "The one you'd say if you had to be 100% truthful.",
    options: [
      { id: "a", text: "I've been focused on myself — working on who I am first", score: 3 },
      { id: "b", text: "I haven't met someone I feel strongly enough about yet", score: 2 },
      { id: "c", text: "I put myself out there but haven't had much luck recently", score: 1 },
      { id: "d", text: "I'm scared of getting hurt again, so I've been avoiding it", score: 0 },
    ],
  },

  // ── MINDSET UNLOCKABLE ──────────────────────────────────────────
  {
    id: "qx_mindset_a",
    dimension: "social",
    type: "mindset",
    emoji: "🧠",
    text: "Deep one: When you imagine the 'ideal' version of yourself in social settings, what's the main gap from where you are now?",
    options: [
      { id: "a", text: "Mostly execution — I know what to do but overthink in the moment", score: 3 },
      { id: "b", text: "Consistency — I'm good sometimes but can't rely on it", score: 2 },
      { id: "c", text: "Knowledge — I genuinely don't know how to behave in those moments", score: 1 },
      { id: "d", text: "Belief — I don't think I'm the type of person people are drawn to", score: 0 },
    ],
  },
  {
    id: "qx_mindset_b",
    dimension: "presentation",
    type: "mindset",
    emoji: "💡",
    text: "Which statement do you believe is most true about 'presence' and attraction?",
    options: [
      { id: "a", text: "Presence is built from inner security and doesn't need validation", score: 3 },
      { id: "b", text: "Presence can be faked until it becomes real with enough practice", score: 2 },
      { id: "c", text: "Presence is mostly about looks and genetics — not fully controllable", score: 1 },
      { id: "d", text: "Some people just have it naturally and others simply don't", score: 0 },
    ],
  },

  // ── HOT QUESTIONS ────────────────────────────────────────────────
  {
    id: "qx_hot_a",
    dimension: "resilience",
    type: "hot",
    emoji: "🌶️",
    text: "Spicy honesty: Have you ever NOT told someone you liked them because you were afraid of ruining the friendship?",
    subtitle: "This one reveals a LOT about your risk tolerance.",
    options: [
      { id: "a", text: "No — I'd rather know the answer than always wonder", score: 3 },
      { id: "b", text: "Once or twice — and I honestly regret not saying something", score: 2 },
      { id: "c", text: "Yes — it felt safer to preserve the status quo", score: 1 },
      { id: "d", text: "Yes, multiple times — rejection feels like it would break everything", score: 0 },
    ],
  },
  {
    id: "qx_hot_b",
    dimension: "conversation",
    type: "hot",
    emoji: "🔥",
    text: "Hot scenario: You're on a date and it's going well. They ask — 'What's something most people don't know about you?' You...",
    options: [
      { id: "a", text: "Share something genuinely surprising and a little vulnerable — it deepens the connection", score: 3 },
      { id: "b", text: "Share something interesting but keep it light — not ready to go deep yet", score: 2 },
      { id: "c", text: "Deflect with humor to avoid feeling exposed", score: 1 },
      { id: "d", text: "Give a generic answer — you don't want them to judge you", score: 0 },
    ],
  },

  // ── PRESENTATION UNLOCKABLE ─────────────────────────────────────
  {
    id: "qx_pres_a",
    dimension: "presentation",
    type: "situational",
    emoji: "✨",
    text: "How would you describe your daily self-care routine (grooming, fitness, style)?",
    subtitle: "Be honest — this directly shapes your first impression.",
    options: [
      { id: "a", text: "Consistent and intentional — I take pride in looking and feeling my best daily", score: 3 },
      { id: "b", text: "Decent routine, though there are a few areas I know I could elevate", score: 2 },
      { id: "c", text: "Inconsistent — I only put in real effort when there's a special occasion", score: 1 },
      { id: "d", text: "Minimal effort — it hasn't been a priority in my day-to-day life", score: 0 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  QUESTION BANK  (union)
// ─────────────────────────────────────────────────────────────────
export const questions: Question[] = [...coreQuestions, ...adaptiveQuestions];

export const allQuestionsMap: Record<string, Question> = Object.fromEntries(
  questions.map((q) => [q.id, q])
);
