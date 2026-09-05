"use client";

import React, { useState, memo } from "react";
import { Task, TaskStatus } from "@/types";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, isOverdue } from "@/lib/utils";
import { Calendar, FolderKanban, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";

interface TaskRowProps {
  task: Task;
  showProject?: boolean;
}

export const TaskRow = memo(function TaskRow({ task, showProject = true }: TaskRowProps) {
  const { updateTaskStatus, deleteTask, setSelectedProjectId } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const isTaskOverdue = isOverdue(task.dueDate, task.status);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-4 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-slate-700 transition-all duration-200 ease-out shadow-xs hover:shadow-sm smooth-gpu ${
        isDeleting ? "opacity-0 scale-95 duration-100" : ""
      }`}
    >
      {/* Left: Checkbox + Title & Project info */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={(e) =>
            updateTaskStatus(task.id, e.target.checked ? "done" : "todo")
          }
          className="mt-0.5 sm:mt-0 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0 transition-transform active:scale-90"
          title={task.status === "done" ? "Mark todo" : "Mark done"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold transition-all duration-200 ${
                task.status === "done"
                  ? "line-through text-slate-400 dark:text-slate-500 font-normal"
                  : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              }`}
            >
              {task.title}
            </span>
          </div>

          {showProject && task.projectName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProjectId(task.projectId);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium mt-0.5 transition-colors"
            >
              <FolderKanban className="w-3 h-3 text-slate-400" />
              <span>{task.projectName}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Badges, Status Changer, Assignee, Due Date & Delete Action */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end sm:self-center">
        <PriorityBadge priority={task.priority} size="sm" />

        {/* Interactive Status Changer */}
        <select
          value={task.status}
          onChange={(e) =>
            updateTaskStatus(task.id, e.target.value as TaskStatus)
          }
          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            task.status === "done"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
              : task.status === "in-progress"
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300"
              : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          }`}
          aria-label={`Change status for task ${task.title}`}
        >
          <option value="todo" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">To Do</option>
          <option value="in-progress" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">In Progress</option>
          <option value="done" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Done</option>
        </select>

        {/* Assignee Avatar */}
        <Avatar
          src={task.assignee.avatar}
          name={task.assignee.name}
          size="xs"
        />

        {/* Due Date */}
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isTaskOverdue
              ? "text-rose-600 dark:text-rose-400 font-semibold"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Delete Task Button */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 group-hover:opacity-100 transition-all cursor-pointer"
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
