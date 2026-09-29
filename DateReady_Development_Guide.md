# DateReady — Complete Development Guide

**Brand:** DateReady | **Parent:** Subix | **URL:** `dateready.subix.in`
**Goal of this document:** one file you can keep open in Cursor and build the whole MVP from, in order.

> **Principle:** Build the ₹99 conversion funnel first. Traffic → Quiz → Result → Payment → Report. Everything else waits until that loop is proven.

---

## Table of Contents

1. Product Summary
2. Funnel and Pages
3. System Architecture
4. Tech Stack and Environment Variables
5. Repository Structure
6. Database (Supabase)
7. Assessment: Questions, Scoring, Profiles
8. Report System (20 pattern-based reports, HTML to PDF)
9. Payments (Dodo) and Unlock Logic
10. Analytics and Tracking
11. Mobile-First UI Specification
12. Email Flows
13. Legal, Refund and Trust
14. Security and Privacy Checklist
15. Cursor Prompts (phase by phase)
16. QA Checklist
17. Launch Plan and Metrics
18. Post-MVP Roadmap

---

## 1. Product Summary

**What it is:** a free 60-second dating-confidence assessment that produces a score, a profile and a personalized ₹99 report.
**What it is not:** a dating app, a pickup-artist product, or a psychological diagnosis. Never use clinical language.

| Layer | Product | Price |
|---|---|---|
| Acquisition | Free quiz + score + one free insight | ₹0 |
| Product 1 | DateReady Personal Report (web + PDF) | ₹99 |
| Product 2 | Confidence Kit (exercises, 14-day plan) | ₹299 |
| Product 3 | 30-Day Challenge | ₹499 |
| Later | AI Coach | ₹199/mo or ₹999/yr |

**Positioning line:** "Find out how ready you are for dating."
**Audience (launch):** men 18-34 in India, mobile-first. Architecture must support other audiences later (config-driven quiz).

---

## 2. Funnel and Pages

```text
Meta ad → / (landing) → /test (12 Qs) → email capture → /result
       → paywall → Dodo checkout → webhook → /report (unlocked)
       → upsell ₹299 → upsell ₹499
```

| Route | Purpose |
|---|---|
| `/` | Landing page, one CTA |
| `/test` | Quiz, one question per screen |
| `/result` | Score, profile, free insight, locked preview, paywall |
| `/checkout` | Creates Dodo session, redirects |
| `/checkout/success` | "Confirming payment..." polling page (never unlocks by itself) |
| `/report` | Mobile web report (primary) with PDF download button |
| `/challenge` | 30-day product (later) |
| `/privacy`, `/terms`, `/refund`, `/contact` | Trust pages |
| `/api/*` | Backend routes |

---

## 3. System Architecture

```text
┌────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  Browser   │────▶│  Next.js (Vercel)    │────▶│  Supabase    │
│ (mobile)   │◀────│  App Router + API    │◀────│  Postgres    │
└────────────┘     │                      │     │  Storage     │
                   │  scoring engine      │     └──────────────┘
                   │  report selector     │
                   │  HTML→PDF renderer   │────▶ Supabase Storage (PDFs)
                   └───┬─────────┬────────┘
                       │         │
            ┌──────────▼──┐  ┌───▼──────────┐
            │ Dodo        │  │ Zoho         │
            │ Payments    │  │ Campaigns    │
            └──────┬──────┘  └──────────────┘
                   │ webhook
                   ▼
        /api/webhooks/dodo → verify signature → mark paid → unlock report

Client tracking: Mixpanel, Clarity, GA4, Meta Pixel (+ CAPI from server)
Monitoring: Sentry
```

### Key decisions

1. **Scoring runs on the server.** The client sends answers; the server computes and stores scores. Never trust a score sent from the browser.
2. **Report unlock is decided only by the payment webhook.** The success page merely polls.
3. **Reports are template-based, not AI-generated per customer.** Content is authored once. Cost per report is near zero.
4. **Web report first, PDF second.** A mobile web report reads far better on a phone than a PDF. PDF is a download for people who want to keep it.
5. **Quiz is config-driven.** Questions, dimensions, profiles and report content live in config files so a second product (InterviewReady, etc.) can reuse the engine.

---

## 4. Tech Stack and Environment Variables

| Area | Tool |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind |
| Backend | Next.js route handlers |
| DB / Storage | Supabase (Postgres + Storage) |
| Payments | Dodo Payments (confirm India payment methods and commercial terms before committing) |
| Product analytics | Mixpanel |
| Behavior | Microsoft Clarity |
| Web analytics | GA4 |
| Ads | Meta Pixel now, Conversions API in week 2 |
| Email | Zoho Campaigns (transactional via Zoho ZeptoMail or Resend) |
| Errors | Sentry |
| PDF | Playwright or Puppeteer with `@sparticuz/chromium` on serverless |
| AI (later) | OpenAI API or Claude API |

### `.env.local`

```bash
NEXT_PUBLIC_SITE_URL=https://dateready.subix.in

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only, never expose

DODO_PAYMENTS_API_KEY=
DODO_WEBHOOK_SECRET=
DODO_PRODUCT_ID_REPORT_99=
DODO_PRODUCT_ID_KIT_299=
DODO_PRODUCT_ID_CHALLENGE_499=

NEXT_PUBLIC_MIXPANEL_TOKEN=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=

ZOHO_CAMPAIGNS_API_KEY=
SENTRY_DSN=
REPORT_LINK_SECRET=                 # signs report access tokens
```

---

## 5. Repository Structure

