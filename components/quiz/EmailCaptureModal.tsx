"use client";

import React, { useState } from "react";
import { Mail, User, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmailCaptureModalProps {
  onSubmit: (data: { email: string; name: string }) => void;
  isLoading: boolean;
}

export const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [is18Plus, setIs18Plus] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!is18Plus) {
      setError("You must confirm you are 18 or older to view your assessment");
      return;
    }
    setError("");
    onSubmit({ email: email.trim().toLowerCase(), name: name.trim() });
  };

  return (
    <div className="px-5 py-8 flex flex-col justify-center min-h-[80dvh] animate-in fade-in zoom-in-95 duration-300">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4D8D]/20 to-[#7C5CFF]/20 border border-[#FF4D8D]/30 flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(255,77,141,0.2)]">
        <Sparkles className="w-7 h-7 text-[#FF4D8D]" />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
          Your Score Is Ready!
        </h2>
        <p className="text-sm text-[#9A9AB0] max-w-xs mx-auto">
          Where should we send your score breakdown and confidential report?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9AB0] mb-2">
            Email Address <span className="text-[#FF4D8D]">*</span>
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-[#9A9AB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              required
              className="w-full h-13 pl-11 pr-4 bg-[#14141F] border border-[#2A2A3D] rounded-xl text-base text-white placeholder-[#9A9AB0]/50 focus:outline-none focus:border-[#FF4D8D] focus:ring-1 focus:ring-[#FF4D8D] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A9AB0] mb-2">
            First Name <span className="text-xs text-[#9A9AB0] font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-[#9A9AB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul"
              className="w-full h-13 pl-11 pr-4 bg-[#14141F] border border-[#2A2A3D] rounded-xl text-base text-white placeholder-[#9A9AB0]/50 focus:outline-none focus:border-[#FF4D8D] focus:ring-1 focus:ring-[#FF4D8D] transition-colors"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={is18Plus}
              onChange={(e) => setIs18Plus(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#2A2A3D] text-[#FF4D8D] focus:ring-[#FF4D8D] accent-[#FF4D8D]"
            />
            <span className="text-xs text-[#9A9AB0] leading-relaxed select-none group-hover:text-[#F5F5FA] transition-colors">
              I confirm I am 18 years of age or older, and agree to receive my assessment result.
            </span>
          </label>
        </div>

        {error && (
          <p className="text-xs text-[#FF5C5C] font-medium bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 p-2.5 rounded-lg text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={<ArrowRight className="w-5 h-5" />}
          className="mt-3"
        >
          Show My Score
        </Button>

        <div className="flex items-center justify-center gap-2 pt-2 text-[12px] text-[#9A9AB0]">
          <ShieldCheck className="w-4 h-4 text-[#3DDC97]" />
          <span>100% Private & Confidential. No spam ever.</span>
        </div>
      </form>
    </div>
  );
};
