"use client";

import React from "react";
import {
  Calendar,
  ArrowRight,
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

interface ProjectListRowProps {
  project: Project;
}

export function ProjectListRow({ project }: ProjectListRowProps) {
  const { setSelectedProjectId } = useData();

  const getProjectIcon = (iconName?: string) => {
    switch (iconName) {
      case "shopping-cart":
        return <ShoppingCart className="w-4 h-4" />;
      case "laptop":
        return <Laptop className="w-4 h-4" />;
      case "smartphone":
        return <Smartphone className="w-4 h-4" />;
      case "megaphone":
        return <Megaphone className="w-4 h-4" />;
      case "gauge":
        return <Gauge className="w-4 h-4" />;
      case "book-open":
        return <BookOpen className="w-4 h-4" />;
      case "bot":
        return <Bot className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "cloud":
        return <Cloud className="w-4 h-4" />;
      case "shield":
        return <Shield className="w-4 h-4" />;
      case "layers":
        return <Layers className="w-4 h-4" />;
      case "gamepad":
        return <Gamepad2 className="w-4 h-4" />;
      case "terminal":
        return <Terminal className="w-4 h-4" />;
      case "server":
        return <Server className="w-4 h-4" />;
      case "cpu":
        return <Cpu className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
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

  return (
    <div
      onClick={() => setSelectedProjectId(project.id)}
      className="group neo-card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 cursor-pointer hover:border-slate-900 dark:hover:border-slate-500 transition-all"
    >
      {/* Left: Icon, Title & Date Info */}
      <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
        <div className="p-2.5 rounded-xl border border-slate-900 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] text-slate-900 dark:text-slate-100 shrink-0">
          {getProjectIcon(project.icon)}
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors truncate">
            {project.name}
          </h4>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
            Due {formatDate(project.dueDate)} {project.updatedAt ? `• Updated ${project.updatedAt}` : ""}
          </p>
        </div>
      </div>

      {/* Middle: Status Tag + Progress Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <span
          className={`shrink-0 px-2.5 py-0.5 text-[10px] font-black rounded-md border tracking-wider ${statusInfo.bg}`}
        >
          {statusInfo.label}
        </span>

        {/* Linear Progress Bar */}
        <div className="flex-1 flex items-center gap-2.5">
          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 overflow-hidden">
            <div
              className={`h-full ${statusInfo.barColor} transition-all duration-500`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 shrink-0 min-w-8 text-right">
            {project.progress}%
          </span>
        </div>
      </div>

      {/* Right: Arrow button */}
      <div className="shrink-0 flex items-center justify-end">
        <span className="p-1.5 rounded-lg border border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-[1px_1px_0px_rgba(0,0,0,0.9)] group-hover:translate-x-0.5 transition-transform flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-slate-900 dark:text-slate-100" />
        </span>
      </div>
    </div>
  );
}
