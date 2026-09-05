import { Project, Task, User, ProjectNote, ProjectCredential, ActivityItem } from "@/types";
import mockUserData from "@/data/mockUser.json";
import mockProjectsData from "@/data/mockProjects.json";
import mockTasksData from "@/data/mockTasks.json";
import mockNotesData from "@/data/mockNotes.json";
import mockCredentialsData from "@/data/mockCredentials.json";
import mockActivityData from "@/data/mockActivity.json";

// Simulated network latency helper (0ms for instant, crisp rendering)
const delay = (ms: number = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export const DataService = {
  async getUser(): Promise<User> {
    await delay(0);
    return mockUserData as User;
  },

  async getProjects(): Promise<Project[]> {
    await delay(0);
    return JSON.parse(JSON.stringify(mockProjectsData)) as Project[];
  },

  async getTasks(): Promise<Task[]> {
    await delay(0);
    return JSON.parse(JSON.stringify(mockTasksData)) as Task[];
  },

  async getNotes(): Promise<ProjectNote[]> {
    await delay(0);
    return JSON.parse(JSON.stringify(mockNotesData)) as ProjectNote[];
  },

  async getCredentials(): Promise<ProjectCredential[]> {
    await delay(0);
    return JSON.parse(JSON.stringify(mockCredentialsData)) as ProjectCredential[];
  },

  async getActivity(): Promise<ActivityItem[]> {
    await delay(0);
    return JSON.parse(JSON.stringify(mockActivityData)) as ActivityItem[];
  },

  async getInitialData(): Promise<{
    user: User;
    projects: Project[];
    tasks: Task[];
    notes: ProjectNote[];
    credentials: ProjectCredential[];
    activity: ActivityItem[];
  }> {
    await delay(0);
    return {
      user: mockUserData as User,
      projects: JSON.parse(JSON.stringify(mockProjectsData)) as Project[],
      tasks: JSON.parse(JSON.stringify(mockTasksData)) as Task[],
      notes: JSON.parse(JSON.stringify(mockNotesData)) as ProjectNote[],
      credentials: JSON.parse(JSON.stringify(mockCredentialsData)) as ProjectCredential[],
      activity: JSON.parse(JSON.stringify(mockActivityData)) as ActivityItem[],
    };
  },
};


