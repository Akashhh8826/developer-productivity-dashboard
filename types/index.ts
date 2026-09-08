export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'planning';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ThemeMode = 'dark' | 'light';
export type ColorPalette = 'indigo' | 'emerald' | 'cyan' | 'rose' | 'purple' | 'amber';
export type ColorTheme = 'slate' | 'emerald' | 'sapphire' | 'sunset' | 'amethyst' | 'nordic';

export type ProjectIconType =
  | 'shopping-cart'
  | 'laptop'
  | 'smartphone'
  | 'megaphone'
  | 'gauge'
  | 'book-open'
  | 'shield'
  | 'database'
  | 'layers'
  | 'bot'
  | 'cpu'
  | 'cloud'
  | 'gamepad'
  | 'terminal'
  | 'server';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  department?: string;
  location?: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCredential {
  id: string;
  projectId: string;
  name: string;
  type: 'api_key' | 'database' | 'secret' | 'oauth' | 'webhook';
  key: string;
  value: string;
  environment: 'production' | 'staging' | 'development';
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  projectName?: string;
  type: 'project_created' | 'task_completed' | 'deadline_updated' | 'note_added' | 'credential_updated';
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  badgeColor?: 'coral' | 'yellow' | 'purple' | 'green' | 'blue';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  taskCount: number;
  completedTaskCount?: number;
  starred?: boolean;
  icon?: ProjectIconType;
  accentColor?: string;
  updatedAt?: string;
}

export interface TaskAssignee {
  name: string;
  avatar: string;
  role?: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: TaskAssignee;
  dueDate: string;
}

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  techStack: string;
  projectId?: string;
}

export interface DashboardStats {
  activeProjects: number;
  tasksDueToday: number;
  completionRate: number;
  overdueTasks: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  upcomingDeadlines: number;
}

