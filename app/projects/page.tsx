"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListRow } from "@/components/projects/ProjectListRow";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { filterProjects, getUniqueTechStacks } from "@/lib/filter-utils";
import {
  FolderKanban,
  ArrowLeft,
  Plus,
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function ProjectsPage() {
  const { projects, isLoading } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "progress" | "name" | "dueDate">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    const filtered = filterProjects(projects, {
      search: searchQuery,
      status: statusFilter,
      techStack: "all",
      priority: "all",
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return 0; // recent default order
    });
  }, [projects, searchQuery, statusFilter, sortBy]);

  // Counts for summary bar
  const totalProjects = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const onHoldCount = projects.filter((p) => p.status === "on-hold").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Back Pill Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-600 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.9)] text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 2. Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>PROJECTS</span>

            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            All your projects in one place. Select a project to view and manage its tasks, notes, and credentials.
          </p>
        </div>

        {/* + New Project Button */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="neo-btn neo-btn-primary text-xs font-black shadow-neo uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar with Grid/List Toggle Switch (Matching Reference Image 1 & 2) */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border-1.5 border-slate-900 dark:border-slate-700 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,0.9)] focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-white dark:bg-slate-900 border-1.5 border-slate-900 dark:border-slate-700 rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-slate-900 dark:text-slate-100"
            >
              <option value="all">Status: All</option>
              <option value="active">Status: In Progress</option>
              <option value="planning">Status: Planning</option>
              <option value="completed">Status: Completed</option>
              <option value="on-hold">Status: On Hold</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold bg-white dark:bg-slate-900 border-1.5 border-slate-900 dark:border-slate-700 rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-slate-900 dark:text-slate-100"
            >
              <option value="recent">Sort: Recent</option>
              <option value="progress">Sort: Progress %</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Grid / List View Toggle Switch */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border-1.5 border-slate-900 dark:border-slate-700 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,0.9)]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "brand-selected"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "brand-selected"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Projects Content: Grid vs List Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-16 text-center neo-card p-8 text-slate-500 font-semibold text-sm">
              No matching projects found. Try changing your search query or filters.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <ProjectListRow key={project.id} project={project} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="py-16 text-center neo-card p-8 text-slate-500 font-semibold text-sm">
                No matching projects found.
              </div>
            )}
          </div>

          {/* Bottom Summary Bar matching Image 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Left Stats Block */}
            <div className="md:col-span-2 neo-card p-4 flex flex-wrap items-center justify-around gap-4 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#ddd6fe] text-purple-950 border border-slate-900 font-bold">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Total Projects
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {totalProjects}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  In Progress
                </span>
                <span className="text-lg font-black text-rose-500">
                  {inProgressCount}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Completed
                </span>
                <span className="text-lg font-black text-emerald-500">
                  {completedCount}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  On Hold
                </span>
                <span className="text-lg font-black text-amber-500">
                  {onHoldCount}
                </span>
              </div>
            </div>

            {/* Right Motivation Block */}
            <div className="neo-card p-4 bg-[#f3e8ff] dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-200 text-purple-900 border border-purple-400 font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-purple-950 dark:text-purple-100 truncate">
                  Keep up the good work!
                </p>
                <p className="text-[11px] font-medium text-purple-800 dark:text-purple-300">
                  You&apos;re making great progress this sprint.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
