"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Trash2,
  ShoppingCart,
  Laptop,
  Smartphone,
  Megaphone,
  Gauge,
  BookOpen,
  Folder,
  Bot,
  Database,
  Cloud,
  Shield,
  Layers,
  Gamepad2,
  Terminal,
  Server,
  Cpu,
} from "lucide-react";
import { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { useData } from "@/context/DataContext";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { setSelectedProjectId, deleteProject } = useData();
  const [isDeleting, setIsDeleting] = useState(false);

  const getProjectIcon = (iconName?: string) => {
    switch (iconName) {
      case "shopping-cart":
        return <ShoppingCart className="w-5 h-5" />;
      case "laptop":
        return <Laptop className="w-5 h-5" />;
      case "smartphone":
        return <Smartphone className="w-5 h-5" />;
      case "megaphone":
        return <Megaphone className="w-5 h-5" />;
      case "gauge":
        return <Gauge className="w-5 h-5" />;
      case "book-open":
        return <BookOpen className="w-5 h-5" />;
      case "bot":
        return <Bot className="w-5 h-5" />;
      case "database":
        return <Database className="w-5 h-5" />;
      case "cloud":
        return <Cloud className="w-5 h-5" />;
      case "shield":
        return <Shield className="w-5 h-5" />;
      case "layers":
        return <Layers className="w-5 h-5" />;
      case "gamepad":
        return <Gamepad2 className="w-5 h-5" />;
      case "terminal":
        return <Terminal className="w-5 h-5" />;
      case "server":
        return <Server className="w-5 h-5" />;
      case "cpu":
        return <Cpu className="w-5 h-5" />;
      default:
        return <Folder className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "IN PROGRESS",
          bg: "bg-[#ffe3e3] dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
          barColor: "progress-brand",
        };
      case "completed":
        return {
          label: "COMPLETED",
          bg: "bg-[#d1fae5] dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          barColor: "bg-[#6ee7b7]",
        };
      case "planning":
        return {
          label: "PLANNING",
          bg: "bg-[#f3e8ff] dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
          barColor: "bg-[#c084fc]",
        };
      case "on-hold":
      default:
        return {
          label: "ON HOLD",
          bg: "bg-[#fef9c3] dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800",
          barColor: "bg-[#fcd34d]",
        };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${project.name}"?\n\nThis will permanently remove the project and its sprint tasks, notes, and credentials.`
      )
    ) {
      setIsDeleting(true);
      deleteProject(project.id);
    }
  };

  return (
    <div
      onClick={() => setSelectedProjectId(project.id)}
      className={`group neo-card p-5 flex flex-col justify-between cursor-pointer relative transition-all duration-150 ${
        isDeleting ? "opacity-0 scale-95" : ""
      }`}
    >
      <div>
        {/* Top Icon & Title Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl border border-slate-900 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] text-slate-900 dark:text-slate-100 shrink-0">
              {getProjectIcon(project.icon)}
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors truncate">
                {project.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                {project.taskCount} tasks • {project.techStack.slice(0, 2).join(", ")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Pill & Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border tracking-wider ${statusInfo.bg}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-slate-100">
              {project.progress}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 overflow-hidden">
            <div
              className={`h-full ${statusInfo.barColor} transition-all duration-500`}
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
            {project.completedTaskCount || 0}/{project.taskCount} tasks completed
          </p>
        </div>
      </div>

      {/* Card Footer: Due Date, Updated tag, and Open Arrow */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Due {formatDate(project.dueDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          {project.updatedAt && (
            <span className="text-[10px] text-slate-400 font-medium">
              Updated {project.updatedAt}
            </span>
          )}
          <span className="p-1.5 rounded-lg border border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] group-hover:translate-x-0.5 transition-transform flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
          </span>
        </div>
      </div>
    </div>
  );
});
