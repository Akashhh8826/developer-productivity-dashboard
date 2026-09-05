"use client";

import React, { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown, FilterOption } from "@/components/ui/FilterDropdown";
import { filterTasks } from "@/lib/filter-utils";
import {
  CheckSquare,
  LayoutList,
  Kanban,
  ArrowUpDown,
  Plus,
} from "lucide-react";

export default function TasksPage() {
  const { tasks, projects, isLoading } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Options
  const statusOptions: FilterOption[] = [
    { label: "All Statuses", value: "all" },
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in-progress" },
    { label: "Done", value: "done" },
  ];

  const priorityOptions: FilterOption[] = [
    { label: "All Priorities", value: "all" },
    { label: "Urgent", value: "urgent" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const projectOptions: FilterOption[] = useMemo(() => {
    return [
      { label: "All Projects", value: "all" },
      ...projects.map((p) => ({ label: p.name, value: p.id })),
    ];
  }, [projects]);

  const sortOptions: FilterOption[] = [
    { label: "Due Date", value: "dueDate" },
    { label: "Priority", value: "priority" },
    { label: "Task Title", value: "title" },
  ];

  const priorityWeights: Record<string, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filtered and Sorted Tasks
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, {
      search: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      projectId: projectFilter,
      techStack: "all",
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setProjectFilter("all");
    setSortBy("dueDate");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Sprint Tasks</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              {tasks.length}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time backlog, assignments, priority triage, and status updates
          </p>
        </div>

        {/* View Mode Switcher & Add Task Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "board"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Board View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Search tasks by keyword, assignee, or project..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <FilterDropdown
              label="Project"
              options={projectOptions}
              selectedValue={projectFilter}
              onChange={setProjectFilter}
            />

            <FilterDropdown
              label="Status"
              options={statusOptions}
              selectedValue={statusFilter}
              onChange={setStatusFilter}
            />

            <FilterDropdown
              label="Priority"
              options={priorityOptions}
              selectedValue={priorityFilter}
              onChange={setPriorityFilter}
            />

            <FilterDropdown
              label="Sort"
              options={sortOptions}
              selectedValue={sortBy}
              onChange={(val) => setSortBy(val as "dueDate" | "priority" | "title")}
              icon={<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />}
            />
          </div>
        </div>
      </div>

      {/* Main Task View (List vs Kanban Board) */}
      {viewMode === "list" ? (
        <TaskList
          tasks={filteredAndSortedTasks}
          isLoading={isLoading}
          emptyTitle="No tasks match your criteria"
          emptyDescription="Try clearing your search query or loosening your filter settings."
          onClearFilters={handleResetFilters}
          showProject={true}
        />
      ) : (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column: To Do */}
          <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  To Do
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredAndSortedTasks.filter((t) => t.status === "todo").length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredAndSortedTasks
                .filter((t) => t.status === "todo")
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              {filteredAndSortedTasks.filter((t) => t.status === "todo").length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No tasks to do</p>
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="bg-blue-50/30 dark:bg-slate-900/60 rounded-xl p-4 border border-blue-200/50 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  In Progress
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                {filteredAndSortedTasks.filter((t) => t.status === "in-progress").length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredAndSortedTasks
                .filter((t) => t.status === "in-progress")
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              {filteredAndSortedTasks.filter((t) => t.status === "in-progress").length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No tasks in progress</p>
              )}
            </div>
          </div>

          {/* Column: Done */}
          <div className="bg-emerald-50/30 dark:bg-slate-900/60 rounded-xl p-4 border border-emerald-200/50 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Done
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
                {filteredAndSortedTasks.filter((t) => t.status === "done").length}
              </span>
            </div>
            <div className="space-y-3">
              {filteredAndSortedTasks
                .filter((t) => t.status === "done")
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              {filteredAndSortedTasks.filter((t) => t.status === "done").length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No completed tasks</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