```text
dateready/
├─ app/
│  ├─ page.tsx                      # landing
│  ├─ test/page.tsx
│  ├─ result/page.tsx
│  ├─ checkout/page.tsx
│  ├─ checkout/success/page.tsx
│  ├─ report/page.tsx               # mobile web report
│  ├─ challenge/page.tsx
│  ├─ (legal)/privacy|terms|refund|contact/page.tsx
│  └─ api/
│     ├─ assessment/start/route.ts
│     ├─ assessment/submit/route.ts
│     ├─ checkout/create/route.ts
│     ├─ webhooks/dodo/route.ts
│     ├─ report/[id]/route.ts       # access-checked report data
│     └─ report/[id]/pdf/route.ts   # generates / returns PDF
├─ components/
│  ├─ quiz/ (QuestionCard, ProgressBar, OptionButton)
│  ├─ result/ (ScoreRing, DimensionBar, LockedSection, Paywall)
│  ├─ report/ (ReportSection, ExerciseCard, DayPlan)
│  └─ ui/ (Button, Sheet, StickyCTA)
├─ config/
│  ├─ questions.ts
│  ├─ dimensions.ts
│  ├─ profiles.ts
│  └─ report-content/
│     ├─ primary/ (approach.ts, conversation.ts, social.ts, resilience.ts, presentation.ts)
│     ├─ secondary/ (same 5 files)
│     └─ bridges.ts                 # 20 short combo lines
├─ lib/
│  ├─ scoring.ts
│  ├─ report-selector.ts
│  ├─ report-render.ts              # data → HTML string
│  ├─ pdf.ts
│  ├─ dodo.ts
│  ├─ supabase/ (server.ts, client.ts)
│  ├─ analytics.ts                  # single track() wrapper
│  └─ utm.ts
├─ templates/
│  └─ report.html                   # HTML/CSS report template with {{placeholders}}
├─ supabase/migrations/
└─ tests/
   ├─ scoring.test.ts
   └─ report-selector.test.ts
```

---

## 6. Database (Supabase)

```sql
-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  created_at timestamptz default now(),
  utm_source text, utm_medium text, utm_campaign text,
  utm_adset text, utm_ad text,
  fbclid text, fbp text, fbc text        -- for Meta CAPI matching
);

-- ASSESSMENTS
create table assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  quiz_version text not null default 'v1',
  started_at timestamptz default now(),
  completed_at timestamptz,
  total_score int,
  profile text,
  approach int, conversation int, social int, resilience int, presentation int,
  primary_weakness text,
  secondary_weakness text,
  report_key text                          -- e.g. 'approach__resilience'
);

-- ANSWERS
create table answers (
  id bigserial primary key,
  assessment_id uuid references assessments(id) on delete cascade,
  question_id text not null,
  answer_id text not null,
  category text not null,
  score int not null
);

-- PURCHASES
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  assessment_id uuid references assessments(id),
  product text not null,                   -- 'report_99' | 'kit_299' | 'challenge_499'
  amount int not null,                     -- in paise
  currency text default 'INR',
  payment_status text not null default 'pending',  -- pending|paid|failed|refunded
  provider_payment_id text unique,         -- idempotency key
  terms_accepted_at timestamptz,
  terms_version text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- REPORTS (generated artifacts)
create table reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid unique references assessments(id),
  purchase_id uuid references purchases(id),
  report_key text not null,
  pdf_path text,                           -- Supabase Storage path
  generated_at timestamptz default now()
);

-- WEBHOOK LOG (debugging and idempotency)
create table webhook_events (
  id text primary key,                     -- provider event id
  type text, payload jsonb,
  received_at timestamptz default now(),
  processed boolean default false
);
```

**RLS:** enable RLS on every table with **no public policies**. All reads and writes go through server routes using the service role key. The browser holds only an opaque assessment token.

---

## 7. Assessment: Questions, Scoring, Profiles

### 7.1 Dimensions (each normalized to /20)

| Key | Name | Measures |
|---|---|---|
| `approach` | Approach Confidence | Initiating interaction |
| `conversation` | Conversation Confidence | Keeping conversation natural |
| `social` | Social Comfort | Ease in social settings |
| `resilience` | Emotional Resilience | Handling awkwardness, silence, rejection |
| `presentation` | Self-Presentation | Comfort presenting yourself |

### 7.2 Question bank (12 questions, situational)

Each option scores **0-3** (3 = most confident behavior). Question distribution: approach 3, conversation 2, social 2, resilience 3, presentation 2.

| # | Dimension | Question |
|---|---|---|
| 1 | approach | You see someone you're interested in at a café. What would you most likely do? |
| 2 | approach | A friend offers to introduce you to someone. Your reaction? |
| 3 | approach | You're at an event and someone interesting is alone. You... |
| 4 | conversation | The conversation goes quiet for a few seconds. You... |
| 5 | conversation | Someone asks "So, tell me about yourself." You... |
| 6 | social | You walk into a room where you know only one person. You... |
| 7 | social | A group plans an outing and you're free. You... |
| 8 | resilience | Someone you like takes hours to reply. Your usual reaction? |
| 9 | resilience | You say something awkward in conversation. You... |
| 10 | resilience | Someone politely turns down your invitation. You... |
| 11 | presentation | Before meeting someone new, how do you feel about how you present yourself? |
| 12 | presentation | You're asked to take a photo for a profile. You... |

Write 4 options per question in order of confidence, then **shuffle display order** but keep the score attached to the option.

### 7.3 `config/questions.ts`

