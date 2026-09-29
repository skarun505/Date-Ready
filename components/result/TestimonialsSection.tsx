"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Testimonial {
  name: string;
  ageCity: string;
  archetype: string;
  quote: string;
  highlight: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohit M.",
    ageCity: "26, Bangalore",
    archetype: "The Overthinker",
    quote:
      "I always assumed I had zero conversation skills because dates would stall. The report pointed out that my issue was actually resilience—I was taking 3-second pauses personally and frantically changing topics. The 7-day drill fixed that completely.",
    highlight: "Fixed my awkward silence anxiety in 3 days",
  },
  {
    name: "Karan S.",
    ageCity: "28, Mumbai",
    archetype: "The Developing",
    quote:
      "Best ₹99 I've spent. No pickup artist garbage, just honest communication psychology. The Statement Over Question drill stopped my dates from feeling like job interviews.",
    highlight: "Stopped my dates from feeling like interviews",
  },
  {
    name: "Vikram D.",
    ageCity: "24, Delhi NCR",
    archetype: "The Hesitant",
    quote:
      "The breakdown of why I hesitate to approach was eye-opening. Having the concrete 7-day action blueprint made it impossible to procrastinate. Already feeling way more comfortable in public spaces.",
    highlight: "Gave me concrete micro-habits that actually work",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="my-8 space-y-3.5">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-1.5">
          <CheckCircle2 className="w-3 h-3" />
          <span>Verified Reader Feedback</span>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Real Results From Real Men
        </h3>
        <p className="text-xs text-[#9A9AB0] mt-0.5">
          Over 4,200+ assessments taken across India
        </p>
      </div>

      <div className="space-y-3">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-4 space-y-2.5 transition-all hover:border-[#3D3D58]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4D8D]/30 to-[#7C5CFF]/30 border border-[#FF4D8D]/40 flex items-center justify-center text-xs font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-none">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-[#9A9AB0]">{t.ageCity}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-[#C5C5D8] leading-relaxed italic">
              "{t.quote}"
            </p>

            <div className="pt-1.5 border-t border-[#2A2A3D]/60 flex items-center justify-between text-[10px]">
              <span className="text-[#3DDC97] font-semibold">{t.highlight}</span>
              <span className="text-[#6A6A80] font-medium">{t.archetype}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#9A9AB0]">
        <ShieldCheck className="w-4 h-4 text-[#3DDC97]" />
        <span>100% Private & Confidential • Instant Web Access + PDF</span>
      </div>
    </section>
  );
};
