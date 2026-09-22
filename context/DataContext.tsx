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

import { api } from "@/lib/api";
import { calculateDashboardStats, calculateProjectProgress } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface ApiListResponse<T> {
  success: boolean;
  data: T;
}

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

  updateTaskStatus: (
    taskId: string,
    newStatus: TaskStatus
  ) => Promise<void>;

  updateProjectStatus: (
    projectId: string,
    newStatus: ProjectStatus
  ) => Promise<void>;

  addProject: (
    newProjectData: Partial<Project> & {
      name: string;
      description: string;
      techStack: string[];
    }
  ) => Promise<void>;

  deleteProject: (projectId: string) => Promise<void>;

  addTask: (
    newTaskData: Partial<Task> & {
      title: string;
      projectId: string;
    }
  ) => Promise<void>;

  deleteTask: (taskId: string) => Promise<void>;

  addNote: (
    newNoteData: Partial<ProjectNote> & {
      projectId: string;
      title: string;
      content: string;
    }
  ) => void;

  updateNote: (
    noteId: string,
    updatedFields: Partial<ProjectNote>
  ) => void;

  deleteNote: (noteId: string) => void;

  addCredential: (
    newCredData: Partial<ProjectCredential> & {
      projectId: string;
      name: string;
      key: string;
      value: string;
    }
  ) => void;

  deleteCredential: (credId: string) => void;

  addActivity: (
    activityData: Partial<ActivityItem> & {
      title: string;
      description: string;
    }
  ) => void;

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

function mapProject(project: any): Project {
  return {
    id: project.id || project._id,
    name: project.name || "",
    description: project.description || "",
    techStack: project.techStack || [],
    progress: Number(project.progress || 0),
    status: project.status || "active",
    dueDate: project.dueDate || "",
    taskCount: Number(project.taskCount || 0),
    completedTaskCount: Number(project.completedTaskCount || 0),
    starred: Boolean(project.starred),
    icon: project.icon || "laptop",
    accentColor: project.accentColor || "coral",
    updatedAt: project.updatedAt || "",
  };
}

function mapTask(task: any): Task {
  let status: TaskStatus = "todo";

  if (task.status === "in_progress") {
    status = "in-progress";
  } else if (
    task.status === "todo" ||
    task.status === "done"
  ) {
    status = task.status;
  }

  return {
    id: task.id || task._id,
    projectId:
      typeof task.projectId === "object"
        ? task.projectId.id || task.projectId._id
        : task.projectId,
    projectName:
      task.projectName ||
      (typeof task.projectId === "object"
        ? task.projectId.name
        : undefined),
    title: task.title || "",
    description: task.description || "",
    status,
    priority: task.priority || "medium",
    assignee: task.assignee || {
      name: "Developer",
      avatar: "",
      role: "Developer",
    },
    dueDate: task.dueDate || "",
  };
}

