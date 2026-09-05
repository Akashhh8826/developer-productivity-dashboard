import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  // Color coding by range: <30% red, 30-70% yellow/amber, >70% green/emerald
  const getColorClass = (val: number) => {
    if (val < 30) return "bg-rose-500";
    if (val <= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getTrackHeight = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "lg":
        return "h-3";
      default:
        return "h-2";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="text-slate-500 font-medium">Progress</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden",
          getTrackHeight()
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getColorClass(clamped)
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
