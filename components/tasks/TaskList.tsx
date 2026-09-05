"use client";

import React from "react";
import { Task } from "@/types";
import { TaskRow } from "./TaskRow";
import { TaskRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckSquare } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  showProject?: boolean;
}

export function TaskList({
  tasks,
  isLoading = false,
  emptyTitle = "No tasks found",
  emptyDescription = "There are no tasks matching your search or filters.",
  onClearFilters,
  showProject = true,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <TaskRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={CheckSquare}
        actionLabel={onClearFilters ? "Reset Filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} showProject={showProject} />
      ))}
    </div>
  );
}
