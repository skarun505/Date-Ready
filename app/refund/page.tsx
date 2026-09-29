import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B0B12] px-5 py-8 max-w-sm mx-auto text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A9AB0] hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-2xl font-bold font-display mb-2">Refund Policy</h1>
      <p className="text-xs text-[#9A9AB0] mb-6">Effective Date: September 2026</p>

      <div className="space-y-4 text-xs text-[#E0E0EC] leading-relaxed">
        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4">
          <p className="font-semibold text-white">
            "I understand this is an instant digital product and non-refundable, except for failed delivery or duplicate charge."
          </p>
        </div>

        <h3 className="text-sm font-bold text-white pt-2">1. Digital Nature of Service</h3>
        <p>
          Because the DateReady Personal Report (₹99) and related action blueprints are instant digital informational products delivered immediately upon payment, all purchases are generally <strong>non-refundable once access is delivered</strong>.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">2. Explicit Refund Exceptions</h3>
        <p>
          We will promptly issue a 100% refund under the following verified circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#9A9AB0]">
          <li><strong>Duplicate Charge:</strong> You were charged more than once for the same assessment transaction.</li>
          <li><strong>Failed Delivery:</strong> Your payment was debited but technical issues prevented delivery of your web report or access email within 24 hours of contacting support.</li>
          <li><strong>Gateway Error:</strong> The payment processor debited funds without generating a valid purchase record.</li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">3. How to Request a Refund</h3>
        <p>
          To request assistance or a refund under the exceptions above, email <strong>support@dateready.subix.in</strong> with your payment transaction ID or registered email. Inquiries are resolved within 1-2 business days.
        </p>
      </div>
    </div>
  );
}
