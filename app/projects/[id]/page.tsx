"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { formatDate } from "@/lib/utils";
import {
  Folder,
  ShoppingCart,
  Laptop,
  Smartphone,
  Megaphone,
  Gauge,
  BookOpen,
  CheckSquare,
  KeyRound,
  FileText,
  Activity,
  ArrowLeft,
  Trash2,
  Calendar,
  Layers,
} from "lucide-react";
import { ProjectNotesTab } from "@/components/projects/ProjectNotesTab";
import { ProjectCredentialsTab } from "@/components/projects/ProjectCredentialsTab";
import { ProjectTasksTab } from "@/components/projects/ProjectTasksTab";
import { ProjectActivityTab } from "@/components/projects/ProjectActivityTab";

export default function ProjectFullPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { projects, deleteProject } = useData();

  const [activeTab, setActiveTab] = useState<"tasks" | "credentials" | "notes" | "activity">("notes");

  const project = projects.find((p) => p.id === resolvedParams.id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Project Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested project does not exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="neo-btn bg-[#ff8585] text-slate-950 text-xs font-bold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const getProjectIcon = (iconName?: string) => {
    switch (iconName) {
      case "shopping-cart":
        return <ShoppingCart className="w-6 h-6" />;
      case "laptop":
        return <Laptop className="w-6 h-6" />;
      case "smartphone":
        return <Smartphone className="w-6 h-6" />;
      case "megaphone":
        return <Megaphone className="w-6 h-6" />;
      case "gauge":
        return <Gauge className="w-6 h-6" />;
      case "book-open":
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Folder className="w-6 h-6" />;
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${project.name}"?`)) {
      deleteProject(project.id);
      router.push("/projects");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back to Projects Button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-600 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Main Project Header matching Image 3 */}
      <div className="neo-card p-6 space-y-6 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 rounded-2xl border border-slate-900 dark:border-slate-700 bg-yellow-200 text-slate-950 font-black shadow-[2px_2px_0px_rgba(0,0,0,0.9)] shrink-0">
              {getProjectIcon(project.icon)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                  {project.name}
                </h1>
                <span className="text-rose-500 font-mono font-bold text-xl">\ \ \</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <div className="neo-card px-3 py-1.5 flex items-center gap-2 bg-white dark:bg-slate-900 text-xs font-bold">
              <span className="text-slate-500">Progress</span>
              <span className="font-mono text-rose-500 font-black">
                {project.progress}%
              </span>
            </div>

            <div className="neo-card px-3 py-1.5 flex items-center gap-2 bg-white dark:bg-slate-900 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Due {formatDate(project.dueDate)}</span>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs matching Image 3 */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-[#ff8585] text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "credentials"
                ? "bg-[#fcd34d] text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "notes"
                ? "bg-[#ff8585] text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "activity"
                ? "bg-[#c084fc] text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)]"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </button>
        </div>

        {/* Tab View */}
        <div className="pt-2">
          {activeTab === "notes" && <ProjectNotesTab project={project} />}
          {activeTab === "credentials" && <ProjectCredentialsTab project={project} />}
          {activeTab === "tasks" && <ProjectTasksTab project={project} />}
          {activeTab === "activity" && <ProjectActivityTab project={project} />}
        </div>
      </div>
    </div>
  );
}