```ts
export type Dimension = "approach" | "conversation" | "social" | "resilience" | "presentation";

export interface Option { id: string; text: string; score: 0 | 1 | 2 | 3 }
export interface Question { id: string; dimension: Dimension; text: string; options: Option[] }

export const QUIZ_VERSION = "v1";

export const questions: Question[] = [
  {
    id: "q1",
    dimension: "approach",
    text: "You see someone you're interested in at a café. What would you most likely do?",
    options: [
      { id: "a", text: "Start a casual conversation", score: 3 },
      { id: "b", text: "Wait for the right moment", score: 2 },
      { id: "c", text: "Think about approaching but don't", score: 1 },
      { id: "d", text: "Avoid approaching", score: 0 },
    ],
  },
  {
    id: "q8",
    dimension: "resilience",
    text: "Someone you're interested in takes several hours to reply. Your usual reaction?",
    options: [
      { id: "a", text: "Continue normally", score: 3 },
      { id: "b", text: "Start wondering what happened", score: 2 },
      { id: "c", text: "Send another message", score: 1 },
      { id: "d", text: "Lose interest", score: 0 },
    ],
  },
  // ...remaining 10 questions in the same shape
];
```

### 7.4 Scoring engine `lib/scoring.ts`

```ts
import { questions, Dimension } from "@/config/questions";

export const DIMENSIONS: Dimension[] =
  ["approach", "conversation", "social", "resilience", "presentation"];

export interface ScoreResult {
  dimensions: Record<Dimension, number>; // each 0-20
  total: number;                          // 0-100
  profile: string;
  primaryWeakness: Dimension;
  secondaryWeakness: Dimension;
  strengths: Dimension[];
}

// Tie-break priority when two weaknesses are equal: earlier = treated as weaker
const TIE_ORDER: Dimension[] = ["approach", "resilience", "conversation", "social", "presentation"];

export function computeScore(answers: Record<string, string>): ScoreResult {
  const raw: Record<Dimension, number> = { approach:0, conversation:0, social:0, resilience:0, presentation:0 };
  const max: Record<Dimension, number> = { approach:0, conversation:0, social:0, resilience:0, presentation:0 };

  for (const q of questions) {
    const opt = q.options.find(o => o.id === answers[q.id]);
    if (!opt) throw new Error(`Missing/invalid answer for ${q.id}`);
    raw[q.dimension] += opt.score;
    max[q.dimension] += 3;
  }

  const dimensions = {} as Record<Dimension, number>;
  for (const d of DIMENSIONS) dimensions[d] = Math.round((raw[d] / max[d]) * 20);

  const total = DIMENSIONS.reduce((s, d) => s + dimensions[d], 0);

  const ranked = [...DIMENSIONS].sort((a, b) =>
    dimensions[a] - dimensions[b] || TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b));

  return {
    dimensions,
    total,
    profile: getProfile(total),
    primaryWeakness: ranked[0],
    secondaryWeakness: ranked[1],
    strengths: ranked.slice(-2).reverse(),
  };
}

export function getProfile(total: number): string {
  if (total >= 85) return "The Social Natural";
  if (total >= 70) return "The Confident";
  if (total >= 60) return "The Developing";
  if (total >= 40) return "The Overthinker";
  return "The Hesitant";
}
```

Unit-test: all-3s → 100, all-0s → 0, tie-breaking, invalid answer throws.

### 7.5 Profiles

| Score | Profile | Tone of copy |
|---|---|---|
| 0-39 | The Hesitant | Gentle, "everyone starts somewhere" |
| 40-59 | The Overthinker | Validating, "you notice more than most" |
| 60-69 | The Developing | Encouraging, "you're closer than you think" |
| 70-84 | The Confident | Respectful, "sharpen the edges" |
| 85-100 | The Social Natural | Challenge-oriented, "go deeper" |

Never say "you have anxiety" or "you have a problem". Use "growth area", "next focus", "skill".

---

## 8. Report System

### 8.1 Concept

The report is chosen by **pattern**, not just total score. Two users at 65/100 get different reports.

**The 20 reports = every ordered pair of (primary weakness, secondary weakness).**
5 dimensions × 4 remaining dimensions = **20 combinations**. This gives you exactly 20 templates with a clear selection rule.

```text
report_key = `${primaryWeakness}__${secondaryWeakness}`
e.g. approach__resilience  → REPORT for "Low Approach, then Low Resilience"
```

### 8.2 Do not write 20 full reports by hand

Author **modular blocks** and assemble them. You still ship 20 distinct reports, but you write far less:

| Block type | Count | Written once |
|---|---|---|
| Primary-weakness deep dive (blocker, why it happens, 3 exercises, 7-day plan) | 5 | 1 per dimension |
| Secondary-weakness section (shorter, 1 exercise, tip) | 5 | 1 per dimension |
| Bridge paragraph linking the two ("Because X, Y tends to...") | 20 | 1 per combo |
| Profile intro (5 profiles) | 5 | 1 per profile |
| Strength section (per top-2 strengths) | 5 | 1 per dimension |
| Score-band variants (low <10, mid 10-14, high 15+) inside blocks | 3 per block | inline |

Result: about 45 blocks instead of 20 × everything. Users never see repetition because the combination differs.

### 8.3 Selector `lib/report-selector.ts`

```ts
import { ScoreResult } from "./scoring";

export function selectReport(s: ScoreResult) {
  return {
    reportKey: `${s.primaryWeakness}__${s.secondaryWeakness}`,
    profileKey: s.profile,
    strengthKeys: s.strengths,
  };
}
```

### 8.4 Placeholders

Global (replace in template):

```text
{{NAME}}  {{SCORE}}  {{PROFILE}}  {{DATE}}
{{APPROACH_SCORE}} {{CONVERSATION_SCORE}} {{SOCIAL_SCORE}}
{{RESILIENCE_SCORE}} {{PRESENTATION_SCORE}}
{{PRIMARY_FOCUS}}       -> "Starting conversations"
{{SECONDARY_FOCUS}}     -> "Building comfort with uncertainty"
{{BRIDGE}}              -> combo paragraph
{{PROFILE_INTRO}}
{{STRENGTH_1}} {{STRENGTH_2}}
{{PRIMARY_BLOCK}} {{SECONDARY_BLOCK}} {{PLAN_7DAY}}
```

