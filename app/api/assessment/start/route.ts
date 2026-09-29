import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { QUIZ_VERSION } from "@/config/questions";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const supabase = serverClient();
    const assessmentId = crypto.randomUUID();

    const { data, error } = await supabase.from("assessments").insert({
      id: assessmentId,
      quiz_version: QUIZ_VERSION,
      started_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Assessment Start Error]", error);
      return NextResponse.json({ error: "Failed to initialize assessment" }, { status: 500 });
    }

    return NextResponse.json({
      assessmentId,
      startedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
