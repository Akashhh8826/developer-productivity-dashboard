"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function StatsOverview() {
  const { stats, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Active Projects */}
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects}
        subtext={`${stats.totalProjects} total repositories`}
        icon={FolderKanban}
        variant="brand"
      />

      {/* 2. Tasks Due Today */}
      <StatsCard
        title="Tasks Due Today"
        value={stats.tasksDueToday}
        subtext={stats.tasksDueToday > 0 ? "Requires review today" : "No urgent deadlines"}
        icon={Clock}
        variant="amber"
      />

      {/* 3. Completion Rate */}
      <StatsCard
        title="Completion Rate"
        value={`${stats.completionRate}%`}
        subtext={`${stats.completedTasks} of ${stats.totalTasks} tasks done`}
        icon={CheckCircle2}
        variant="emerald"
        trend={{
          value: "+12% sprint",
          positive: true,
        }}
      />

      {/* 4. Overdue Tasks */}
      <StatsCard
        title="Overdue Tasks"
        value={stats.overdueTasks}
        subtext={stats.overdueTasks === 0 ? "All tasks on schedule" : "Action required"}
        icon={AlertTriangle}
        variant={stats.overdueTasks > 0 ? "rose" : "default"}
      />
    </div>
  );
}
