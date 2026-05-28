export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  project_id: number;
  responsible_user_id: number;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskStatusUpdate {
  status: TaskStatus;
}
