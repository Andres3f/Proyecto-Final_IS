import api from "./api";
import type { Project, Task, TaskCreate, TaskStatusUpdate } from "../types/task";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/api/v1/projects");
  return response.data;
};

export const createProject = async (name: string, description?: string): Promise<Project> => {
  const response = await api.post<Project>("/api/v1/projects", { name, description });
  return response.data;
};

export const fetchProjectTasks = async (projectId: number): Promise<Task[]> => {
  const response = await api.get<Task[]>(`/api/v1/projects/${projectId}/tasks`);
  return response.data;
};

export const createProjectTask = async (projectId: number, task: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>(`/api/v1/projects/${projectId}/tasks`, task);
  return response.data;
};

export const updateTaskStatus = async (taskId: number, status: TaskStatusUpdate): Promise<Task> => {
  const response = await api.patch<Task>(`/api/v1/tasks/${taskId}/status`, status);
  return response.data;
};

export const updateTask = async (taskId: number, task: Partial<TaskCreate> & { status?: string }): Promise<Task> => {
  const response = await api.put<Task>(`/api/v1/tasks/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/api/v1/tasks/${taskId}`);
};

export const inviteUserToProject = async (projectId: number, email: string): Promise<void> => {
  await api.post(`/api/v1/projects/${projectId}/invite`, { email });
};
