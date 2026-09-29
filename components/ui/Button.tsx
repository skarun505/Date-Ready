"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "brand",
      size = "lg",
      fullWidth = false,
      isLoading = false,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40";

    const variantStyles = {
      brand:
        "bg-gradient-to-r from-[#FF4D8D] to-[#7C5CFF] text-white shadow-[0_4px_24px_rgba(255,77,141,0.35)] hover:shadow-[0_6px_28px_rgba(255,77,141,0.45)] hover:brightness-105",
      secondary:
        "bg-[#1C1C2B] text-[#F5F5FA] border border-[#2A2A3D] hover:bg-[#242438] hover:border-[#3D3D58]",
      outline:
        "bg-transparent text-[#F5F5FA] border border-[#2A2A3D] hover:border-[#FF4D8D]/50 hover:bg-[#14141F]",
      ghost:
        "bg-transparent text-[#9A9AB0] hover:text-[#F5F5FA] hover:bg-[#1C1C2B]/50",
      danger:
        "bg-[#FF5C5C]/15 text-[#FF5C5C] border border-[#FF5C5C]/30 hover:bg-[#FF5C5C]/25",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-xs font-medium rounded-xl gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-6 text-base rounded-2xl gap-2.5", // minimum 48px touch target
      xl: "h-15 px-8 text-lg rounded-2xl gap-3 font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