function backendTaskStatus(status: TaskStatus) {
  if (status === "in-progress") {
    return "in_progress";
  }

  return status;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();

  const [user, setUser] = useState<User | null>(authUser);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [credentials, setCredentials] = useState<ProjectCredential[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setModeState] = useState<ThemeMode>("light");
  const [colorPalette, setColorPaletteState] =
    useState<ColorPalette>("rose");

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] =
    useState<string | null>(null);

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  const applyThemeDOM = useCallback(
    (m: ThemeMode, p: ColorPalette) => {
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", p);


        if (m === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    []


  );

  useEffect(() => {
    if (typeof window === "undefined") return;


    const savedMode =
      (localStorage.getItem("devpulse_mode") as ThemeMode) || "light";

    const savedPalette =
      (localStorage.getItem("devpulse_color") as ColorPalette) ||
      "rose";

    const validMode: ThemeMode =
      savedMode === "dark" || savedMode === "light"
        ? savedMode
        : "light";

    const validPalette: ColorPalette = [
      "indigo",
      "emerald",
      "cyan",
      "rose",
      "purple",
      "amber",
    ].includes(savedPalette)
      ? savedPalette
      : "rose";

    setModeState(validMode);
    setColorPaletteState(validPalette);

    applyThemeDOM(validMode, validPalette);


  }, [applyThemeDOM]);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);


      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_mode", newMode);
        applyThemeDOM(newMode, colorPalette);
      }
    },
    [colorPalette, applyThemeDOM]


  );

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const setColorPalette = useCallback(
    (newPalette: ColorPalette) => {
      setColorPaletteState(newPalette);


      if (typeof window !== "undefined") {
        localStorage.setItem("devpulse_color", newPalette);
        applyThemeDOM(mode, newPalette);
      }
    },
    [mode, applyThemeDOM]


  );

  const setTheme = useCallback(
    (newTheme: ColorTheme) => {
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
    },
    [setMode, setColorPalette]
  );

  const theme: ColorTheme =
    mode === "light" ? "nordic" : (colorPalette as ColorTheme);

  const loadLocalExtras = useCallback(() => {
    if (typeof window === "undefined") return;


    try {
      const savedNotes = localStorage.getItem("devpulse_notes");
      const savedCredentials = localStorage.getItem(
        "devpulse_credentials"
      );
      const savedActivity = localStorage.getItem("devpulse_activity");

      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }

      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials));
      }

      if (savedActivity) {
        setActivity(JSON.parse(savedActivity));
      }
    } catch (err) {
      console.error("Failed to load local extras:", err);
    }


  }, []);

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const [projectsResponse, tasksResponse] =
        await Promise.all([
          api.get<ApiListResponse<any[]>>("/api/projects"),
          api.get<ApiListResponse<any[]>>("/api/tasks"),
        ]);

      const backendProjects = Array.isArray(projectsResponse.data)
        ? projectsResponse.data.map(mapProject)
        : [];

      const backendTasks = Array.isArray(tasksResponse.data)
        ? tasksResponse.data.map(mapTask)
        : [];

      const initializedProjects = backendProjects.map((project) => {
        const { progress, total, completed } =
          calculateProjectProgress(
            backendTasks,
            project.id
          );

        return {
          ...project,
          progress: total > 0 ? progress : project.progress,
          taskCount:
            total > 0 ? total : project.taskCount,
          completedTaskCount:
            total > 0
              ? completed
              : project.completedTaskCount || 0,
        };
      });

      setProjects(initializedProjects);
      setTasks(backendTasks);

      loadLocalExtras();
    } catch (err) {
      console.error("Failed to load backend data:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data"
      );
    } finally {
      setIsLoading(false);
    }


  }, [loadLocalExtras]);

  useEffect(() => {
    loadData();
  }, [loadData, isAuthenticated]);

  const syncProjectsWithTasks = useCallback(
    (currentTasks: Task[]) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          const { progress, total, completed } =
            calculateProjectProgress(
              currentTasks,
              project.id
            );


          const updatedStatus: ProjectStatus =
            total > 0 && progress === 100
              ? "completed"
              : project.status === "completed" &&
                total > 0 &&
                progress < 100
                ? "active"
                : project.status;

          return {
            ...project,
            progress,
            taskCount: total,
            completedTaskCount: completed,
            status: updatedStatus,
          };
        })
      );
    },
    []


  );

  const addActivity = useCallback(
    (
      activityData: Partial<ActivityItem> & {
        title: string;
        description: string;
      }
    ) => {
      const newActivity: ActivityItem = {
        id: `act_${Date.now()}`,
        projectId: activityData.projectId,
        projectName: activityData.projectName,
        type: activityData.type || "project_created",
        title: activityData.title,
        description: activityData.description,
        timestamp: new Date().toISOString(),
        timeAgo: "Just now",
        badgeColor: activityData.badgeColor || "coral",
      };


      setActivity((previous) => {
        const updated = [newActivity, ...previous];

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "devpulse_activity",
            JSON.stringify(updated)
          );
        }

        return updated;
      });
    },
    []


  );

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      try {
        setError(null);

        const response = await api.patch<ApiListResponse<any>>(
          `/api/tasks/${taskId}`,
          {
            status: backendTaskStatus(newStatus),
          }
        );

        const updatedTask = mapTask(response.data);

        setTasks((previous) => {
          const nextTasks = previous.map((task) =>
            task.id === taskId ? updatedTask : task
          );
          syncProjectsWithTasks(nextTasks);
          return nextTasks;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update task";
        setError(msg);
        throw err;
      }
    },
    [syncProjectsWithTasks]
  );

  const addProject = useCallback(
    async (
      newProjectData: Partial<Project> & {
        name: string;
        description: string;
        techStack: string[];
      }
    ) => {
      try {
        setError(null);

        const response = await api.post<ApiListResponse<any>>(
          "/api/projects",
          {
            name: newProjectData.name.trim(),
            description: newProjectData.description.trim(),
            status:
              newProjectData.status === "active"
                ? "planning"
                : newProjectData.status || "planning",
            progress: newProjectData.progress || 0,
            dueDate:
              newProjectData.dueDate ||
              new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toISOString(),
          }
        );

        const createdProject = mapProject(response.data);

        setProjects((previous) => [
          createdProject,
          ...previous,
        ]);

        addActivity({
          type: "project_created",
          title: `Created a new project '${createdProject.name}'`,
          description: `Initialized project with ${createdProject.techStack.join(
            ", "
          )}.`,
          projectId: createdProject.id,
          projectName: createdProject.name,
          badgeColor: "coral",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create project";
        setError(msg);
        throw err;
      }
    },
    [addActivity]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        setError(null);

        await api.delete(`/api/projects/${projectId}`);

        setProjects((previous) =>
          previous.filter(
            (project) => project.id !== projectId
          )
        );

        setTasks((previous) =>
          previous.filter(
            (task) => task.projectId !== projectId
          )
        );

        setNotes((previous) =>
          previous.filter(
            (note) => note.projectId !== projectId
          )
        );

        setCredentials((previous) =>
          previous.filter(
            (credential) =>
              credential.projectId !== projectId
          )
        );

        setSelectedProjectId((current) =>
          current === projectId ? null : current
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete project";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const addTask = useCallback(
    async (
      newTaskData: Partial<Task> & {
        title: string;
        projectId: string;
      }
    ) => {
      try {
        setError(null);

        const matchingProject = projects.find(
          (project) => project.id === newTaskData.projectId
        );

        const response = await api.post<ApiListResponse<any>>(
          "/api/tasks",
          {
            projectId: newTaskData.projectId,
            title: newTaskData.title.trim(),
            description:
              newTaskData.description?.trim() || "",
            status: backendTaskStatus(
              newTaskData.status || "todo"
            ),
            priority: newTaskData.priority || "medium",
            dueDate:
              newTaskData.dueDate ||
              new Date().toISOString(),
            assignee:
              newTaskData.assignee || {
                name: user?.name || "Developer",
                avatar: user?.avatar || "",
                role: user?.role || "Developer",
              },
          }
        );

        const createdTask = mapTask(response.data);

        if (!createdTask.projectName) {
          createdTask.projectName =
            matchingProject?.name;
        }

        setTasks((previous) => {
          const nextTasks = [createdTask, ...previous];
          syncProjectsWithTasks(nextTasks);
          return nextTasks;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create task";
        setError(msg);
        throw err;
      }
    },
    [projects, user, syncProjectsWithTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        setError(null);

        await api.delete(`/api/tasks/${taskId}`);

        setTasks((previous) => {
          const updatedTasks = previous.filter(
            (task) => task.id !== taskId
          );
          syncProjectsWithTasks(updatedTasks);
          return updatedTasks;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete task";
        setError(msg);
        throw err;
      }
    },
    [syncProjectsWithTasks]
  );

  const updateProjectStatus = useCallback(
    async (
      projectId: string,
      newStatus: ProjectStatus
    ) => {
      try {
        setError(null);

        const response = await api.patch<ApiListResponse<any>>(
          `/api/projects/${projectId}`,
          {
            status: newStatus,
          }
        );

        const updatedProject = mapProject(response.data);

        setProjects((previous) =>
          previous.map((project) =>
            project.id === projectId
              ? {
                ...project,
                ...updatedProject,
              }
              : project
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update project";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const addNote = useCallback(
    (
      newNoteData: Partial<ProjectNote> & {
        projectId: string;
        title: string;
        content: string;
      }
    ) => {
      const newNote: ProjectNote = {
        id: `note_${Date.now()}`,
        projectId: newNoteData.projectId,
        title: newNoteData.title.trim(),
        content: newNoteData.content.trim(),
        category:
          newNoteData.category || "Documentation",
        tags: newNoteData.tags || ["General"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };


      setNotes((previous) => {
        const updated = [newNote, ...previous];

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "devpulse_notes",
            JSON.stringify(updated)
          );
        }

        return updated;
      });
    },
    []

  );

  const updateNote = useCallback(
    (
      noteId: string,
      updatedFields: Partial<ProjectNote>
    ) => {
      setNotes((previous) => {
        const updated = previous.map((note) =>
          note.id === noteId
            ? {
              ...note,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
            : note
        );


        if (typeof window !== "undefined") {
          localStorage.setItem(
            "devpulse_notes",
            JSON.stringify(updated)
          );
        }

        return updated;
      });
    },
    []

  );

  const deleteNote = useCallback((noteId: string) => {
    setNotes((previous) => {
      const updated = previous.filter(
        (note) => note.id !== noteId
      );


      if (typeof window !== "undefined") {
        localStorage.setItem(
          "devpulse_notes",
          JSON.stringify(updated)
        );
      }

      return updated;
    });

  }, []);

  const addCredential = useCallback(
    (
      newCredData: Partial<ProjectCredential> & {
        projectId: string;
        name: string;
        key: string;
        value: string;
      }
    ) => {
      const newCredential: ProjectCredential = {
        id: `cred_${Date.now()}`,
        projectId: newCredData.projectId,
        name: newCredData.name.trim(),
        type: newCredData.type || "api_key",
        key: newCredData.key.trim(),
        value: newCredData.value.trim(),
        environment:
          newCredData.environment || "production",
        createdAt: new Date().toISOString(),
      };

      setCredentials((previous) => {
        const updated = [newCredential, ...previous];

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "devpulse_credentials",
            JSON.stringify(updated)
          );
        }

        return updated;
      });
    },
    []

  );

  const deleteCredential = useCallback((credId: string) => {
    setCredentials((previous) => {
      const updated = previous.filter(
        (credential) => credential.id !== credId
      );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "devpulse_credentials",
          JSON.stringify(updated)
        );
      }

      return updated;
    });

  }, []);

  const updateUser = useCallback(
    (updatedFields: Partial<User>) => {
      setUser((previous) =>
        previous
          ? { ...previous, ...updatedFields }
          : null
      );
    },
    []
  );

  const simulateErrorToggle = useCallback(() => {
    setError((currentError) =>
      currentError
        ? null
        : "Simulated network request failed."
    );
  }, []);

  const refreshData = useCallback(async () => {
    await loadData(false);
  }, [loadData]);

  const stats = useMemo(() => {
    return calculateDashboardStats(projects, tasks) || defaultStats;
  }, [projects, tasks]);

  const value = useMemo<DataContextType>(
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

      refreshData,
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
      refreshData,
      simulateErrorToggle,
    ]
  );

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      "useData must be used within a DataProvider"
    );
  }

  return context;
}
