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
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-4 sm:py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-xl hover:shadow-[3px_3px_0px_rgba(0,0,0,0.9)] transition-all duration-150 ease-out ${
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
          className="mt-0.5 sm:mt-0 w-4 h-4 rounded border-2 border-slate-900 text-rose-500 focus:ring-rose-500 cursor-pointer shrink-0"
          title={task.status === "done" ? "Mark todo" : "Mark done"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-black transition-all duration-200 ${
                task.status === "done"
                  ? "line-through text-slate-500 dark:text-slate-400 font-normal"
                  : "text-slate-950 dark:text-slate-50"
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
              className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold mt-0.5 transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
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
          className="text-xs font-black rounded-lg px-2.5 py-1 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 cursor-pointer shadow-xs focus:outline-none"
          aria-label={`Change status for task ${task.title}`}
        >
          <option value="todo" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">To Do</option>
          <option value="in-progress" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">In Progress</option>
          <option value="done" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">Done</option>
        </select>

        {/* Assignee Avatar */}
        <Avatar
          src={task.assignee.avatar}
          name={task.assignee.name}
          size="xs"
        />

        {/* Due Date */}
        <div
          className={`flex items-center gap-1 text-xs font-mono font-bold ${
            isTaskOverdue
              ? "text-rose-600 dark:text-rose-400 font-black"
              : "text-slate-700 dark:text-slate-300"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Delete Task Button */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
