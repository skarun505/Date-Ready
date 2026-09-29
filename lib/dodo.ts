import crypto from "crypto";
import { getSiteUrl } from "./url";

export interface CreateCheckoutParams {
  purchaseId: string;
  assessmentId: string;
  product: "report_99" | "kit_299" | "challenge_499";
  userEmail: string;
  userName?: string;
  returnUrl: string;
}

export const PRODUCT_PRICES: Record<string, { amountPaise: number; name: string }> = {
  report_99: { amountPaise: 9900, name: "DateReady Personal Report" },
  kit_299: { amountPaise: 29900, name: "Confidence Kit (14-Day Blueprint)" },
  challenge_499: { amountPaise: 49900, name: "30-Day Dating Mastery Challenge" },
};

/**
 * Creates a Dodo checkout session or returns a local simulated payment checkout URL
 */
export async function createDodoCheckoutSession(params: CreateCheckoutParams): Promise<{ checkoutUrl: string; sessionId?: string }> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  const productInfo = PRODUCT_PRICES[params.product] || PRODUCT_PRICES.report_99;

  if (apiKey && apiKey.startsWith("dodo_")) {
    try {
      const response = await fetch("https://api.dodopayments.com/v1/checkouts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: productInfo.amountPaise,
          currency: "INR",
          product_name: productInfo.name,
          customer: {
            email: params.userEmail,
            name: params.userName || "Friend",
          },
          metadata: {
            purchase_id: params.purchaseId,
            assessment_id: params.assessmentId,
            product: params.product,
          },
          return_url: params.returnUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { checkoutUrl: data.checkout_url || data.payment_link, sessionId: data.id };
      }
    } catch (e) {
      console.warn("[Dodo Payments] Live API request failed, falling back to local simulation redirect", e);
    }
  }

  // Simulated development checkout redirect
  const baseUrl = getSiteUrl();
  const simulatedUrl = `${baseUrl}/checkout/success?purchaseId=${encodeURIComponent(
    params.purchaseId
  )}&assessmentId=${encodeURIComponent(params.assessmentId)}&simulated=true`;

  return { checkoutUrl: simulatedUrl, sessionId: `sim_session_${Date.now()}` };
}

/**
 * Verifies standard webhook signature from Dodo Payments
 */
export function verifyDodoWebhook(
  rawBody: string,
  headers: Headers | Record<string, string | string[] | undefined>,
  secret: string
): any {
  // If secret is not set in development or test, allow parsing
  if (!secret || secret === "test_webhook_secret") {
    try {
      return JSON.parse(rawBody);
    } catch (e) {
      throw new Error("Invalid JSON body");
    }
  }

  const signatureHeader =
    headers instanceof Headers
      ? headers.get("webhook-signature") || headers.get("x-dodo-signature")
      : (headers["webhook-signature"] as string) || (headers["x-dodo-signature"] as string);

  if (!signatureHeader) {
    throw new Error("Missing webhook signature header");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signatureHeader !== expectedSignature) {
    throw new Error("Invalid webhook signature match");
  }

  return JSON.parse(rawBody);
}
