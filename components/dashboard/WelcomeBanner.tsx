"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function WelcomeBanner() {
  const { user, stats } = useData();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20 mb-8">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200 border border-white/10">
            <Calendar className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || "Developer"} 👋
          </h1>

          <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
            You have <strong className="text-white font-semibold">{stats.activeProjects} active projects</strong> and{" "}
            <strong className="text-white font-semibold">{stats.tasksDueToday} tasks due today</strong>. Overall sprint progress is currently at{" "}
            <strong className="text-emerald-300 font-semibold">{stats.completionRate}%</strong>.
          </p>
        </div>

        {/* Quick link button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-semibold text-xs sm:text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <span>Review Active Tasks</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <span>All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
