"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
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
  Plus,
  Settings,
  Trash2,
  Calendar,
  Layers,
  Bot,
  Database,
  Cloud,
  Shield,
  Gamepad2,
  Terminal,
  Server,
  Cpu,
  ChevronDown,
} from "lucide-react";
import { ProjectNotesTab } from "./ProjectNotesTab";
import { ProjectCredentialsTab } from "./ProjectCredentialsTab";
import { ProjectTasksTab } from "./ProjectTasksTab";
import { ProjectActivityTab } from "./ProjectActivityTab";

export function ProjectDetailModal() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    deleteProject,
    updateProjectStatus,
    addActivity,
  } = useData();

  const [activeTab, setActiveTab] = useState<"tasks" | "credentials" | "notes" | "activity">("notes");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const project = projects.find((p) => p.id === selectedProjectId);

  if (!project) return null;

  const handleStatusChange = (newStatus: string) => {
    updateProjectStatus(project.id, newStatus as any);
    addActivity({
      type: "deadline_updated",
      title: `Status changed to "${newStatus.replace("-", " ")}"`,
      description: `Project "${project.name}" status was manually updated.`,
      projectId: project.id,
      projectName: project.name,
      badgeColor: "purple",
    });
  };

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
      case "bot":
        return <Bot className="w-6 h-6" />;
      case "database":
        return <Database className="w-6 h-6" />;
      case "cloud":
        return <Cloud className="w-6 h-6" />;
      case "shield":
        return <Shield className="w-6 h-6" />;
      case "layers":
        return <Layers className="w-6 h-6" />;
      case "gamepad":
        return <Gamepad2 className="w-6 h-6" />;
      case "terminal":
        return <Terminal className="w-6 h-6" />;
      case "server":
        return <Server className="w-6 h-6" />;
      case "cpu":
        return <Cpu className="w-6 h-6" />;
      default:
        return <Folder className="w-6 h-6" />;
    }
  };

  const handleDeleteProject = () => {
    if (
      confirm(
        `Are you sure you want to permanently delete "${project.name}" and all its tasks, credentials, and notes?`
      )
    ) {
      deleteProject(project.id);
      setSelectedProjectId(null);
    }
  };

  return (
    <Modal
      isOpen={Boolean(selectedProjectId)}
      onClose={() => setSelectedProjectId(null)}
      title=""
      description=""
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* 1. Main Project Header matching Image 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl border border-slate-900 dark:border-slate-700 bg-yellow-200 text-slate-950 font-black shadow-[2px_2px_0px_rgba(0,0,0,0.9)] shrink-0">
              {getProjectIcon(project.icon)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                  {project.name}
                </h2>
                <span className="text-brand-accent font-mono font-bold">\ \ \</span>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                {project.description}
              </p>
            </div>
          </div>

          {/* Right Status & Metric Badges */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
            {/* Progress Badge */}
            <div className="neo-card px-3 py-1.5 flex items-center gap-2 bg-white dark:bg-slate-900 text-xs font-bold">
              <span className="text-slate-500">Progress</span>
              <span className="font-mono text-brand-accent font-black">
                {project.progress}%
              </span>
            </div>

            {/* Due Date Badge */}
            <div className="neo-card px-3 py-1.5 flex items-center gap-2 bg-white dark:bg-slate-900 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(project.dueDate)}</span>
            </div>

            {/* Status Selector Dropdown */}
            <div className="relative">
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`appearance-none text-xs font-black rounded-lg border px-3 py-1.5 pr-7 cursor-pointer focus:outline-none transition-colors ${
                  project.status === "active"
                    ? "bg-[#ffe3e3] dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    : project.status === "completed"
                    ? "bg-[#d1fae5] dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : project.status === "planning"
                    ? "bg-[#f3e8ff] dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800"
                    : "bg-[#fef9c3] dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800"
                }`}
              >
                <option value="active">IN PROGRESS</option>
                <option value="planning">PLANNING</option>
                <option value="completed">COMPLETED</option>
                <option value="on-hold">ON HOLD</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* Project Settings / Delete Action */}
            <button
              type="button"
              onClick={handleDeleteProject}
              className="p-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Sub-Navigation Tabs matching Image 3 */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "brand-selected font-extrabold flex items-center gap-1.5"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "credentials"
                ? "brand-selected font-extrabold flex items-center gap-1.5"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "notes"
                ? "brand-selected font-extrabold flex items-center gap-1.5"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "activity"
                ? "brand-selected font-extrabold flex items-center gap-1.5"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity</span>
          </button>
        </div>

        {/* 3. Tab Content View */}
        <div className="pt-2">
          {activeTab === "notes" && <ProjectNotesTab project={project} />}
          {activeTab === "credentials" && <ProjectCredentialsTab project={project} />}
          {activeTab === "tasks" && <ProjectTasksTab project={project} />}
          {activeTab === "activity" && <ProjectActivityTab project={project} />}
        </div>
      </div>
    </Modal>
  );
}
