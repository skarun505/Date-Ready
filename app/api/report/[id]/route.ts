import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { verifyReportToken } from "@/lib/token";
import { selectReport } from "@/lib/report-selector";
import { ScoreResult } from "@/lib/scoring";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";

    const supabase = serverClient();

    // 1. Verify access: Check if there's a paid purchase OR a valid signed token
    let isAuthorized = false;

    // Check all paid purchases for this assessment
    const { data: purchases } = await supabase
      .from("purchases")
      .select("product, payment_status")
      .eq("assessment_id", assessmentId)
      .eq("payment_status", "paid");

    const hasPurchasedAny = Boolean(purchases && purchases.length > 0);
    const hasKit = purchases?.some((p: any) => p.product === "kit_299") || false;

    if (hasPurchasedAny) {
      isAuthorized = true;
    } else if (token) {
      const tokenVerification = verifyReportToken(token);
      if (tokenVerification.valid && tokenVerification.assessmentId === assessmentId) {
        isAuthorized = true;
      }
    }

    // 2. Fetch assessment details
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*, users(*)")
      .eq("id", assessmentId)
      .single();

    if (error || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: "Payment required to unlock full report",
          assessmentId,
          totalScore: assessment.total_score,
          profile: assessment.profile,
          requiresPayment: true,
        },
        { status: 402 }
      );
    }

    // 3. Assemble full report data
    const scoreResult: ScoreResult = {
      dimensions: {
        approach: assessment.approach,
        conversation: assessment.conversation,
        social: assessment.social,
        resilience: assessment.resilience,
        presentation: assessment.presentation,
      },
      rawDimensions: { approach: 0, conversation: 0, social: 0, resilience: 0, presentation: 0 },
      maxDimensions: { approach: 0, conversation: 0, social: 0, resilience: 0, presentation: 0 },
      total: assessment.total_score,
      profile: assessment.profile,
      primaryWeakness: assessment.primary_weakness,
      secondaryWeakness: assessment.secondary_weakness,
      strengths: ["approach", "conversation", "social", "resilience", "presentation"]
        .filter((d) => d !== assessment.primary_weakness && d !== assessment.secondary_weakness)
        .slice(0, 2) as any,
      reportKey: assessment.report_key || `${assessment.primary_weakness}__${assessment.secondary_weakness}`,
      totalAnswered: assessment.total_answered ?? 12,
    };

    const reportData = selectReport(scoreResult);
    const userName = assessment.users?.name || "Friend";

    return NextResponse.json({
      success: true,
      report: reportData,
      userName,
      assessmentId,
      hasKit,
      purchasedProducts: purchases?.map((p: any) => p.product) || [],
    });
  } catch (err: any) {
    console.error("[Report Access Route Error]", err);
    return NextResponse.json({ error: err.message || "Failed to load report" }, { status: 500 });
  }
}
