"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { NeoCard } from "@/components/ui/NeoCard";
import { CheckCircle2, TrendingUp } from "lucide-react";

export function TaskProgressCard() {
  const { stats } = useData();

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stats.completionRate / 100) * circumference;

  return (
    <NeoCard
      headerTitle="Task Progress"
      headerColor="yellow"
      headerIcon={<CheckCircle2 className="w-4 h-4" />}
      className="h-full flex flex-col justify-between"
      bodyClassName="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        {/* Circular Progress Meter */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="11"
              fill="transparent"
            />
            {/* Animated Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#f59e0b"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {stats.completionRate}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
            Overall Completion
          </span>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </p>
        </div>
      </div>

      {/* Velocity footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sprint Velocity</span>
        </span>
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
          +12 tasks this week
        </span>
      </div>
    </NeoCard>
  );
}
