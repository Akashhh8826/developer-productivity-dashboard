"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { NeoCard } from "@/components/ui/NeoCard";
import { Activity, Plus, CheckCircle2, Calendar, FileText, KeyRound } from "lucide-react";

export function RecentActivityCard() {
  const { activity, setSelectedProjectId } = useData();

  const getActivityIcon = (type: string, color?: string) => {
    switch (type) {
      case "project_created":
        return <Plus className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case "task_completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "deadline_updated":
        return <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "note_added":
        return <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case "credential_updated":
        return <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />;
    }
  };

  const getBadgeBg = (badgeColor?: string) => {
    switch (badgeColor) {
      case "coral":
        return "bg-[#ffe3e3] dark:bg-rose-950/60 border-rose-300 dark:border-rose-800";
      case "yellow":
        return "bg-[#fef9c3] dark:bg-yellow-950/60 border-yellow-300 dark:border-yellow-800";
      case "purple":
        return "bg-[#f3e8ff] dark:bg-purple-950/60 border-purple-300 dark:border-purple-800";
      case "green":
        return "bg-[#d1fae5] dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800";
      case "blue":
      default:
        return "bg-[#e0f2fe] dark:bg-blue-950/60 border-blue-300 dark:border-blue-800";
    }
  };

  return (
    <NeoCard
      headerTitle="Recent Activity"
      headerColor="purple"
      headerIcon={<Activity className="w-4 h-4" />}
      headerRight={
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-900 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] cursor-pointer hover:bg-slate-50 transition-colors">
          Live Stream
        </span>
      }
      className="h-full flex flex-col justify-between"
      bodyClassName="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3"
    >
      <div className="space-y-3">
        {activity.slice(0, 4).map((item, idx) => (
          <div
            key={`${item.id || "act"}-${idx}`}
            onClick={() => item.projectId && setSelectedProjectId(item.projectId)}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2 rounded-lg border shrink-0 ${getBadgeBg(
                  item.badgeColor
                )}`}
              >
                {getActivityIcon(item.type, item.badgeColor)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.description}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {item.timeAgo}
            </span>
          </div>
        ))}

        {activity.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            No recent activity recorded
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Automatic telemetry audit log</span>
        <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
          {activity.length} Total Events
        </span>
      </div>
    </NeoCard>
  );
}
