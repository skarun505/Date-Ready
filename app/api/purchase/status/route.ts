import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { generateReportToken } from "@/lib/token";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const purchaseId = searchParams.get("purchaseId");

    if (!purchaseId) {
      return NextResponse.json({ error: "Missing purchaseId" }, { status: 400 });
    }

    const supabase = serverClient();
    const { data: purchase, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single();

    if (error || !purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    const isPaid = purchase.payment_status === "paid";
    let token = null;

    if (isPaid && purchase.assessment_id) {
      token = generateReportToken(purchase.assessment_id);
    }

    return NextResponse.json({
      status: purchase.payment_status,
      assessmentId: purchase.assessment_id,
      product: purchase.product,
      isPaid,
      token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to check status" }, { status: 500 });
  }
}
