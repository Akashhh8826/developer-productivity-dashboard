import React, { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "brand" | "emerald" | "amber" | "rose";
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export const StatsCard = memo(function StatsCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "brand":
        return "bg-brand-500/10 text-brand-600 dark:text-brand-400";
      case "emerald":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "amber":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "rose":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 smooth-gpu",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg shrink-0", getVariantStyles())}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              trend.positive
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
});