**Escape all user-provided values** (name especially) before injecting into HTML. A name like `<script>` must never render as markup.

```ts
const esc = (s: string) => s.replace(/[&<>"']/g, c =>
  ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
```

### 8.5 Report structure (both web and PDF)

1. **Cover:** name, score ring, profile, date
2. **Your profile:** short intro for the profile
3. **Score breakdown:** 5 bars with scores
4. **Strengths:** top 2
5. **Your #1 growth area:** blocker, why it happens, what it looks like
6. **Your #2 growth area:** shorter
7. **How they connect:** bridge paragraph
8. **Exercises:** 3 for primary, 1 for secondary
9. **7-day plan:** one small action per day (5-10 minutes)
10. **Next step CTA:** ₹299 Confidence Kit
11. **Footer:** brand, support email, "not a clinical assessment" note

### 8.6 Delivery formats

- **Primary: mobile web report** at `/report` (responsive HTML, same template data). Best reading experience on phones.
- **Secondary: PDF download** rendered from the same HTML with a print stylesheet.

### 8.7 HTML → PDF

```ts
// lib/pdf.ts
import chromium from "@sparticuz/chromium";
import { chromium as pw } from "playwright-core";

export async function htmlToPdf(html: string): Promise<Buffer> {
  const browser = await pw.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();
  return pdf;
}
```

**Print CSS tips**
- `@page { size: A4; margin: 0 }`
- `.section { break-inside: avoid; }` and `.page-break { break-after: page; }`
- Inline fonts or use a system stack, because PDF rendering happens without your CDN assets loading reliably
- Set `-webkit-print-color-adjust: exact` so dark backgrounds print

**Serverless caveat:** headless Chromium on Vercel has size and timeout limits. If it gives trouble, move PDF generation to a small separate service (Railway/Render/Fly) and call it from a route. Also cache: generate once, store in Supabase Storage, and serve a signed URL afterwards.

### 8.8 Generation flow

```text
Webhook marks purchase paid
  → compute reportKey (already stored on assessment)
  → build HTML from blocks + placeholders
  → render PDF, upload to Storage: reports/{assessment_id}.pdf
  → insert reports row
  → send "Your report is ready" email with link to /report?t=<signed token>
```

The web report renders on demand from stored scores (no PDF needed). The PDF is generated lazily the first time someone taps "Download PDF", then cached.

### 8.9 Content-writing prompt (use once, offline, to draft your blocks)

Use this in Claude or ChatGPT, then **edit by hand** before shipping.

```text
You are writing content for "DateReady", a confidence-building report for
Indian men aged 18-34. It is NOT a clinical assessment and must never
diagnose, use therapy jargon, or shame the reader. Tone: warm, direct,
modern, slightly playful, like a smart older friend. English with simple
sentences. No pickup-artist language, no manipulation tactics, no
sexual content. Respect consent and treat others as equals.

Write the block: PRIMARY GROWTH AREA — {{DIMENSION}}.

Dimension definition: {{DEFINITION}}

Return JSON with:
{
  "title": "...",
  "what_it_looks_like": "80-100 words, situational and relatable",
  "why_it_happens": "60-80 words, normalizing, non-clinical",
  "low_band": "40 words for score 0-9",
  "mid_band": "40 words for score 10-14",
  "high_band": "40 words for score 15-20",
  "exercises": [
    { "name": "", "time": "5-10 min", "steps": ["","",""], "why_it_works": "" }
  ],   // exactly 3, safe, real-world, low pressure, no risky behavior
  "plan_7day": [
    { "day": 1, "action": "", "time": "10 min", "reflection_prompt": "" }
  ]    // exactly 7, gradual difficulty
}
Avoid: absolute promises ("you will get a date"), health claims,
and stereotypes. Every action must be respectful of other people's comfort.
```

Repeat for `secondary` (shorter), `strength`, `profile intro`, and the 20 bridge lines.

### 8.10 Content example (block shape)

```ts
// config/report-content/primary/approach.ts
export const approachPrimary = {
  focusLabel: "Starting conversations",
  title: "Your #1 growth area: Starting conversations",
  whatItLooksLike: "...",
  whyItHappens: "...",
  bands: { low: "...", mid: "...", high: "..." },
  exercises: [ { name: "The 10-second hello", time: "5 min", steps: ["..."], whyItWorks: "..." } ],
  plan7day: [ { day: 1, action: "...", time: "10 min", reflection: "..." } ],
};
```

---

## 9. Payments (Dodo) and Unlock Logic

> Check Dodo's current docs for exact endpoint names, payload shapes, supported INR payment methods (UPI/cards) and their policies. The flow below is what matters; adapt field names to the docs.

### 9.1 Flow

```text
/result → "Unlock Full Report ₹99"
   → user ticks "I understand this is an instant digital product and non-refundable"
   → POST /api/checkout/create { assessmentId }
       - insert purchases row (pending, terms_accepted_at, terms_version)
       - create Dodo checkout session with metadata { purchase_id, assessment_id }
       - return checkout URL
   → redirect to Dodo → user pays
   → Dodo sends webhook → /api/webhooks/dodo
   → success page polls /api/purchase/status until paid
   → report unlocked
```

### 9.2 Webhook rules (non-negotiable)

1. **Verify the signature** using the raw request body and your webhook secret (Dodo follows the Standard Webhooks style; prefer their official SDK/verifier).
2. **Idempotency:** insert the event id into `webhook_events`; if already processed, return 200 and do nothing.
3. **Check amount and currency** against the expected product price. Never trust metadata alone.
4. Update `purchases.payment_status = 'paid'`, set `paid_at`.
5. Return 200 quickly. Do slow work (PDF, email) after responding or via a queue.
6. **Never unlock because the browser hit `/checkout/success`.**

