"use client";

import React from "react";
import { Check } from "lucide-react";

interface OptionButtonProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  id,
  text,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`
        w-full min-h-[58px] p-4 text-left rounded-2xl transition-all duration-200
        flex items-center justify-between gap-3 text-base font-medium select-none
        border relative active:scale-[0.985] cursor-pointer
        ${
          isSelected
            ? "bg-[#1C1C2B] border-[#FF4D8D] text-white shadow-[0_0_20px_rgba(255,77,141,0.25)] ring-1 ring-[#FF4D8D]"
            : "bg-[#14141F] border-[#2A2A3D] text-[#E0E0EC] hover:bg-[#1C1C2B] hover:border-[#3D3D58]"
        }
      `}
    >
      <div className="flex items-center gap-3.5 pr-2">
        <span
          className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-colors shrink-0
            ${
              isSelected
                ? "bg-gradient-to-r from-[#FF4D8D] to-[#7C5CFF] text-white"
                : "bg-[#1C1C2B] text-[#9A9AB0] border border-[#2A2A3D]"
            }
          `}
        >
          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : id}
        </span>
        <span className="leading-snug text-[15px] sm:text-[16px]">{text}</span>
      </div>
    </button>
  );
};
