// src/hooks/useTask.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTaskPayload,
  TaskFilters,
  UpdateTaskPayload,
} from "../type/task";
import {
  createTaskApi,
  deleteTaskApi,
  getAllTasksApi,
  getTaskByIdApi,
  updateTaskApi,
} from "./task.api";

/* ---------- GET ALL BY COMPANY ---------- */
export const useGetAllTasks = (companyId: string, filters?: TaskFilters) => {
  const cleanFilters = filters ? Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any) : undefined;

  return useQuery({
    queryKey: ["tasks", companyId, cleanFilters],
    queryFn: () => getAllTasksApi(companyId, cleanFilters),
    enabled: !!companyId,
  });
};

/* ---------- GET BY ID ---------- */
export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- CREATE ---------- */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      createTaskApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/* ---------- UPDATE ---------- */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTaskPayload;
    }) => updateTaskApi({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.id],
      });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
