import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B0B12] px-5 py-8 max-w-sm mx-auto text-white">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A9AB0] hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-2xl font-bold font-display mb-2">Contact & Support</h1>
      <p className="text-xs text-[#9A9AB0] mb-6">We're here to help you get the most out of DateReady.</p>

      <div className="space-y-4 text-xs text-[#E0E0EC]">
        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#FF4D8D] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Customer Support</h4>
            <p className="text-[#9A9AB0] mt-0.5">support@dateready.subix.in</p>
            <p className="text-[#9A9AB0] text-[11px] mt-1">Average response time: &lt; 24 hours</p>
          </div>
        </div>

        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#7C5CFF] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Operating Hours</h4>
            <p className="text-[#9A9AB0] mt-0.5">Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
          </div>
        </div>

        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-[#3DDC97] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">Report Access Retrieval</h4>
            <p className="text-[#9A9AB0] mt-0.5">
              Lost your report link? Email us from the address you entered during assessment and we'll re-dispatch your link immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
