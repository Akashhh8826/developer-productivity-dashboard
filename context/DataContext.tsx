"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  DashboardStats,
  Project,
  ProjectStatus,
  Task,
  TaskStatus,
  User,
  ColorTheme,
  ThemeMode,
  ColorPalette,
  ProjectNote,
  ProjectCredential,
  ActivityItem,
} from "@/types";

import { DataService } from "@/lib/data-service";
import { calculateDashboardStats, calculateProjectProgress } from "@/lib/utils";

interface DataContextType {
  user: User | null;
  projects: Project[];
  tasks: Task[];
  notes: ProjectNote[];
  credentials: ProjectCredential[];
  activity: ActivityItem[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;

  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Projects
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void;
  addProject: (newProjectData: Partial<Project> & { name: string; description: string; techStack: string[] }) => void;
  deleteProject: (projectId: string) => void;
  
  // Tasks
  addTask: (newTaskData: Partial<Task> & { title: string; projectId: string }) => void;
  deleteTask: (taskId: string) => void;
  
  // Notes
  addNote: (newNoteData: Partial<ProjectNote> & { projectId: string; title: string; content: string }) => void;
  updateNote: (noteId: string, updatedFields: Partial<ProjectNote>) => void;
  deleteNote: (noteId: string) => void;
  
  // Credentials
  addCredential: (newCredData: Partial<ProjectCredential> & { projectId: string; name: string; key: string; value: string }) => void;
  deleteCredential: (credId: string) => void;
  
  // Activity
  addActivity: (activityData: Partial<ActivityItem> & { title: string; description: string }) => void;

  // Profile & System
  updateUser: (updatedUser: Partial<User>) => void;
  refreshData: () => Promise<void>;
  simulateErrorToggle: () => void;
}

const defaultStats: DashboardStats = {
  activeProjects: 0,
  tasksDueToday: 0,
  completionRate: 0,
  overdueTasks: 0,
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  upcomingDeadlines: 0,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [credentials, setCredentials] = useState<ProjectCredential[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>("rose");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const applyThemeDOM = useCallback((m: ThemeMode, p: ColorPalette) => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", p);
      if (m === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Initialize theme mode and color palette from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = (localStorage.getItem("devpulse_mode") as ThemeMode) || "light";
      const savedPalette = (localStorage.getItem("devpulse_color") as ColorPalette) || "rose";
      
      const validMode = ["dark", "light"].includes(savedMode) ? savedMode : "light";
      const validPalette = ["indigo", "emerald", "cyan", "rose", "purple", "amber"].includes(savedPalette) ? savedPalette : "rose";

      setModeState(validMode);
      setColorPaletteState(validPalette);
      applyThemeDOM(validMode, validPalette);
    }
  }, [applyThemeDOM]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("devpulse_mode", newMode);
      applyThemeDOM(newMode, colorPalette);
    }
  }, [colorPalette, applyThemeDOM]);

  const toggleMode = useCallback(() => {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
  }, [mode, setMode]);

  const setColorPalette = useCallback((newPalette: ColorPalette) => {
    setColorPaletteState(newPalette);
    if (typeof window !== "undefined") {
      localStorage.setItem("devpulse_color", newPalette);
      applyThemeDOM(mode, newPalette);
    }
  }, [mode, applyThemeDOM]);

  const setTheme = useCallback((newTheme: ColorTheme) => {
    if (newTheme === "nordic") {
      setMode("light");
      setColorPalette("rose");
    } else if (newTheme === "emerald") {
      setMode("dark");
      setColorPalette("emerald");
    } else if (newTheme === "sapphire") {
      setMode("dark");
      setColorPalette("cyan");
    } else if (newTheme === "sunset") {
      setMode("dark");
      setColorPalette("rose");
    } else if (newTheme === "amethyst") {
      setMode("dark");
      setColorPalette("purple");
    } else {
      setMode("dark");
      setColorPalette("indigo");
    }
  }, [setMode, setColorPalette]);

  const theme: ColorTheme = mode === "light" ? "nordic" : (colorPalette as any);

  // Initialize data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initial = await DataService.getInitialData();
      
      let savedUser: User | null = null;
      let savedTasks: Task[] | null = null;
      let savedProjects: Project[] | null = null;
      let savedNotes: ProjectNote[] | null = null;
      let savedCredentials: ProjectCredential[] | null = null;
      let savedActivity: ActivityItem[] | null = null;

      if (typeof window !== "undefined") {
        try {
          const localUserData = localStorage.getItem("devpulse_user_profile");
          if (localUserData) savedUser = JSON.parse(localUserData);

          const localTasksData = localStorage.getItem("devpulse_tasks");
          if (localTasksData) savedTasks = JSON.parse(localTasksData);

          const localProjectsData = localStorage.getItem("devpulse_projects");
          if (localProjectsData) savedProjects = JSON.parse(localProjectsData);

          const localNotesData = localStorage.getItem("devpulse_notes");
          if (localNotesData) savedNotes = JSON.parse(localNotesData);

          const localCredsData = localStorage.getItem("devpulse_credentials");
          if (localCredsData) savedCredentials = JSON.parse(localCredsData);

          const localActivityData = localStorage.getItem("devpulse_activity");
          if (localActivityData) {
            const parsed = JSON.parse(localActivityData);
            if (Array.isArray(parsed)) {
              const seen = new Set<string>();
              savedActivity = parsed.map((act: ActivityItem, idx: number) => {
                let actId = act.id || `act_${Date.now()}_${idx}`;
                if (seen.has(actId)) {
                  actId = `${actId}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
                }
                seen.add(actId);
                return { ...act, id: actId };
              });
            }
          }
        } catch (e) {
          console.error("Failed to parse saved data from localStorage", e);
        }
      }

      setUser(savedUser || initial.user);
      const activeTasks = savedTasks || initial.tasks;
      const baseProjects = savedProjects || initial.projects;
      
      // Calculate project progress based on tasks
      const initializedProjects = baseProjects.map((proj) => {
        const { progress, total, completed } = calculateProjectProgress(
          activeTasks,
          proj.id
        );
        return {
          ...proj,
          progress: total > 0 ? progress : proj.progress,
          taskCount: total > 0 ? total : proj.taskCount,
          completedTaskCount: total > 0 ? completed : (proj.completedTaskCount || 0),
        };
      });

      setProjects(initializedProjects);
      setTasks(activeTasks);
      setNotes(savedNotes || initial.notes);
      setCredentials(savedCredentials || initial.credentials);
      setActivity(savedActivity || initial.activity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recalculate projects helper
  const syncProjectsWithTasks = useCallback((currentTasks: Task[]) => {
    setProjects((prevProjects) => {
      const updated = prevProjects.map((p) => {
        const { progress, total, completed } = calculateProjectProgress(
          currentTasks,
          p.id
        );
        const updatedStatus: ProjectStatus =
          progress === 100 && p.status === "active"
            ? "completed"
            : progress < 100 && p.status === "completed"
            ? "active"
            : p.status;

        return {
          ...p,
          progress,
          taskCount: total,
          completedTaskCount: completed,
          status: updatedStatus,
        };
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("devpulse_projects", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save projects to localStorage", e);
        }
      }

      return updated;
    });
  }, []);

  // Activity logger helper
  const addActivity = useCallback((activityData: Partial<ActivityItem> & { title: string; description: string }) => {
    const randSuffix = Math.random().toString(36).substring(2, 8);
    const newAct: ActivityItem = {
      id: `act_${Date.now()}_${randSuffix}`,
      projectId: activityData.projectId,
      projectName: activityData.projectName,
      type: activityData.type || "project_created",
      title: activityData.title,
      description: activityData.description,
      timestamp: new Date().toISOString(),
      timeAgo: "Just now",
      badgeColor: activityData.badgeColor || "coral",
    };

    setActivity((prev) => {
      const filteredPrev = prev.filter((a) => a.id !== newAct.id);
      const updated = [newAct, ...filteredPrev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("devpulse_activity", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save activity", e);
        }
      }
      return updated;
    });
  }, []);

  // Update task status and synchronize project progress
  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      let completedTask: Task | undefined;

      setTasks((prevTasks) => {
        const taskItem = prevTasks.find((t) => t.id === taskId);
        if (taskItem && newStatus === "done" && taskItem.status !== "done") {
          completedTask = taskItem;
        }

        const updatedTasks = prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        );

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("devpulse_tasks", JSON.stringify(updatedTasks));
          } catch (e) {
            console.error("Failed to save tasks to localStorage", e);
          }
        }

        syncProjectsWithTasks(updatedTasks);
        return updatedTasks;
      });

      if (completedTask) {
        addActivity({
          type: "task_completed",
          title: `Completed task '${completedTask.title}'`,
          description: `Updated status to Done in project sprint.`,
          projectId: completedTask.projectId,
          projectName: completedTask.projectName,
          badgeColor: "yellow",
        });
      }
    },
    [syncProjectsWithTasks, addActivity]
  );

  // Add new project
  const addProject = useCallback(
    (newProjectData: Partial<Project> & { name: string; description: string; techStack: string[] }) => {
      const newProjId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const createdProject: Project = {
        id: newProjId,
        name: newProjectData.name.trim(),
        description: newProjectData.description.trim(),
        techStack: newProjectData.techStack || ["React", "TypeScript"],
        progress: 0,
        status: newProjectData.status || "active",
        dueDate: newProjectData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        taskCount: 0,
        completedTaskCount: 0,
        starred: false,
        icon: newProjectData.icon || "laptop",
        accentColor: newProjectData.accentColor || "coral",
        updatedAt: "Just now",
      };

      setProjects((prev) => {
        const updatedProjects = [createdProject, ...prev];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("devpulse_projects", JSON.stringify(updatedProjects));
          } catch (e) {
            console.error("Failed to save projects to localStorage", e);
          }
        }
        return updatedProjects;
      });

      addActivity({
        type: "project_created",
        title: `Created a new project '${createdProject.name}'`,
        description: `Initialized project with ${createdProject.techStack.join(", ")}.`,
        projectId: createdProject.id,
        projectName: createdProject.name,
        badgeColor: "coral",
      });
    },
    [addActivity]
  );

  // Delete project and clean up its tasks, notes, credentials
  const deleteProject = useCallback(
    (projectId: string) => {
      setProjects((prevProjects) => {
        const updatedProjects = prevProjects.filter((p) => p.id !== projectId);
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_projects", JSON.stringify(updatedProjects));
        }
        return updatedProjects;
      });

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((t) => t.projectId !== projectId);
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_tasks", JSON.stringify(updatedTasks));
        }
        return updatedTasks;
      });

      setNotes((prev) => {
        const updated = prev.filter((n) => n.projectId !== projectId);
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_notes", JSON.stringify(updated));
        }
        return updated;
      });

      setCredentials((prev) => {
        const updated = prev.filter((c) => c.projectId !== projectId);
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_credentials", JSON.stringify(updated));
        }
        return updated;
      });

      setSelectedProjectId((current) => (current === projectId ? null : current));
    },
    []
  );

  // Add new task
  const addTask = useCallback(
    (newTaskData: Partial<Task> & { title: string; projectId: string }) => {
      setTasks((prevTasks) => {
        const matchingProject = projects.find((p) => p.id === newTaskData.projectId);
        const newTaskId = `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        const createdTask: Task = {
          id: newTaskId,
          projectId: newTaskData.projectId,
          projectName: matchingProject?.name || "General Project",
          title: newTaskData.title.trim(),
          description: newTaskData.description?.trim() || "",
          status: newTaskData.status || "todo",
          priority: newTaskData.priority || "medium",
          assignee: newTaskData.assignee || {
            name: user?.name || "Alex Chen",
            avatar: user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role: user?.role || "Developer",
          },
          dueDate: newTaskData.dueDate || new Date().toISOString().split("T")[0],
        };

        const updatedTasks = [createdTask, ...prevTasks];

        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_tasks", JSON.stringify(updatedTasks));
        }

        syncProjectsWithTasks(updatedTasks);
        return updatedTasks;
      });
    },
    [projects, user, syncProjectsWithTasks]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((t) => t.id !== taskId);

        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_tasks", JSON.stringify(updatedTasks));
        }

        syncProjectsWithTasks(updatedTasks);
        return updatedTasks;
      });
    },
    [syncProjectsWithTasks]
  );

  // Notes CRUD
  const addNote = useCallback(
    (newNoteData: Partial<ProjectNote> & { projectId: string; title: string; content: string }) => {
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newNote: ProjectNote = {
        id: noteId,
        projectId: newNoteData.projectId,
        title: newNoteData.title.trim(),
        content: newNoteData.content.trim(),
        category: newNoteData.category || "Documentation",
        tags: newNoteData.tags || ["General"],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: "Just now",
      };

      setNotes((prev) => {
        const updated = [newNote, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_notes", JSON.stringify(updated));
        }
        return updated;
      });

      addActivity({
        type: "note_added",
        title: `Added note '${newNote.title}'`,
        description: `Created technical spec in project notes hub.`,
        projectId: newNote.projectId,
        badgeColor: "blue",
      });
    },
    [addActivity]
  );

  const updateNote = useCallback((noteId: string, updatedFields: Partial<ProjectNote>) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId
          ? { ...n, ...updatedFields, updatedAt: "Just now" }
          : n
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_notes", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== noteId);
      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_notes", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Credentials CRUD
  const addCredential = useCallback(
    (newCredData: Partial<ProjectCredential> & { projectId: string; name: string; key: string; value: string }) => {
      const credId = `cred_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newCred: ProjectCredential = {
        id: credId,
        projectId: newCredData.projectId,
        name: newCredData.name.trim(),
        type: newCredData.type || "api_key",
        key: newCredData.key.trim(),
        value: newCredData.value.trim(),
        environment: newCredData.environment || "production",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setCredentials((prev) => {
        const updated = [newCred, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_credentials", JSON.stringify(updated));
        }
        return updated;
      });

      addActivity({
        type: "credential_updated",
        title: `Stored credential '${newCred.name}' in Developer Vault`,
        description: `Configured secret for ${newCred.environment} environment.`,
        projectId: newCred.projectId,
        badgeColor: "green",
      });
    },
    [addActivity]
  );

  const deleteCredential = useCallback((credId: string) => {
    setCredentials((prev) => {
      const updated = prev.filter((c) => c.id !== credId);
      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_credentials", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Update project status
  const updateProjectStatus = useCallback(
    (projectId: string, newStatus: ProjectStatus) => {
      setProjects((prev) => {
        const updated = prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p));
        if (typeof window !== "undefined") {
          localStorage.setItem("devpulse_projects", JSON.stringify(updated));
        }
        return updated;
      });
    },
    []
  );

  // Update user profile with persistent storage
  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      const nextUser = prev ? { ...prev, ...updatedFields } : ({ id: "usr_01", ...updatedFields } as User);
      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_user_profile", JSON.stringify(nextUser));
      }
      return nextUser;
    });
  }, []);

  // Toggle simulated error state for demonstration & testing
  const simulateErrorToggle = useCallback(() => {
    if (error) {
      setError(null);
      loadData();
    } else {
      setError("Simulated network request failed (503 Service Unavailable). Click Retry to recover.");
    }
  }, [error, loadData]);

  // Derived dynamic stats
  const stats = useMemo(() => {
    return calculateDashboardStats(projects, tasks);
  }, [projects, tasks]);

  const value = useMemo(
    () => ({
      user,
      projects,
      tasks,
      notes,
      credentials,
      activity,
      stats,
      isLoading,
      error,
      mode,
      setMode,
      toggleMode,
      colorPalette,
      setColorPalette,
      theme,
      setTheme,
      globalSearch,
      setGlobalSearch,
      selectedProjectId,
      setSelectedProjectId,
      updateTaskStatus,
      updateProjectStatus,
      addProject,
      deleteProject,
      addTask,
      deleteTask,
      addNote,
      updateNote,
      deleteNote,
      addCredential,
      deleteCredential,
      addActivity,
      updateUser,
      refreshData: loadData,
      simulateErrorToggle,
    }),
    [
      user,
      projects,
      tasks,
      notes,
      credentials,
      activity,
      stats,
      isLoading,
      error,
      mode,
      setMode,
      toggleMode,
      colorPalette,
      setColorPalette,
      theme,
      setTheme,
      globalSearch,
      selectedProjectId,
      updateTaskStatus,
      updateProjectStatus,
      addProject,
      deleteProject,
      addTask,
      deleteTask,
      addNote,
      updateNote,
      deleteNote,
      addCredential,
      deleteCredential,
      addActivity,
      updateUser,
      loadData,
      simulateErrorToggle,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
