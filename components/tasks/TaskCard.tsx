"use client";

import React, { useState, memo } from "react";
import { Task, TaskStatus } from "@/types";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, isOverdue } from "@/lib/utils";
import { Calendar, FolderKanban, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
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
      className={`group bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-xl p-4 shadow-[2px_2px_0px_rgba(0,0,0,0.9)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.9)] transition-all duration-150 ease-out flex flex-col justify-between gap-3 ${
        isDeleting ? "opacity-0 scale-95 duration-100" : ""
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <PriorityBadge priority={task.priority} size="sm" />
          <div className="flex items-center gap-1">
            <select
              value={task.status}
              onChange={(e) =>
                updateTaskStatus(task.id, e.target.value as TaskStatus)
              }
              className="text-xs font-black rounded-lg px-2 py-0.5 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50 cursor-pointer"
            >
              <option value="todo" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">To Do</option>
              <option value="in-progress" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">In Progress</option>
              <option value="done" className="bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-50">Done</option>
            </select>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 rounded-md text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              title="Delete task"
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4
          className={`text-sm font-black leading-snug line-clamp-2 transition-all duration-200 ${
            task.status === "done"
              ? "line-through text-slate-500 dark:text-slate-400"
              : "text-slate-950 dark:text-slate-50"
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-2.5 border-t-2 border-slate-900 dark:border-slate-700 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setSelectedProjectId(task.projectId)}
          className="flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-black truncate max-w-[130px] transition-colors"
        >
          <FolderKanban className="w-3.5 h-3.5 shrink-0 text-slate-700 dark:text-slate-300" />
          <span className="truncate">{task.projectName}</span>
        </button>

        <div className="flex items-center gap-2">
          <Avatar
            src={task.assignee.avatar}
            name={task.assignee.name}
            size="xs"
          />
          <span
            className={`flex items-center gap-1 text-xs font-mono font-bold ${
              isTaskOverdue
                ? "text-rose-600 dark:text-rose-400 font-black"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </span>
        </div>
      </div>
    </div>
  );
});
