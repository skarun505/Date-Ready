import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B0B12] px-5 py-8 max-w-sm mx-auto text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A9AB0] hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-2xl font-bold font-display mb-2">Terms of Service</h1>
      <p className="text-xs text-[#9A9AB0] mb-6">Version: v1 • September 2026</p>

      <div className="space-y-4 text-xs text-[#E0E0EC] leading-relaxed">
        <h3 className="text-sm font-bold text-white pt-2">1. Acceptance of Terms</h3>
        <p>
          By accessing or using DateReady (dateready.subix.in), you agree to be bound by these Terms of Service. If you do not agree, do not use the service.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">2. Eligibility (18+ Requirement)</h3>
        <p>
          You must be at least 18 years of age to use this website and purchase any reports. By using this service, you warrant and represent that you are 18 or older.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">3. Educational & Self-Reflection Tool Only</h3>
        <p>
          DateReady is a communication habit and self-reflection assessment. It is <strong>NOT a psychological, psychiatric, clinical, or medical evaluation</strong>. The scores, profiles, and exercises provided are for personal self-improvement only.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">4. Digital Products & Instant Delivery</h3>
        <p>
          The DateReady Personal Report (₹99) and related guides are digital informational products delivered instantaneously online.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">5. Respect and Consent</h3>
        <p>
          All exercises and guidelines promote mutual respect, personal responsibility, and consent. We expressly forbid any manipulation, coercion, harassment, or unethical conduct.
        </p>
      </div>
    </div>
  );
}
