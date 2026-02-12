// src/types/task.ts

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface TaskFilters {
  startDate?: string;
  endDate?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  employeeId?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  employeeId?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  employeeId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt: string;
  companyId: string;
  employeeId?: string;
  employee?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface GetTasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface TaskActionResponse {
  success: boolean;
  message: string;
  data: Task;
}
