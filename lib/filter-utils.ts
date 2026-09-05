import { FilterState, Project, Task } from "@/types";

export function filterProjects(
  projects: Project[],
  filters: FilterState
): Project[] {
  return projects.filter((project) => {
    // 1. Search Query filter (matches name, description, or any techStack item)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      const nameMatch = project.name.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);
      const techMatch = project.techStack.some((tech) =>
        tech.toLowerCase().includes(query)
      );

      if (!nameMatch && !descMatch && !techMatch) {
        return false;
      }
    }

    // 2. Status filter
    if (filters.status && filters.status !== "all") {
      if (project.status !== filters.status) {
        return false;
      }
    }

    // 3. Tech Stack filter
    if (filters.techStack && filters.techStack !== "all") {
      const hasTech = project.techStack.some(
        (t) => t.toLowerCase() === filters.techStack.toLowerCase()
      );
      if (!hasTech) {
        return false;
      }
    }

    return true;
  });
}

export function filterTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter((task) => {
    // 1. Project ID filter
    if (filters.projectId && filters.projectId !== "all") {
      if (task.projectId !== filters.projectId) {
        return false;
      }
    }

    // 2. Search Query filter (matches title, description, project name, or assignee)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description?.toLowerCase().includes(query);
      const projectMatch = task.projectName?.toLowerCase().includes(query);
      const assigneeMatch = task.assignee.name.toLowerCase().includes(query);

      if (!titleMatch && !descMatch && !projectMatch && !assigneeMatch) {
        return false;
      }
    }

    // 3. Status filter
    if (filters.status && filters.status !== "all") {
      if (task.status !== filters.status) {
        return false;
      }
    }

    // 4. Priority filter
    if (filters.priority && filters.priority !== "all") {
      if (task.priority !== filters.priority) {
        return false;
      }
    }

    return true;
  });
}

export function getUniqueTechStacks(projects: Project[]): string[] {
  const stackSet = new Set<string>();
  projects.forEach((p) => {
    p.techStack.forEach((t) => stackSet.add(t));
  });
  return Array.from(stackSet).sort();
}