```ts
// app/api/webhooks/dodo/route.ts (skeleton)
export async function POST(req: Request) {
  const raw = await req.text();
  const event = verifyDodoWebhook(raw, req.headers, process.env.DODO_WEBHOOK_SECRET!); // throws if invalid

  const supabase = serverClient();
  const { error } = await supabase.from("webhook_events").insert({ id: event.id, type: event.type, payload: event });
  if (error?.code === "23505") return new Response("ok"); // duplicate

  if (event.type === "payment.succeeded") {
    const purchaseId = event.data.metadata.purchase_id;
    // validate amount/currency vs product, then:
    await supabase.from("purchases").update({
      payment_status: "paid", paid_at: new Date().toISOString(),
      provider_payment_id: event.data.payment_id,
    }).eq("id", purchaseId);
    // trigger report + email + Meta CAPI Purchase event (with event_id for dedupe)
  }
  return new Response("ok");
}
```

### 9.3 Report access

- Report URL uses a **signed, expiring token** tied to assessment id, not the raw id.
- `/api/report/[id]` returns full content only if a `paid` purchase exists. Otherwise it returns 402/403 and the client shows the paywall.
- Provide a "resend my report" flow by email so buyers who lose the link aren't stuck.

### 9.4 Upsells

- After payment success, show a one-time offer for the ₹299 Kit on the report page (sticky bottom bar).
- Each product is its own row in `purchases` with its own product id.

---

## 10. Analytics and Tracking

### 10.1 One wrapper

All events go through `lib/analytics.ts`, which fans out to Mixpanel, GA4 and Meta Pixel as appropriate. Do not scatter vendor calls through components.

```ts
export function track(event: string, props: Record<string, unknown> = {}) {
  mixpanel.track(event, { ...props, ...getUtm() });
  // map selected events to GA4 and Meta
}
```

### 10.2 Event list

| Stage | Events |
|---|---|
| Acquisition | `landing_viewed`, `cta_clicked`, `quiz_started` |
| Quiz | `question_viewed {q}`, `question_answered {q}`, `quiz_abandoned {last_q}`, `quiz_completed` |
| Result | `email_submitted`, `result_viewed {score, profile}`, `paywall_viewed`, `unlock_clicked` |
| Payment | `checkout_started`, `payment_success`, `payment_failed` |
| Product | `report_viewed`, `pdf_downloaded`, `upsell_viewed`, `upsell_purchased`, `challenge_started` |

### 10.3 Meta mapping

| Your event | Meta event |
|---|---|
| landing_viewed | PageView / ViewContent |
| quiz_completed + email | Lead |
| unlock_clicked | InitiateCheckout |
| payment_success | Purchase (value 99, currency INR) |

**Purchase must also fire server-side via Conversions API**, with the same `event_id` as the browser event so Meta deduplicates. Store `fbp`, `fbc`, `fbclid` at first touch.

### 10.4 UTM capture

On first load, read `utm_source/medium/campaign/adset(ad_set)/ad(content)` and `fbclid`, persist to a cookie/localStorage, and write them to `users` on email capture.

### 10.5 Clarity and privacy

Mask sensitive inputs in Clarity (email field, name). Do not record answer text in analytics properties beyond what you need.

### 10.6 Optimization hierarchy

`Purchase > Checkout > Paywall view > Quiz completion > Quiz start > CTR`

Judge ads by cost per purchase, not CTR.

---

## 11. Mobile-First UI Specification

Assume **80-90% mobile**. Design at **375 px width first**, then scale up. Feel: Spotify × Duolingo × modern dating app. Dark, clean, playful, premium. Never adult-looking.

### 11.1 Design tokens

```ts
// tailwind.config.ts (extend)
colors: {
  bg:        "#0B0B12",
  surface:   "#14141F",
  surface2:  "#1C1C2B",
  border:    "#2A2A3D",
  text:      "#F5F5FA",
  muted:     "#9A9AB0",
  brand:     "#FF4D8D",   // primary CTA (pink)
  brand2:    "#7C5CFF",   // gradient partner (violet)
  good:      "#3DDC97",
  warn:      "#FFB020",
  bad:       "#FF5C5C",
},
fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], display: ["Sora", "Inter", "sans-serif"] },
borderRadius: { xl: "16px", "2xl": "24px" },
```

Primary gradient: `linear-gradient(135deg, #FF4D8D, #7C5CFF)`.
Type scale (mobile): H1 32/38, H2 24/30, body 16/24 (never below 16 on inputs, avoids iOS zoom), caption 13/18.

### 11.2 Layout rules

- Single column. Max content width `480px` centered on desktop, with a dark background around it so it feels like an app.
- Side padding `20px`. Vertical rhythm in multiples of 8.
- **Touch targets at least 48×48 px.** Spacing between options at least 12 px.
- One primary action per screen. **Sticky bottom CTA** with `padding-bottom: env(safe-area-inset-bottom)`.
- Use `100dvh`, not `100vh`, to avoid the mobile browser bar jump.
- Thumb zone: put primary actions in the bottom third.
- Respect `prefers-reduced-motion`.

### 11.3 Landing page (`/`)

```text
┌──────────────────────────┐
│ DateReady          (logo)│
│                          │
│ How Ready Are You        │
│ For Dating?              │
│                          │
│ 60-second assessment.    │
│ Discover your confidence,│
│ communication style and  │
│ what to improve.         │
│                          │
│ ⏱ 60 sec  🔒 Private  ✓ Free │
│                          │
│ [ Check My Score  → ]    │  ← sticky
│                          │
│ "12 questions. No signup │
│  to start."              │
└──────────────────────────┘
```

