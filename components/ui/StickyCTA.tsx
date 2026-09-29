"use client";

import React from "react";

interface StickyCTAProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({
  children,
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center`}
    >
      <div
        className={`w-full max-w-[480px] pointer-events-auto bg-[#0B0B12]/92 backdrop-blur-xl border-t border-[#2A2A3D]/80 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.6)] ${className}`}
      >
        {children}
        {subtitle && (
          <p className="text-center text-[12px] text-[#9A9AB0] mt-2 font-medium tracking-tight">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
