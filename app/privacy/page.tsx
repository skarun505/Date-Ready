import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B0B12] px-5 py-8 max-w-sm mx-auto text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A9AB0] hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-2xl font-bold font-display mb-2">Privacy Policy</h1>
      <p className="text-xs text-[#9A9AB0] mb-6">Last updated: September 2026</p>

      <div className="space-y-4 text-xs text-[#E0E0EC] leading-relaxed">
        <p>
          DateReady ("we", "our", or "us"), operated under Subix, is dedicated to protecting your privacy. This policy outlines how we collect, handle, and protect your information.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">1. Information We Collect</h3>
        <p>
          We only collect:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[#9A9AB0]">
          <li>Your quiz responses and computed dimension scores</li>
          <li>Your email address (to deliver your score and report link)</li>
          <li>Your optional first name</li>
          <li>Basic campaign attribution parameters (UTM parameters, referral sources)</li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">2. How We Use Your Data</h3>
        <p>
          Your data is used solely to calculate your dating confidence score, generate your personalized 7-day action report, and send transaction confirmation emails.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">3. Zero Data Selling</h3>
        <p>
          We never sell, rent, or trade your personal information to third parties or advertisers.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">4. Data Deletion</h3>
        <p>
          You have the right under applicable data protection frameworks (including India's DPDP Act) to request permanent deletion of your assessment and email by writing to support@dateready.subix.in.
        </p>
      </div>
    </div>
  );
}
