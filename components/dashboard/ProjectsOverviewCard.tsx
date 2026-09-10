"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { NeoCard } from "@/components/ui/NeoCard";
import { PieChart, ChevronDown } from "lucide-react";

export function ProjectsOverviewCard() {
  const { projects } = useData();
  const [filterPeriod, setFilterPeriod] = useState("This Month");

  const inProgressCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const onHoldCount = projects.filter((p) => p.status === "on-hold").length;
  const planningCount = projects.filter((p) => p.status === "planning").length;
  const total = projects.length || 1;

  // Donut chart arc calculations
  const categories = [
    { label: "In Progress", count: inProgressCount, color: "#ff8585" },
    { label: "Completed", count: completedCount, color: "#6ee7b7" },
    { label: "On Hold", count: onHoldCount, color: "#c084fc" },
    { label: "Planning", count: planningCount, color: "#fcd34d" },
  ];

  const totalValue = categories.reduce((acc, c) => acc + c.count, 0) || 1;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <NeoCard
      headerTitle="Projects Overview"
      headerColor="coral"
      headerIcon={<PieChart className="w-4 h-4" />}
      headerRight={
        <div className="relative inline-block">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="text-[11px] font-black bg-[#fbbf24] text-slate-900 border border-slate-900 rounded-md px-2 py-0.5 pr-5 appearance-none focus:outline-none cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,0.9)] hover:bg-[#f59e0b] transition-colors"
          >
            <option value="This Month">This Month</option>
            <option value="All Time">All Time</option>
            <option value="This Sprint">This Sprint</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      }
      className="h-full flex flex-col justify-between"
      bodyClassName="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Base track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Slices */}
            {categories.map((cat, idx) => {
              if (cat.count === 0) return null;
              const percent = (cat.count / totalValue) * 100;
              const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += percent;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={cat.color}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-500 ease-out hover:opacity-80"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {projects.length}
            </span>
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">
              Projects
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-2 text-xs font-semibold">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-900 dark:border-slate-600"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 dark:text-slate-300">
                  {cat.label}
                </span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Pill */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-600 dark:text-slate-400">
          Total Pipelines
        </span>
        <span className="font-mono font-extrabold px-2.5 py-0.5 rounded-full border brand-pill">
          {projects.length} Active Workspaces
        </span>
      </div>
    </NeoCard>
  );
}
