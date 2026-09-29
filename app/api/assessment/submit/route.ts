import { NextResponse } from "next/server";
import { z } from "zod";
import { serverClient } from "@/lib/supabase/server";
import { computeScore } from "@/lib/scoring";
import { generateReportToken } from "@/lib/token";
import { sendAssessmentCompleteEmail } from "@/lib/email";
import { allQuestionsMap } from "@/config/questions";

const SubmitSchema = z.object({
  assessmentId: z.string().min(1),
  answers: z.record(z.string(), z.string()),
  email: z.string().email(),
  name: z.string().optional(),
  utm: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_adset: z.string().optional(),
    utm_ad: z.string().optional(),
    fbclid: z.string().optional(),
    fbp: z.string().optional(),
    fbc: z.string().optional(),
  }).optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parsed = SubmitSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { assessmentId, answers, email, name, utm } = parsed.data;

    // 1. Compute score on the server - NEVER trust client scores
    const scoreResult = computeScore(answers);

    const supabase = serverClient();

    // 2. Upsert user record
    const userId = crypto.randomUUID();
    await supabase.from("users").insert({
      id: userId,
      email,
      name: name || "there",
      utm_source: utm?.utm_source,
      utm_medium: utm?.utm_medium,
      utm_campaign: utm?.utm_campaign,
      utm_adset: utm?.utm_adset,
      utm_ad: utm?.utm_ad,
      fbclid: utm?.fbclid,
      fbp: utm?.fbp,
      fbc: utm?.fbc,
    });

    // 3. Update assessment record with scores
    await supabase.from("assessments").update({
      user_id: userId,
      completed_at: new Date().toISOString(),
      total_score: scoreResult.total,
      profile: scoreResult.profile,
      approach: scoreResult.dimensions.approach,
      conversation: scoreResult.dimensions.conversation,
      social: scoreResult.dimensions.social,
      resilience: scoreResult.dimensions.resilience,
      presentation: scoreResult.dimensions.presentation,
      primary_weakness: scoreResult.primaryWeakness,
      secondary_weakness: scoreResult.secondaryWeakness,
      report_key: scoreResult.reportKey,
      total_answered: scoreResult.totalAnswered,
    }).eq("id", assessmentId);

    // 4. Generate signed report token
    const token = generateReportToken(assessmentId);

    // 5. Fire automated email asynchronously (don't block HTTP response)
    sendAssessmentCompleteEmail({
      email,
      name,
      score: scoreResult.total,
      profile: scoreResult.profile,
      assessmentId,
      token,
    }).catch((emailErr) => {
      console.warn("[Email Notification Error]", emailErr);
    });

    return NextResponse.json({
      success: true,
      assessmentId,
      token,
      score: scoreResult.total,
      profile: scoreResult.profile,
      dimensions: scoreResult.dimensions,
      primaryWeakness: scoreResult.primaryWeakness,
      secondaryWeakness: scoreResult.secondaryWeakness,
      reportKey: scoreResult.reportKey,
    });
  } catch (err: any) {
    console.error("[Assessment Submit Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to process assessment" },
      { status: 500 }
    );
  }
}
