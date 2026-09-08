"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { NeoCard } from "@/components/ui/NeoCard";
import { Calendar, ArrowRight } from "lucide-react";

export function UpcomingDeadlinesCard() {
  const { tasks, projects, setSelectedProjectId } = useData();

  // Combine projects and non-completed tasks sorted by due date
  const deadlines = [
    ...projects.map((p) => ({
      id: p.id,
      title: p.name,
      type: "project" as const,
      dueDate: p.dueDate,
      status: p.status,
      projectId: p.id,
      color: "coral" as const,
    })),
    ...tasks
      .filter((t) => t.status !== "done")
      .map((t) => ({
        id: t.id,
        title: t.title,
        type: "task" as const,
        dueDate: t.dueDate,
        status: t.status,
        projectId: t.projectId,
        color: t.priority === "urgent" ? "coral" : t.priority === "high" ? "yellow" : "purple",
      })),
  ]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <NeoCard
      headerTitle="Upcoming Deadlines"
      headerColor="purple"
      headerIcon={<Calendar className="w-4 h-4" />}
      className="h-full flex flex-col justify-between"
      bodyClassName="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3"
    >
      <div className="space-y-2.5">
        {deadlines.map((item, idx) => (
          <div
            key={`${item.type}-${item.id}-${idx}`}
            onClick={() => setSelectedProjectId(item.projectId)}
            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {item.title}
              </span>
            </div>

            <span className="shrink-0 px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {formatShortDate(item.dueDate)}
            </span>
          </div>
        ))}

        {deadlines.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            No upcoming deadlines
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          5 impending targets
        </span>
        <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
          <span>Sprint Schedule</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </NeoCard>
  );
}
