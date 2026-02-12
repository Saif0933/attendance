// src/api/task.api.ts
import { api } from "../../../api/api";
import {
  CreateTaskPayload,
  GetTasksResponse,
  TaskActionResponse,
  TaskFilters,
  UpdateTaskPayload,
} from "../../hook/type/task";

/* ---------- CREATE ---------- */
export const createTaskApi = async (
  payload: CreateTaskPayload
): Promise<TaskActionResponse> => {
  const { data } = await api.post<TaskActionResponse>(
    "/task",
    payload
  );
  return data;
};

/* ---------- GET ALL (BY COMPANY ID) ---------- */
export const getAllTasksApi = async (
  companyId: string,
  filters?: TaskFilters
): Promise<GetTasksResponse> => {
  const { data } = await api.get<GetTasksResponse>(
    `/task/all/${companyId}`,
    {
      params: filters,
    }
  );
  return data;
};

/* ---------- GET BY ID ---------- */
export const getTaskByIdApi = async (id: string): Promise<TaskActionResponse> => {
  const { data } = await api.get<TaskActionResponse>(
    `/task/${id}`
  );
  return data;
};

/* ---------- UPDATE ---------- */
export const updateTaskApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTaskPayload;
}): Promise<TaskActionResponse> => {
  const { data } = await api.put<TaskActionResponse>(
    `/task/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ---------- */
export const deleteTaskApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(
    `/task/${id}`
  );
  return data;
};
