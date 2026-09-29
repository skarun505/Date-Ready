import fs from "fs";
import path from "path";
import { FullReportData } from "./report-selector";

export const escapeHtml = (s: string = ""): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
  );

/** Convert a dimension raw score (0–20) to a percentage */
function pct(score: number): number {
  return Math.round((Math.min(score, 20) / 20) * 100);
}

/** Determine strength/growth tag */
function dimTag(score: number): { tag: string; tagClass: string; fillClass: string } {
  if (score >= 14) return { tag: "Strength", tagClass: "strength", fillClass: "green" };
  if (score >= 9)  return { tag: "Developing", tagClass: "growth", fillClass: "" };
  return { tag: "Focus Area", tagClass: "growth", fillClass: "" };
}

export function renderReportHtml(
  reportData: FullReportData,
  userName: string = "Friend",
  totalQAnswered: number = 12
): string {
  const templatePath = path.resolve(process.cwd(), "templates/report.html");
  let template = "";

  try {
    template = fs.readFileSync(templatePath, "utf-8");
  } catch {
    template = "<html><body><h1>DateReady Report for {{NAME}}</h1><p>Score: {{SCORE}}</p></body></html>";
  }

  const safeName = escapeHtml(userName.trim() || "Friend");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // ── Dimension data ─────────────────────────────────────────────────
  const dims = reportData.dimensions;
  const approachInfo    = dimTag(dims.approach    || 0);
  const convInfo        = dimTag(dims.conversation || 0);
  const socialInfo      = dimTag(dims.social       || 0);
  const resilienceInfo  = dimTag(dims.resilience   || 0);
  const presInfo        = dimTag(dims.presentation || 0);

  const topDimScore = Math.max(
    dims.approach || 0,
    dims.conversation || 0,
    dims.social || 0,
    dims.resilience || 0,
    dims.presentation || 0
  );

  // Score rotation (ring indicator): full circle = 360° = score 100
  const scoreDeg = Math.round((reportData.totalScore / 100) * 360);

  // ── Strengths block ───────────────────────────────────────────────
  const strengthsHtml = reportData.strengths
    .map(
      (s) => `
    <div class="strength-item">
      <div class="strength-tagline">${escapeHtml(s.tagline)}</div>
      <div class="strength-title">${escapeHtml(s.title)}</div>
      <div class="strength-desc">${escapeHtml(s.description)}</div>
      <div class="strength-leverage"><strong>How to leverage:</strong> ${escapeHtml(s.howToLeverage)}</div>
    </div>`
    )
    .join("");

  // ── Exercises block ───────────────────────────────────────────────
  const exercisesHtml = reportData.primary.exercises
    .map(
      (ex, i) => `
    <div class="exercise-card">
      <div class="exercise-header">
        <div class="exercise-name">Drill ${i + 1}: ${escapeHtml(ex.name)}</div>
        <div class="exercise-time">${escapeHtml(ex.time)}</div>
      </div>
      ${ex.steps.map((s, si) => `<div class="exercise-step"><span class="step-num">${si + 1}.</span><span>${escapeHtml(s)}</span></div>`).join("")}
      <div class="exercise-why"><strong>Why it works:</strong> ${escapeHtml(ex.whyItWorks)}</div>
    </div>`
    )
    .join("");

  // ── 7-Day plan block ──────────────────────────────────────────────
  const planHtml = reportData.primary.plan7day
    .map(
      (d) => `
    <div class="day-row">
      <div class="day-badge">
        <div class="day-num">${d.day}</div>
        <div class="day-label">Day</div>
      </div>
      <div class="day-content">
        <div class="day-theme">${escapeHtml(d.action)}</div>
        <div class="day-task">⏱ ${escapeHtml(d.time)} &nbsp;•&nbsp; 💭 ${escapeHtml(d.reflection)}</div>
      </div>
    </div>`
    )
    .join("");

  // ── Replacement map ───────────────────────────────────────────────
  const replacements: Record<string, string> = {
    "{{NAME}}":                 safeName,
    "{{DATE}}":                 dateStr,
    "{{SCORE}}":                String(reportData.totalScore),
    "{{SCORE_DEG}}":            String(scoreDeg),
    "{{PROFILE}}":              escapeHtml(reportData.profile.name),
    "{{PROFILE_INTRO}}":        escapeHtml(reportData.profile.description),
    "{{TOTAL_Q}}":              String(totalQAnswered),
    "{{TOP_DIM_SCORE}}":        String(topDimScore),
    // Approach
    "{{APPROACH_SCORE}}":       String(dims.approach    || 0),
    "{{APPROACH_PCT}}":         String(pct(dims.approach    || 0)),
    "{{APPROACH_TAG}}":         approachInfo.tag,
    "{{APPROACH_TAG_CLASS}}":   approachInfo.tagClass,
    "{{APPROACH_CLASS}}":       approachInfo.fillClass,
    // Conversation
    "{{CONVERSATION_SCORE}}":   String(dims.conversation || 0),
    "{{CONV_PCT}}":             String(pct(dims.conversation || 0)),
    "{{CONV_TAG}}":             convInfo.tag,
    "{{CONV_TAG_CLASS}}":       convInfo.tagClass,
    "{{CONV_CLASS}}":           convInfo.fillClass,
    // Social
    "{{SOCIAL_SCORE}}":         String(dims.social       || 0),
    "{{SOCIAL_PCT}}":           String(pct(dims.social       || 0)),
    "{{SOCIAL_TAG}}":           socialInfo.tag,
    "{{SOCIAL_TAG_CLASS}}":     socialInfo.tagClass,
    "{{SOCIAL_CLASS}}":         socialInfo.fillClass,
    // Resilience
    "{{RESILIENCE_SCORE}}":     String(dims.resilience   || 0),
    "{{RESILIENCE_PCT}}":       String(pct(dims.resilience   || 0)),
    "{{RESILIENCE_TAG}}":       resilienceInfo.tag,
    "{{RESILIENCE_TAG_CLASS}}": resilienceInfo.tagClass,
    "{{RESILIENCE_CLASS}}":     resilienceInfo.fillClass,
    // Presentation
    "{{PRESENTATION_SCORE}}":   String(dims.presentation || 0),
    "{{PRES_PCT}}":             String(pct(dims.presentation || 0)),
    "{{PRES_TAG}}":             presInfo.tag,
    "{{PRES_TAG_CLASS}}":       presInfo.tagClass,
    "{{PRES_CLASS}}":           presInfo.fillClass,
    // Content blocks
    "{{STRENGTHS_BLOCK}}":      strengthsHtml,
    "{{PRIMARY_FOCUS}}":        escapeHtml(reportData.primary.focusLabel),
    "{{PRIMARY_WHAT}}":         escapeHtml(reportData.primary.whatItLooksLike),
    "{{PRIMARY_WHY}}":          escapeHtml(reportData.primary.whyItHappens),
    "{{PRIMARY_BAND}}":         escapeHtml(reportData.primary.bandText),
    "{{BRIDGE}}":               escapeHtml(reportData.bridge),
    "{{SECONDARY_FOCUS}}":      escapeHtml(reportData.secondary.focusLabel),
    "{{SECONDARY_TITLE}}":      escapeHtml(reportData.secondary.title),
    "{{SECONDARY_WHAT}}":       escapeHtml(reportData.secondary.whatItLooksLike),
    "{{SECONDARY_TIP}}":        escapeHtml(reportData.secondary.keyTip),
    "{{EXERCISES_BLOCK}}":      exercisesHtml,
    "{{PLAN_7DAY}}":            planHtml,
  };

  let rendered = template;
  for (const [placeholder, val] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(placeholder, val);
  }

  return rendered;
}
