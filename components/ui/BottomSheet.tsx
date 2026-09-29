"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div
        className="relative w-full max-w-[480px] bg-[#14141F] border-t border-[#2A2A3D] rounded-t-3xl p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl z-10 animate-in slide-in-from-bottom duration-200"
      >
        <div className="w-12 h-1.5 bg-[#2A2A3D] rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-4">
          {title ? (
            <h3 className="text-lg font-bold text-[#F5F5FA] font-display">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1C1C2B] text-[#9A9AB0] hover:text-[#F5F5FA] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
