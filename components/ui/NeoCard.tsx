"use client";

import React, { ReactNode } from "react";

interface NeoCardProps {
  children: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  headerColor?: "coral" | "yellow" | "purple" | "mint" | "blue" | "slate" | "none";
  headerRight?: ReactNode;
  headerIcon?: ReactNode;
  className?: string;
  bodyClassName?: string;
  onClick?: () => void;
}

export function NeoCard({
  children,
  headerTitle,
  headerSubtitle,
  headerColor = "none",
  headerRight,
  headerIcon,
  className = "",
  bodyClassName = "p-5",
  onClick,
}: NeoCardProps) {
  const getHeaderColorClass = () => {
    switch (headerColor) {
      case "coral":
        return "bg-[#ff8585] text-slate-900 border-b-1.5 border-slate-900 dark:border-slate-700";
      case "yellow":
        return "bg-[#fcd34d] text-slate-900 border-b-1.5 border-slate-900 dark:border-slate-700";
      case "purple":
        return "bg-[#c084fc] text-slate-900 border-b-1.5 border-slate-900 dark:border-slate-700";
      case "mint":
        return "bg-[#6ee7b7] text-slate-900 border-b-1.5 border-slate-900 dark:border-slate-700";
      case "blue":
        return "bg-[#7dd3fc] text-slate-900 border-b-1.5 border-slate-900 dark:border-slate-700";
      case "slate":
        return "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b-1.5 border-slate-900 dark:border-slate-700";
      default:
        return "";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`neo-card overflow-hidden ${
        onClick ? "neo-card-interactive" : ""
      } ${className}`}
    >
      {headerTitle && (
        <div
          className={`px-4 py-2.5 flex items-center justify-between font-bold text-xs sm:text-sm tracking-wider uppercase ${getHeaderColorClass()}`}
        >
          <div className="flex items-center gap-2">
            {headerIcon && <span className="shrink-0">{headerIcon}</span>}
            <div>
              <span>{headerTitle}</span>
              {headerSubtitle && (
                <span className="block text-[10px] font-normal normal-case opacity-80">
                  {headerSubtitle}
                </span>
              )}
            </div>
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
