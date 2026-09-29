import { NextResponse } from "next/server";
import { z } from "zod";
import { serverClient } from "@/lib/supabase/server";
import { createDodoCheckoutSession, PRODUCT_PRICES } from "@/lib/dodo";
import { getSiteUrl } from "@/lib/url";

const CheckoutCreateSchema = z.object({
  assessmentId: z.string().min(1),
  product: z.enum(["report_99", "kit_299", "challenge_499"]).default("report_99"),
  termsAccepted: z.literal(true),
  termsVersion: z.string().default("v1"),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parsed = CheckoutCreateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { assessmentId, product, termsAccepted, termsVersion } = parsed.data;
    const supabase = serverClient();

    // Fetch assessment and user information
    const { data: assessment } = await supabase
      .from("assessments")
      .select("*, users(*)")
      .eq("id", assessmentId)
      .single();

    const userEmail = assessment?.users?.email || "customer@dateready.subix.in";
    const userName = assessment?.users?.name || "Friend";

    const purchaseId = crypto.randomUUID();
    const productPrice = PRODUCT_PRICES[product] || PRODUCT_PRICES.report_99;

    // Insert pending purchase
    await supabase.from("purchases").insert({
      id: purchaseId,
      user_id: assessment?.user_id || null,
      assessment_id: assessmentId,
      product,
      amount: productPrice.amountPaise,
      currency: "INR",
      payment_status: "pending",
      terms_accepted_at: new Date().toISOString(),
      terms_version: termsVersion,
    });

    const siteUrl = getSiteUrl();
    const returnUrl = `${siteUrl}/checkout/success?purchaseId=${purchaseId}&assessmentId=${assessmentId}`;

    const session = await createDodoCheckoutSession({
      purchaseId,
      assessmentId,
      product,
      userEmail,
      userName,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      purchaseId,
      checkoutUrl: session.checkoutUrl,
    });
  } catch (err: any) {
    console.error("[Checkout Create Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
