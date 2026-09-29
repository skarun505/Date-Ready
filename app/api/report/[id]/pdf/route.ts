import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { verifyReportToken } from "@/lib/token";
import { selectReport } from "@/lib/report-selector";
import { renderReportHtml } from "@/lib/report-render";
import { htmlToPdf } from "@/lib/pdf";
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

    // Check payment or valid token
    const { data: purchase } = await supabase
      .from("purchases")
      .select("payment_status")
      .eq("assessment_id", assessmentId)
      .eq("payment_status", "paid")
      .maybeSingle();

    const isAuthorized =
      purchase?.payment_status === "paid" ||
      (token && verifyReportToken(token).valid);

    if (!isAuthorized) {
      return new Response("Payment required to download report PDF", { status: 402 });
    }

    const { data: assessment } = await supabase
      .from("assessments")
      .select("*, users(*)")
      .eq("id", assessmentId)
      .single();

    if (!assessment) {
      return new Response("Assessment not found", { status: 404 });
    }

    const totalAnswered: number = assessment.total_answered ?? 12;

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
      reportKey: assessment.report_key,
      totalAnswered,
    };

    const reportData = selectReport(scoreResult);
    const userName = assessment.users?.name || "Friend";

    const renderedHtml = renderReportHtml(reportData, userName, totalAnswered);
    const pdfBuffer = await htmlToPdf(renderedHtml);

    return new Response(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DateReady-Report-${userName.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("[PDF Route Error]", err);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
