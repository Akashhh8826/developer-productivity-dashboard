"use client";

import React, { useState } from "react";
import { Project, TaskStatus } from "@/types";
import { useData } from "@/context/DataContext";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Layers,
  LayoutList,
  Kanban,
} from "lucide-react";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, isOverdue } from "@/lib/utils";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { TaskCard } from "@/components/tasks/TaskCard";

interface ProjectTasksTabProps {
  project: Project;
}

export function ProjectTasksTab({ project }: ProjectTasksTabProps) {
  const { tasks, updateTaskStatus, deleteTask } = useData();
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  const handleDelete = (taskId: string, title: string) => {
    if (confirm(`Are you sure you want to delete task "${title}"?`)) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-900 dark:border-slate-700 rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-[#ff8585] text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === "board"
                  ? "bg-[#ff8585] text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-btn bg-[#ff8585] text-slate-950 text-xs font-black shadow-neo-sm hover:bg-[#ff7070]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task List / Board */}
      {viewMode === "list" ? (
        <div className="space-y-2.5">
          {projectTasks.map((task) => {
            const isTaskOverdue = isOverdue(task.dueDate, task.status);
            return (
              <div
                key={task.id}
                className="neo-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.checked ? "done" : "todo")
                    }
                    className="w-4 h-4 rounded border-slate-400 text-rose-500 focus:ring-rose-400 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        task.status === "done"
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <PriorityBadge priority={task.priority} size="sm" />

                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as TaskStatus)
                    }
                    className="text-xs font-bold rounded-lg px-2 py-1 border border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer shadow-xs"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Avatar
                      src={task.assignee.avatar}
                      name={task.assignee.name}
                      size="xs"
                    />
                  </div>

                  <span className="text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id, task.title)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {projectTasks.length === 0 && (
            <div className="text-center py-12 neo-card p-6 text-slate-400 text-xs font-semibold">
              No sprint tasks created for this project yet.
            </div>
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {["todo", "in-progress", "done"].map((colStatus) => {
            const colTasks = projectTasks.filter((t) => t.status === colStatus);
            const colTitle =
              colStatus === "todo"
                ? "To Do"
                : colStatus === "in-progress"
                ? "In Progress"
                : "Done";
            const colColor =
              colStatus === "todo"
                ? "bg-slate-200"
                : colStatus === "in-progress"
                ? "bg-blue-400"
                : "bg-emerald-400";

            return (
              <div
                key={colStatus}
                className="neo-card p-3.5 bg-slate-50/70 dark:bg-slate-900/60 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${colColor}`} />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {colTitle}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[120px]">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultProjectId={project.id}
      />
    </div>
  );
}
