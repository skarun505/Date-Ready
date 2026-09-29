// lib/email.ts - Automated Email Dispatch Engine (Resend API + Dev Fallback)

import { getSiteUrl } from "./url";

interface SendAssessmentCompleteParams {
  email: string;
  name?: string;
  score: number;
  profile: string;
  assessmentId: string;
  token?: string;
}

interface SendReportUnlockedParams {
  email: string;
  name?: string;
  assessmentId: string;
  token?: string;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "DateReady <support@dateready.subix.in>";

/**
 * Low-level email sender using Resend REST API (zero extra npm dependency)
 */
async function sendEmailViaResend({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey && apiKey.startsWith("re_")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject,
          html,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, id: data.id };
      } else {
        const err = await response.text();
        console.warn("[Email Service] Resend API error:", err);
      }
    } catch (e) {
      console.warn("[Email Service] Failed to send email via Resend:", e);
    }
  }

  // Graceful development mode simulation
  console.log(`[Email Simulation] To: ${to} | Subject: "${subject}"`);
  return { success: true, id: `sim_email_${Date.now()}` };
}

/**
 * 1. Email sent immediately when user completes assessment and provides email
 */
export async function sendAssessmentCompleteEmail(params: SendAssessmentCompleteParams) {
  const siteUrl = getSiteUrl();
  const name = params.name || "there";
  const resultUrl = `${siteUrl}/result?id=${encodeURIComponent(params.assessmentId)}${
    params.token ? `&t=${encodeURIComponent(params.token)}` : ""
  }`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; background: #0B0B12; color: #E0E0EC; padding: 24px 16px; margin: 0; }
          .card { max-width: 520px; margin: 0 auto; background: #14141F; border: 1px solid #2A2A3D; border-radius: 20px; padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(255, 77, 141, 0.15); border: 1px solid rgba(255, 77, 141, 0.3); border-radius: 9999px; color: #FF4D8D; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
          h1 { color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; }
          .score-box { background: #1C1C2B; border: 1px solid #2A2A3D; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .score-num { font-size: 42px; font-weight: 900; color: #FFFFFF; }
          .score-label { font-size: 13px; color: #9A9AB0; margin-top: 4px; }
          p { font-size: 14px; line-height: 1.6; color: #C5C5D8; margin: 0 0 16px 0; }
          .btn { display: block; text-align: center; background: #FF4D8D; color: #FFFFFF !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: bold; margin: 28px 0 12px 0; }
          .footer { font-size: 11px; color: #6A6A80; text-align: center; margin-top: 24px; border-top: 1px solid #2A2A3D; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">DateReady Assessment</div>
          <h1>Hey ${name}! Your Score is Ready</h1>
          <p>You recently took the 60-second DateReady Dating Readiness Assessment. Here is your official profile summary:</p>

          <div class="score-box">
            <div class="score-num">${params.score}<span style="font-size: 20px; color: #9A9AB0;">/100</span></div>
            <div class="score-label">Archetype: <strong style="color: #FF4D8D;">${params.profile}</strong></div>
          </div>

          <p>We've pinpointed your primary communication bottleneck and prepared your full situational breakdown and 7-day action blueprint.</p>

          <a href="${resultUrl}" class="btn">View My Full Analysis & Report &rarr;</a>

          <div class="footer">
            DateReady by Subix • 100% Private & Confidential • Bangalore, India
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmailViaResend({
    to: params.email,
    subject: `Your Dating Readiness Score (${params.score}/100) — DateReady`,
    html,
  });
}

/**
 * 2. Email sent when payment confirms, delivering the permanent report link + PDF access
 */
export async function sendReportUnlockedEmail(params: SendReportUnlockedParams) {
  const siteUrl = getSiteUrl();
  const name = params.name || "there";
  const reportUrl = `${siteUrl}/report?id=${encodeURIComponent(params.assessmentId)}${
    params.token ? `&token=${encodeURIComponent(params.token)}` : ""
  }`;
  const pdfUrl = `${siteUrl}/api/report/${encodeURIComponent(params.assessmentId)}/pdf${
    params.token ? `?token=${encodeURIComponent(params.token)}` : ""
  }`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; background: #0B0B12; color: #E0E0EC; padding: 24px 16px; margin: 0; }
          .card { max-width: 520px; margin: 0 auto; background: #14141F; border: 1px solid #2A2A3D; border-radius: 20px; padding: 32px 24px; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(61, 220, 151, 0.15); border: 1px solid rgba(61, 220, 151, 0.3); border-radius: 9999px; color: #3DDC97; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
          h1 { color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0; }
          p { font-size: 14px; line-height: 1.6; color: #C5C5D8; margin: 0 0 16px 0; }
          .box { background: #1C1C2B; border: 1px solid #2A2A3D; border-radius: 16px; padding: 18px; margin: 20px 0; }
          .btn { display: block; text-align: center; background: #FF4D8D; color: #FFFFFF !important; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: bold; margin: 20px 0 10px 0; }
          .btn-secondary { display: block; text-align: center; background: #1C1C2B; border: 1px solid #2A2A3D; color: #E0E0EC !important; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; }
          .footer { font-size: 11px; color: #6A6A80; text-align: center; margin-top: 24px; border-top: 1px solid #2A2A3D; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Payment Confirmed • Permanent Access</div>
          <h1>Your DateReady Personal Report is Unlocked!</h1>
          <p>Hey ${name}, thank you for your order! Your full personalized Dating Readiness Report and 7-day action plan are ready.</p>

          <div class="box">
            <strong style="color: #FFFFFF; display: block; margin-bottom: 6px;">What's in your report:</strong>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #9A9AB0; line-height: 1.6;">
              <li>Comprehensive diagnosis of your primary growth bottleneck</li>
              <li>3 situational field exercises with step-by-step drills</li>
              <li>Personalized 7-day action blueprint</li>
              <li>Complete 20-point dimension breakdown & leverage tips</li>
            </ul>
          </div>

          <a href="${reportUrl}" class="btn">Open Interactive Web Report &rarr;</a>
          <a href="${pdfUrl}" class="btn-secondary">Download PDF Copy &darr;</a>

          <p style="font-size: 12px; color: #9A9AB0;">Save this email! This link provides lifetime access to your DateReady report from any device.</p>

          <div class="footer">
            Need help? Contact support@dateready.subix.in • DateReady by Subix
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmailViaResend({
    to: params.email,
    subject: "Your DateReady Personal Report is Ready (Web + PDF)",
    html,
  });
}
