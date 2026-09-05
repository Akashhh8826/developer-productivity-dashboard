"use client";

import React from "react";
import { Project } from "@/types";
import { useData } from "@/context/DataContext";
import { Activity, Clock, Plus, CheckCircle2, FileText, KeyRound } from "lucide-react";

interface ProjectActivityTabProps {
  project: Project;
}

export function ProjectActivityTab({ project }: ProjectActivityTabProps) {
  const { activity } = useData();

  const projectActivities = activity.filter(
    (a) => !a.projectId || a.projectId === project.id
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Project Event History ({projectActivities.length})
        </span>
      </div>

      <div className="neo-card p-5 space-y-4 bg-white dark:bg-slate-900">
        {projectActivities.map((act, idx) => (
          <div
            key={`${act.id || "act"}-${idx}`}
            className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
          >
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                  {act.title}
                </h4>
                <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">
                  {act.timeAgo}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {act.description}
              </p>
            </div>
          </div>
        ))}

        {projectActivities.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">
            No logged activity events for this project yet.
          </p>
        )}
      </div>
    </div>
  );
}
