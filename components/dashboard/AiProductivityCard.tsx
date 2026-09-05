"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { NeoCard } from "@/components/ui/NeoCard";
import { Sparkles, ArrowUpRight, RefreshCw } from "lucide-react";

export function AiProductivityCard() {
  const { stats, tasks } = useData();
  const [insightIndex, setInsightIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const insights = [
    {
      title: "You're doing great!",
      message: `You've completed ${stats.completedTasks} tasks with a ${stats.completionRate}% sprint finish rate. Your velocity is 28% higher than last sprint!`,
    },
    {
      title: "High Focus Efficiency!",
      message: `You have ${stats.pendingTasks} pending tasks in flight. Triage high-priority backlog items today to sustain delivery velocity.`,
    },
    {
      title: "Clean Release Cadence!",
      message: `Zero critical blockage detected across your ${stats.activeProjects} active repositories. Excellent milestone pacing!`,
    },
  ];

  const handleNextInsight = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
      setIsRefreshing(false);
    }, 250);
  };

  const currentInsight = insights[insightIndex];

  // Weekly bar data
  const weeklyData = [
    { day: "M", height: "45%", color: "bg-[#fcd34d]" },
    { day: "T", height: "70%", color: "bg-[#6ee7b7]" },
    { day: "W", height: "60%", color: "bg-[#7dd3fc]" },
    { day: "T", height: "85%", color: "bg-[#c084fc]" },
    { day: "F", height: "100%", color: "bg-[#ff8585]" },
  ];

  return (
    <NeoCard
      headerTitle="AI Productivity Insight"
      headerColor="coral"
      headerIcon={<Sparkles className="w-4 h-4" />}
      headerRight={
        <button
          type="button"
          onClick={handleNextInsight}
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-600 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] cursor-pointer hover:bg-slate-50 transition-transform active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>New Tip</span>
        </button>
      }
      className="h-full flex flex-col justify-between"
      bodyClassName="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4"
    >
      {/* Insight Highlight Box */}
      <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {currentInsight.title}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {currentInsight.message}
        </p>
      </div>

      {/* Interactive Bar Chart + Sparkline Graphic */}
      <div className="pt-2 flex items-end justify-between gap-4">
        {/* Velocity Bars */}
        <div className="flex items-end gap-2.5 h-16">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-4 sm:w-5 rounded-t-md border border-slate-900 dark:border-slate-700 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] ${item.color} transition-all duration-500`}
                style={{ height: item.height }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Upward Trend Line */}
        <div className="flex-1 flex flex-col items-end justify-end space-y-1">
          <div className="relative w-full max-w-[140px] h-12 flex items-center justify-center">
            <svg viewBox="0 0 140 48" className="w-full h-full overflow-visible">
              <path
                d="M 5,42 Q 40,38 70,22 T 135,6"
                fill="none"
                stroke="#18181b"
                className="dark:stroke-slate-200"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Trend Arrow Head */}
              <circle
                cx="135"
                cy="6"
                r="4"
                fill="#ff8585"
                stroke="#18181b"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <span>+28% Sprint Pacing</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </span>
        </div>
      </div>
    </NeoCard>
  );
}