Below the fold (keep short): 3-step "how it works", a sample score card, FAQ (Is it free? Is my data private? Is this a diagnosis? → No), footer links. Load time target: LCP under 2 s on 4G. No hero video.

### 11.4 Quiz (`/test`)

```text
┌──────────────────────────┐
│ ←   ████████░░░░  4/12   │  progress + back
│                          │
│ You meet someone you're  │
│ interested in...         │
│                          │
│ ┌──────────────────────┐ │
│ │ I'd start talking    │ │  ← 56px tall cards
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ I'd wait for a moment│ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ I'd overthink it     │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ I'd avoid it         │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

Behavior:
- **Tap an option = auto-advance** after a 250 ms highlight (no separate Next button; fewer taps, higher completion).
- Back arrow allowed; previous answer stays selected.
- Save progress in localStorage + server so a refresh resumes at the same question.
- Slide/fade transition under 200 ms.
- Show a micro-encouragement at Q4, Q8 ("Halfway there", "Almost done").
- Preload next question; keep JS bundle small on this route.

### 11.5 Email capture (before showing the result)

Short interstitial: "Your score is ready. Where should we send your result?" One field (email), optional first name (used in the report), privacy line, button "Show My Score". Keep name optional; default to "there".

### 11.6 Result page (`/result`), the money page

Order, top to bottom:

1. **Animated score ring** counting up to the score (1.2 s)
2. Profile badge: "The Developing"
3. One-line summary
4. **5 dimension bars**, strengths in green, growth areas in amber
5. **One free insight** (real value, tied to their weakest area)
6. "Your score isn't the problem. Knowing what to work on is."
7. **Locked preview:** blurred cards listing what's inside (biggest blocker, communication pattern, breakdown, 7-day plan, exercises) with lock icons. Show real headings such as "Your #1 growth area: Starting conversations" so it feels specific.
8. **Sticky bottom paywall bar:**

```text
┌──────────────────────────────────┐
│ Full Personal Report      ₹99    │
│ [ Unlock Full Report → ]         │
│ Instant • Web + PDF • Private    │
│ Instant digital product,         │
│ non-refundable                   │
└──────────────────────────────────┘
```

9. Trust row: UPI/cards accepted, secure checkout, privacy note
10. Tiny FAQ accordion (What's inside? How fast? Is it private?)

### 11.7 Checkout

- Confirmation bottom sheet: product, ₹99, checkbox "I understand this is an instant digital product and non-refundable, except for failed delivery or duplicate charge." Button disabled until checked.
- Then redirect to Dodo.
- Success page: "Confirming your payment..." with spinner, polling status every 2 s for up to 60 s, then a fallback "Payment received? We'll email your report" message.

### 11.8 Mobile web report (`/report`), the main deliverable

Designed as a **scrollable story**, not a PDF viewport.

```text
Sticky top: DateReady   [Download PDF]

