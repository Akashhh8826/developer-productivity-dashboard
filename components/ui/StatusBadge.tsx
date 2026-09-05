import React from "react";
import { ProjectStatus, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus | string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const getStatusStyles = () => {
    switch (normalizedStatus) {
      // Task Statuses
      case "done":
      case "completed":
        return {
          label: normalizedStatus === "done" ? "Done" : "Completed",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-500",
        };
      case "in-progress":
      case "active":
        return {
          label: normalizedStatus === "in-progress" ? "In Progress" : "Active",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          dot: "bg-blue-500",
        };
      case "todo":
        return {
          label: "To Do",
          bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
          dot: "bg-slate-400",
        };
      case "on-hold":
        return {
          label: "On Hold",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          dot: "bg-amber-500",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getStatusStyles();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.bg,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
