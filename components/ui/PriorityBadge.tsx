import React from "react";
import { TaskPriority } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, AlertCircle } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority | string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function PriorityBadge({
  priority,
  size = "md",
  showIcon = true,
  className,
}: PriorityBadgeProps) {
  const normalized = priority.toLowerCase();

  const getPriorityConfig = () => {
    switch (normalized) {
      case "urgent":
        return {
          label: "Urgent",
          bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          icon: <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />,
        };
      case "high":
        return {
          label: "High",
          bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
          icon: <ArrowUp className="w-3 h-3 text-orange-500 shrink-0" />,
        };
      case "medium":
        return {
          label: "Medium",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: <Minus className="w-3 h-3 text-amber-500 shrink-0" />,
        };
      case "low":
        return {
          label: "Low",
          bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
          icon: <ArrowDown className="w-3 h-3 text-slate-400 shrink-0" />,
        };
      default:
        return {
          label: priority,
          bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
          icon: <Minus className="w-3 h-3 text-slate-400 shrink-0" />,
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.bg,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}
