import { NextResponse } from "next/server";
import { verifyDodoWebhook, PRODUCT_PRICES } from "@/lib/dodo";
import { serverClient } from "@/lib/supabase/server";
import { generateReportToken } from "@/lib/token";
import { sendReportUnlockedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET || "test_webhook_secret";

    let event: any;
    try {
      event = verifyDodoWebhook(rawBody, req.headers, webhookSecret);
    } catch (sigErr: any) {
      console.error("[Webhook Signature Verification Failed]", sigErr.message);
      return new Response("Invalid signature", { status: 400 });
    }

    const eventId = event.id || `evt_${Date.now()}_${Math.random()}`;
    const supabase = serverClient();

    // 1. Idempotency check via webhook_events
    const { error: insertError } = await supabase.from("webhook_events").insert({
      id: eventId,
      type: event.type,
      payload: event,
      received_at: new Date().toISOString(),
    });

    if (insertError?.code === "23505") {
      // Already received and processed
      return new Response("Duplicate event ignored", { status: 200 });
    }

    // 2. Handle payment success
    if (event.type === "payment.succeeded" || event.type === "checkout.session.completed") {
      const metadata = event.data?.metadata || {};
      const purchaseId = metadata.purchase_id;
      const assessmentId = metadata.assessment_id;
      const product = metadata.product || "report_99";
      const expectedInfo = PRODUCT_PRICES[product] || PRODUCT_PRICES.report_99;

      // Validate currency and amount if provided in payload
      const paidAmount = event.data?.amount;
      if (paidAmount && paidAmount < expectedInfo.amountPaise) {
        console.error(`[Webhook Alert] Underpaid amount: ${paidAmount} < ${expectedInfo.amountPaise}`);
        return new Response("Underpaid amount", { status: 400 });
      }

      if (purchaseId) {
        // Mark purchase as paid
        await supabase
          .from("purchases")
          .update({
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            provider_payment_id: event.data?.payment_id || event.id,
          })
          .eq("id", purchaseId);

        // Record in reports table and dispatch access email
        if (assessmentId) {
          const { data: assessment } = await supabase
            .from("assessments")
            .select("report_key, user_id, users(*)")
            .eq("id", assessmentId)
            .single();

          await supabase.from("reports").insert({
            id: crypto.randomUUID(),
            assessment_id: assessmentId,
            purchase_id: purchaseId,
            report_key: assessment?.report_key || "approach__resilience",
            generated_at: new Date().toISOString(),
          });

          // Send confirmation email with lifetime web link + PDF download
          const userEmail = assessment?.users?.email || event.data?.customer?.email;
          const userName = assessment?.users?.name || event.data?.customer?.name;

          if (userEmail) {
            const token = generateReportToken(assessmentId);
            sendReportUnlockedEmail({
              email: userEmail,
              name: userName,
              assessmentId,
              token,
            }).catch((emailErr) => {
              console.warn("[Report Email Dispatch Error]", emailErr);
            });
          }
        }
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (err: any) {
    console.error("[Webhook Handler Fatal Error]", err);
    return new Response("Internal server error", { status: 500 });
  }
}
