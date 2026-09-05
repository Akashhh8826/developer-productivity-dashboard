"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PieChart, ArrowUpRight } from "lucide-react";

export function ProgressOverviewChart() {
  const { projects, stats, setSelectedProjectId } = useData();

  // SVG circular progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stats.completionRate / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <PieChart className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-base text-slate-900 dark:text-slate-100">
            Project Health & Progress Overview
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Live Sprint Sync
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: SVG Ring Chart with Summary */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-200 dark:text-slate-700 stroke-current"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-indigo-600 stroke-current transition-all duration-700 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {stats.completionRate}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Overall
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left lg:text-center space-y-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {stats.completedTasks} of {stats.totalTasks} Tasks Finished
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {stats.activeProjects} active engineering pipelines
            </p>
          </div>
        </div>

        {/* Right: Individual project progress bars */}
        <div className="lg:col-span-2 space-y-3.5">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="group p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {project.name}
                  </span>
                  <StatusBadge status={project.status} size="sm" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {project.progress}%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <ProgressBar progress={project.progress} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