[Cover card]   Hey Rahul!  ◯ 68/100   The Developing
[Chips]        Overview | Scores | Focus | Exercises | 7-Day Plan   ← horizontal sticky tab bar
[Section cards] one idea per card, generous spacing
[Exercise cards] collapsible, with "Mark done" checkbox
[7-day plan]   Day 1-7 as accordion, today's day highlighted
[Upsell]       Confidence Kit ₹299 (single card, not pushy)
```

Rules:
- Cards with `surface` background, 16-24 px radius, 16-20 px padding
- Text blocks max ~60 characters wide feel; keep paragraphs to 3-4 lines
- Use icons and progress bars instead of long tables
- Checkbox progress saved (server-side) so users return and continue: this seeds the 30-day challenge and retention
- Works offline-ish: the report page can be added to the home screen (basic PWA manifest)

### 11.9 PDF design

A4, same brand tokens. Cover page with score ring, then each section on a clean page. Dark cover, light body pages (better for reading and printing). Keep it 8-12 pages. Footer on each page: DateReady • support email • page number.

### 11.10 Components checklist

`Button`, `StickyCTA`, `BottomSheet`, `ProgressBar`, `OptionCard`, `ScoreRing`, `DimensionBar`, `LockedCard`, `Accordion`, `ExerciseCard`, `DayCard`, `Toast`, `Skeleton`.

### 11.11 Performance and accessibility

- Performance budget: landing under 150 KB JS, quiz route under 120 KB. Use `next/font`, `next/image`, lazy-load analytics scripts (`strategy="lazyOnload"` except Pixel where needed).
- Test on a low-end Android over throttled 4G.
- Contrast 4.5:1 minimum; visible focus states; labels on inputs; semantic buttons; `aria-live` for the progress and payment status.
- Test on: iPhone Safari, Chrome Android, Instagram in-app browser (your ad traffic lands here, and it has quirks with fixed bars and payments), and Facebook in-app browser.

---

## 12. Email Flows (Zoho Campaigns)

| # | Timing | Subject idea | Goal |
|---|---|---|---|
| 1 | Immediately | Your DateReady score is ready | Bring them back to /result |
| 2 | Day 1 | What your score actually means | Explain profile, soft CTA |
| 3 | Day 2 | Your biggest confidence mistake | Insight from weakest area |
| 4 | Day 4 | A simple exercise to try today | Value + CTA |
| 5 | Day 6 | Most people at your score do this next | Social proof (real data only) |
| 6 | Day 8 | Want your personalized plan? | ₹99 offer |

**Purchasers** get a separate flow: report delivered, day-3 check-in on the 7-day plan, day-8 Kit upsell.

Rules: unsubscribe link in every mail, physical/business address in footer, sender name "DateReady by Subix", personalize with first name and profile. Segment by `purchased` so buyers stop getting the ₹99 offer.

---

## 13. Legal, Refund and Trust

Pages needed at launch: **Privacy Policy, Terms, Refund Policy, Contact/Support.**

**Refund policy (as planned)**
- ₹99 report and other one-time digital products: **non-refundable once delivered.**
- **Exceptions to state explicitly:** duplicate charge, payment taken but report not delivered, technical failure that prevents access, or a materially misdescribed product.
- **Monthly subscription (later):** cancel anytime via self-serve button; access continues to end of paid period; suggested rule "full refund within 7 days of any charge".
- Show the non-refundable line at the **paywall, the checkout sheet and the Refund page**, and keep the wording identical.
- Store `terms_accepted_at` and `terms_version` for every purchase (chargeback defense).
- Quietly allow goodwill refunds on polite request; it is cheaper than a chargeback.

**Trust copy**
- "This is a self-reflection tool, not a clinical or psychological assessment."
- "We only collect your email, name (optional) and quiz answers."
- "We never sell your data."
- Have a lawyer review Terms, Privacy and Refund pages. Consider India's DPDP Act obligations (consent notice, purpose limitation, deletion on request).

**Age:** the product is for adults. Add "You must be 18+" to the landing and terms, and include an 18+ confirmation on the email step.

**Ad policy:** avoid claims like "get a girlfriend" or "fix your anxiety". Use "confidence", "readiness", "communication". Avoid personal-attribute callouts in ad copy ("Are you lonely?") since Meta restricts that.

---

## 14. Security and Privacy Checklist

- [ ] Service role key used only on the server
- [ ] RLS enabled on all tables, no public policies
- [ ] Webhook signature verified; events idempotent
- [ ] Amount and currency validated on payment success
- [ ] Report access via signed, expiring token; server checks `paid`
- [ ] User-provided text HTML-escaped in templates
- [ ] Rate limiting on `/api/assessment/*` and email submit (per IP)
- [ ] Bot protection on email form (honeypot, then Turnstile if abuse appears)
- [ ] Validate answer payload strictly (Zod): known question ids, valid option ids
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options)
- [ ] Sentry without PII in breadcrumbs
- [ ] Data deletion endpoint or email process
- [ ] Storage bucket private; signed URLs with short expiry

---

## 15. Cursor Prompts (phase by phase)

Paste each prompt in order. Commit after each phase. Attach this file with `@DateReady_Development_Guide.md`.

### Prompt 0: Project setup

```text
Using @DateReady_Development_Guide.md, create a Next.js (App Router) + TypeScript
+ Tailwind project named "dateready". Add the folder structure from section 5,
Tailwind tokens from section 11.1, next/font (Inter, Sora), a global dark theme,
and a centered max-w-[480px] app shell. Add ESLint, Prettier, Zod, and Vitest.
Do not build pages yet. Show me the file tree when done.
```

### Prompt 1: Database

```text
Create Supabase SQL migrations from section 6 of @DateReady_Development_Guide.md.
Enable RLS on all tables with no public policies. Create lib/supabase/server.ts
(service role) and client.ts (anon). Add a private storage bucket "reports".
Write a seed script for local testing.
```

### Prompt 2: Quiz config and scoring

```text
Implement config/questions.ts with all 12 questions from section 7 (4 options
each, scores 3/2/1/0, dimension tagged), config/profiles.ts, and lib/scoring.ts
exactly as specified, including tie-break rules. Write Vitest tests: all-max = 100,
all-zero = 0, tie-breaking, invalid answer throws, primary/secondary weakness
correct for 5 hand-made cases.
```

### Prompt 3: Landing page

```text
Build app/page.tsx following section 11.3 of @DateReady_Development_Guide.md.
Mobile-first at 375px, sticky bottom CTA with safe-area padding, 100dvh,
gradient CTA, no hero video. Add UTM capture (lib/utm.ts) on load and fire
landing_viewed / cta_clicked through lib/analytics.ts (stub for now).
```

### Prompt 4: Quiz UI

```text
Build /test per section 11.4. One question per screen, auto-advance on tap after
250ms, progress bar, back button, answer persistence in localStorage and via
POST /api/assessment/start and submit. Shuffle option order but keep scores
attached server-side. Validate payloads with Zod. Fire question_viewed,
question_answered, quiz_completed. Include an email/name capture step (11.5)
before results. Server computes the score with lib/scoring.ts and stores it.
```

### Prompt 5: Result page

```text
Build /result per section 11.6: animated ScoreRing, profile badge, five
DimensionBars, one free insight based on the weakest dimension, blurred locked
cards using real headings, and the sticky paywall bar with the non-refundable
line. Data comes from the server by assessment token. Fire result_viewed,
paywall_viewed, unlock_clicked.
```

### Prompt 6: Report content and selector

```text
Implement lib/report-selector.ts and config/report-content per section 8. Create
the modular content files with placeholder text I will replace: 5 primary blocks,
5 secondary, 5 strength blocks, 5 profile intros, and bridges.ts with all 20
"primary__secondary" keys. Write tests proving every one of the 20 combos resolves
to a complete report with no missing block.
```

### Prompt 7: Web report

```text
Build /report and /api/report/[id] per sections 8.5 and 11.8. Mobile story layout
with sticky tab chips, collapsible exercise cards with persisted "mark done",
7-day plan accordion, upsell card. The API must return 403 unless a paid
purchase exists and the signed token is valid. HTML-escape all user strings.
```

### Prompt 8: PDF

```text
Create templates/report.html with {{placeholders}} and print CSS (A4, page breaks,
color-adjust exact), lib/report-render.ts to inject blocks/values with escaping,
and lib/pdf.ts using playwright-core + @sparticuz/chromium. Add
/api/report/[id]/pdf which generates once, stores in Supabase Storage, and
returns a signed URL. Add a fallback plan if Chromium exceeds serverless limits.
```

### Prompt 9: Payments

```text
Implement Dodo Payments per section 9. Read the current Dodo docs for the exact API.
/api/checkout/create inserts a pending purchase (with terms_accepted_at and
terms_version) and creates a checkout session with metadata. Implement
/api/webhooks/dodo: verify signature on the raw body, idempotency via
webhook_events, validate amount/currency, mark purchase paid, trigger report
generation and email. Build the checkout bottom sheet and the polling success
page. NEVER unlock based on the success URL.
```

### Prompt 10: Analytics and pixels

```text
Implement lib/analytics.ts as a single track() wrapper to Mixpanel, GA4 and Meta
Pixel with the event map in section 10. Add Microsoft Clarity with input masking.
Add Meta Conversions API for Purchase with event_id dedupe. Load scripts lazily.
Persist UTM and fbp/fbc on the user record.
```

### Prompt 11: Email

```text
Integrate email: transactional "score ready" and "report ready" emails, and add
the user to Zoho Campaigns lists with segments (completed_quiz, purchased). Follow
section 12. Include unsubscribe and resend-report flow.
```

### Prompt 12: Legal pages and hardening

```text
Create /privacy, /terms, /refund, /contact from section 13 with clearly marked
placeholder text for lawyer review. Add security headers, rate limiting, Zod
validation everywhere, and Sentry. Run through the checklist in section 14 and
report any item not done.
```

### Prompt 13: QA pass

```text
Go through section 16 of @DateReady_Development_Guide.md. Write Playwright e2e tests
for: full quiz → result → mock payment webhook → report unlock, and the negative
case where visiting the success URL without a webhook does NOT unlock. Report
Lighthouse mobile scores for /, /test, /result, /report.
```

---

## 16. QA Checklist

**Functional**
- [ ] All 12 questions render, back button works, refresh resumes
- [ ] Score matches hand calculations for 5 test personas
- [ ] All 20 report keys render without missing content
- [ ] Names with special characters and emoji render safely
- [ ] Payment success → report unlocked only after webhook
- [ ] Duplicate webhook delivery does not double-process
- [ ] Failed payment leaves report locked and shows retry
- [ ] PDF opens on iOS and Android, fonts and colors correct, no cut-off content
- [ ] Resend-report email works

**Mobile**
- [ ] 360, 375, 390, 414 px widths
- [ ] iOS Safari, Android Chrome, Instagram in-app browser, Facebook in-app browser
- [ ] Keyboard does not cover the email field or CTA
- [ ] Sticky CTAs respect notch/safe areas

**Tracking**
- [ ] Every event in section 10.2 fires once (check Mixpanel live view)
- [ ] Meta Pixel Helper shows PageView, Lead, InitiateCheckout, Purchase
- [ ] Purchase deduped between browser and CAPI
- [ ] UTMs persisted through the full funnel into `users`

---

## 17. Launch Plan and Metrics

### Timeline

| Days | Focus |
|---|---|
| 1-2 | Branding, UI design, DB, scoring framework, content writing starts |
| 3-7 | Landing, quiz, scoring, result, email capture, Supabase, analytics |
| 8-10 | Paywall, Dodo, webhook, report (web + PDF), emails |
| 11-14 | 5-8 creatives, Meta campaign at ₹500-₹1,000/day, monitor |

Start content writing on day 1; it is usually the slowest part.

### Campaign

One campaign, 3 ad sets (Broad, Interest, Retargeting), 5-8 creatives. Do not scale early. Give each ad enough spend before judging it.

### Funnel benchmarks to watch (targets, not promises)

| Step | Watch for |
|---|---|
| Landing → quiz start | A weak rate means an ad/landing mismatch |
| Quiz start → complete | Drops on a single question mean fix that question |
| Complete → email | Interstitial friction |
| Result → checkout | Paywall copy and price |
| Checkout → paid | Payment method issues, in-app browser problems |

### Unit economics

`Contribution = AOV − CAC − payment fees`
Example: ₹99 AOV, ₹60 CAC → roughly ₹39 before gateway fees. Upsells (₹299 at ~20% take rate adds ~₹60 per user) are what make it work. Track `CAC`, `AOV`, `ROAS` and `upsell rate` per creative.

### First goal

**100 paid customers.** Then study which profiles buy, which hooks work, where users drop, and which price converts.

### Ad creative hooks

1. How confident are you around someone you like? 60-second test.
2. Would you actually start the conversation?
3. Your confidence might not be as high as you think.
4. Confident, or just good at hiding nervousness?
5. Score yourself before your next date.

---

## 18. Post-MVP Roadmap

1. **Week 3-4:** Conversions API tuning, A/B test price (₹99 vs ₹149), A/B test free insight, fix worst quiz drop-off
2. **Month 2:** ₹299 Confidence Kit, ₹499 30-Day Challenge, retention emails driven by report checkbox progress
3. **Month 3:** Share-your-score card (image), referral unlock ("invite 2 friends → extra insight")
4. **Month 3-4:** SEO content hub, creator partnerships
5. **Later:** AI Coach with roleplay and practice scenarios (subscription), score re-test to show improvement over time ("58 → 64 → 72")
6. **Platform play:** turn the engine into a reusable quiz template for InterviewReady, SpeakReady and StyleReady

---

## Appendix A: Definition of Done for MVP

- Visitor can finish the quiz on a phone in about 60-90 seconds
- Server-computed score and profile appear, with a personalized free insight
- User can pay ₹99 and gets the report only after the webhook confirms
- Report opens as a mobile web page and downloads as a PDF
- All events and pixels fire correctly, and UTMs reach the database
- Legal pages live, refund line consistent everywhere
- Error monitoring and basic rate limiting active

## Appendix B: Guardrails

- No manipulation, pickup-artist tactics or content that pressures others
- No diagnosis or health claims
- No unrealistic promises in ads or reports
- Treat other people's consent and comfort as part of every exercise
