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
          <div className="flex items-center p-1 bg-white dark:bg-[#161f30] border-2 border-slate-900 dark:border-slate-700 rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded text-xs font-black transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-[#ff8585] text-slate-950 shadow-xs"
                  : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded text-xs font-black transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === "board"
                  ? "bg-[#ff8585] text-slate-950 shadow-xs"
                  : "text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white"
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
                className="neo-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#161f30] border-2 border-slate-900 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.checked ? "done" : "todo")
                    }
                    className="w-4 h-4 rounded border-2 border-slate-900 text-rose-500 focus:ring-rose-400 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-black truncate ${
                        task.status === "done"
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-950 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate mt-0.5">
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
                    className="text-xs font-black rounded-lg px-2.5 py-1 border-2 border-slate-900 dark:border-slate-600 bg-slate-50 dark:bg-[#0d1424] text-slate-950 dark:text-white cursor-pointer shadow-xs focus:outline-none"
                  >
                    <option value="todo" className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white">To Do</option>
                    <option value="in-progress" className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white">In Progress</option>
                    <option value="done" className="bg-white dark:bg-slate-900 text-slate-950 dark:text-white">Done</option>
                  </select>

                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <Avatar
                      src={task.assignee.avatar}
                      name={task.assignee.name}
                      size="xs"
                    />
                  </div>

                  <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                    isTaskOverdue ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(task.dueDate)}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id, task.title)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {projectTasks.length === 0 && (
            <div className="text-center py-12 neo-card p-6 text-slate-600 dark:text-slate-300 text-xs font-bold bg-white dark:bg-[#161f30]">
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
                ? "bg-slate-400"
                : colStatus === "in-progress"
                ? "bg-blue-500"
                : "bg-emerald-500";

            return (
              <div
                key={colStatus}
                className="neo-card p-3.5 bg-slate-50 dark:bg-[#161f30] border-2 border-slate-900 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colColor} border border-slate-900`} />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
                      {colTitle}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white dark:bg-[#0d1424] border-2 border-slate-900 dark:border-slate-700 text-slate-950 dark:text-white">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[120px]">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center py-6">
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
