"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, CheckCircle, MessageSquare } from "lucide-react";

interface DayItem {
  day: number;
  action: string;
  time: string;
  reflection: string;
}

interface DayPlanAccordionProps {
  days: DayItem[];
}

export const DayPlanAccordion: React.FC<DayPlanAccordionProps> = ({ days }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});

  const toggleDayCompletion = (dayNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  return (
    <div className="space-y-3">
      {days.map((d) => {
        const isOpen = activeDay === d.day;
        const isDone = !!completedDays[d.day];

        return (
          <div
            key={d.day}
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              isDone
                ? "bg-[#14141F] border-emerald-500/30"
                : isOpen
                ? "bg-[#1C1C2B] border-[#FF4D8D]/40 shadow-[0_4px_20px_rgba(255,77,141,0.15)]"
                : "bg-[#14141F] border-[#2A2A3D] hover:border-[#3D3D58]"
            }`}
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer select-none"
              onClick={() => setActiveDay(isOpen ? 0 : d.day)}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => toggleDayCompletion(d.day, e)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-black shadow-sm"
                      : "bg-[#14141F] border-[#2A2A3D] text-[#9A9AB0] hover:border-[#FF4D8D]"
                  }`}
                  aria-label={`Mark Day ${d.day} done`}
                >
                  {isDone ? <CheckCircle className="w-4 h-4" /> : `D${d.day}`}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">
                      Day {d.day}
                    </span>
                    <span className="text-[11px] text-[#9A9AB0]">• {d.time}</span>
                  </div>
                  <h4
                    className={`text-sm font-semibold transition-colors line-clamp-1 ${
                      isDone ? "text-emerald-400 line-through opacity-80" : "text-white"
                    }`}
                  >
                    {d.action}
                  </h4>
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#9A9AB0] transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-[#2A2A3D]/40 text-xs sm:text-[13px] space-y-3">
                <div className="bg-[#14141F] rounded-xl p-3.5 border border-[#2A2A3D]/60">
                  <span className="text-white font-semibold block mb-1">Today's Micro-Action:</span>
                  <p className="text-[#E0E0EC] leading-relaxed">{d.action}</p>
                </div>

                <div className="flex items-start gap-2 bg-[#1C1C2B] rounded-xl p-3 border border-[#2A2A3D]/30 text-[#9A9AB0]">
                  <MessageSquare className="w-4 h-4 text-[#7C5CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#7C5CFF] font-semibold block text-[11px] uppercase tracking-wider mb-0.5">
                      Evening Reflection:
                    </span>
                    <p className="italic text-[#9A9AB0]">{d.reflection}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
