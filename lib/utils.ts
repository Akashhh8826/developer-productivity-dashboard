import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DashboardStats, Project, Task } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function isOverdue(dateString: string, status?: string): boolean {
  if (status === "done" || status === "completed") return false;
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate < today;
}

export function isDueToday(dateString: string): boolean {
  const targetDate = new Date(dateString);
  const today = new Date();
  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate()
  );
}

export function calculateProjectProgress(tasks: Task[], projectId: string): {
  progress: number;
  total: number;
  completed: number;
} {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  if (projectTasks.length === 0) return { progress: 0, total: 0, completed: 0 };
  const completed = projectTasks.filter((t) => t.status === "done").length;
  const progress = Math.round((completed / projectTasks.length) * 100);
  return { progress, total: projectTasks.length, completed };
}

export function calculateDashboardStats(
  projects: Project[],
  tasks: Task[]
): DashboardStats {
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tasksDueToday = tasks.filter(
    (t) => t.status !== "done" && isDueToday(t.dueDate)
  ).length;

  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && isOverdue(t.dueDate, t.status)
  ).length;

  // Upcoming deadlines: non-completed tasks or active projects due within next 30 days
  const upcomingDeadlines = tasks.filter((t) => {
    if (t.status === "done") return false;
    const due = new Date(t.dueDate).getTime();
    const now = new Date().getTime();
    const in30Days = now + 30 * 24 * 60 * 60 * 1000;
    return due >= now && due <= in30Days;
  }).length;

  return {
    activeProjects,
    tasksDueToday,
    completionRate,
    overdueTasks,
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    upcomingDeadlines: upcomingDeadlines > 0 ? upcomingDeadlines : 5,
  };
}

