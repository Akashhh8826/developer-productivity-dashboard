"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

export function NeoStatsRow() {
  const { stats, projects } = useData();

  // Next deadline calculation
  const nearestProject = [...projects]
    .filter((p) => p.status !== "completed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const formattedDeadline = nearestProject
    ? new Date(nearestProject.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Aug 30, 2026";

  const statItems = [
    {
      label: "Total Projects",
      value: stats.totalProjects || 6,
      change: "+2 this month",
      icon: <FolderKanban className="w-5 h-5" />,
      colorClass: "stat-icon-1",
    },
    {
      label: "Total Tasks",
      value: stats.totalTasks || 48,
      change: "+5 this week",
      icon: <CheckSquare className="w-5 h-5" />,
      colorClass: "stat-icon-2",
    },
    {
      label: "Completed Tasks",
      value: stats.completedTasks || 24,
      change: "+12 this week",
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: "stat-icon-3",
    },
    {
      label: "Pending Tasks",
      value: stats.pendingTasks || (stats.totalTasks - stats.completedTasks),
      change: "+4 this week",
      icon: <Clock className="w-5 h-5" />,
      colorClass: "stat-icon-4",
    },
    {
      label: "Upcoming Deadlines",
      value: stats.upcomingDeadlines || 5,
      change: `Next: ${formattedDeadline}`,
      icon: <Calendar className="w-5 h-5" />,
      colorClass: "stat-icon-5",
    },
  ];


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="neo-card p-3.5 sm:p-4 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {item.label}
            </span>
            <div
              className={`p-1.5 sm:p-2 rounded-lg border border-slate-900 dark:border-slate-700 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] ${item.colorClass}`}
            >
              {item.icon}
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {item.value}
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">
              {item.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
