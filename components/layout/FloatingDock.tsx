"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/context/DataContext";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  KeyRound,
  Sparkles,
  Sun,
  Moon,
  Plus,
} from "lucide-react";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";

export function FloatingDock() {
  const pathname = usePathname();
  const { mode, toggleMode } = useData();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === "/",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: <FolderKanban className="w-4 h-4" />,
      active: pathname.startsWith("/projects"),
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      active: pathname.startsWith("/tasks"),
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-4">
        <div className="neo-dock pointer-events-auto p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 shadow-2xl transition-all duration-200">
          {/* Main Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`p-2 sm:p-2.5 rounded-full transition-all flex items-center justify-center relative group cursor-pointer ${
                item.active
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] scale-105"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.icon}
              {/* Tooltip */}
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                {item.label}
              </span>
            </Link>
          ))}

          <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-0.5" />

          {/* Quick Create Action Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              title="Quick Add"
              className="p-2 sm:p-2.5 rounded-full bg-brand-logo border border-slate-900 dark:border-slate-600 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer font-bold"
            >
              <Plus className={`w-4 h-4 transition-transform ${showQuickMenu ? "rotate-45" : ""}`} />
            </button>

            {/* Quick Menu Popover */}
            {showQuickMenu && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-44 bg-white dark:bg-slate-900 border-1.5 border-slate-900 dark:border-slate-700 rounded-xl shadow-neo p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    setIsCreateProjectOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-rose-500" />
                  <span>New Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    setIsCreateTaskOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-yellow-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>New Task</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-0.5" />

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleMode}
            title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 sm:p-2.5 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
          >
            {mode === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-600" />
            )}
          </button>
        </div>
      </div>

      {/* Global Quick Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </>
  );
}
