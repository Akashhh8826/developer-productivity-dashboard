"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { NeoStatsRow } from "@/components/dashboard/NeoStatsRow";
import { ProjectsOverviewCard } from "@/components/dashboard/ProjectsOverviewCard";
import { TaskProgressCard } from "@/components/dashboard/TaskProgressCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { AiProductivityCard } from "@/components/dashboard/AiProductivityCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { Plus, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user } = useData();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header matching Reference Image 4/5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>DASHBOARD</span>
              <span className="text-rose-500 font-mono tracking-widest text-lg sm:text-xl font-bold opacity-80">
                \ \ \
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>

        {/* Action Button: + New Project */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCreateProjectOpen(true)}
            className="neo-btn bg-[#ff8585] text-slate-950 hover:bg-[#ff7070] text-xs font-black shadow-neo uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5-Card Stats Overview Row */}
      <NeoStatsRow />

      {/* 3. Middle 3-Column Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <ProjectsOverviewCard />
        <TaskProgressCard />
        <UpcomingDeadlinesCard />
      </div>

      {/* 4. Bottom 2-Column Widget Grid: Recent Activity + AI Productivity Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <RecentActivityCard />
        <AiProductivityCard />
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </div>
  );
}
