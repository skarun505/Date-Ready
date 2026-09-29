import { getStoredUtm } from "./utm";

export function track(event: string, props: Record<string, unknown> = {}) {
  const utm = getStoredUtm();
  const enrichedProps = {
    ...props,
    ...utm,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  // 1. Console log in development
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics Event: ${event}]`, enrichedProps);
  }

  if (typeof window === "undefined") return;

  // 2. Mixpanel dispatch
  const win = window as any;
  if (win.mixpanel && typeof win.mixpanel.track === "function") {
    win.mixpanel.track(event, enrichedProps);
  }

  // 3. Google Analytics 4 (gtag)
  if (typeof win.gtag === "function") {
    win.gtag("event", event, enrichedProps);
  }

  // 4. Meta Pixel mapping
  if (typeof win.fbq === "function") {
    switch (event) {
      case "landing_viewed":
        win.fbq("track", "PageView");
        win.fbq("track", "ViewContent", { content_name: "DateReady Landing" });
        break;
      case "email_submitted":
      case "quiz_completed":
        win.fbq("track", "Lead", { content_name: "Dating Readiness Assessment" });
        break;
      case "unlock_clicked":
      case "checkout_started":
        win.fbq("track", "InitiateCheckout", {
          value: 99,
          currency: "INR",
          content_name: "DateReady Personal Report",
        });
        break;
      case "payment_success":
        win.fbq("track", "Purchase", {
          value: (props.amount as number) || 99,
          currency: "INR",
          content_name: (props.product as string) || "DateReady Personal Report",
        }, { eventID: props.eventId || props.purchaseId });
        break;
      default:
        win.fbq("trackCustom", event, enrichedProps);
    }
  }
}
