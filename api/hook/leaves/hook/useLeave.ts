// src/hooks/useLeave.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyLeaveApi,
  getLeavesApi,
  getLeaveByIdApi,
  updateLeaveStatusApi,
  deleteLeaveApi,
} from "../../leaves/hook/leave.api";
import {
  ApplyLeavePayload,
  GetLeavesQuery,
  UpdateLeaveStatusPayload,
} from "../../leaves/type";

/* ---------- APPLY LEAVE ---------- */
export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplyLeavePayload) =>
      applyLeaveApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
};

/* ---------- GET LEAVES ---------- */
export const useGetLeaves = (query: GetLeavesQuery) => {
  return useQuery({
    queryKey: ["leaves", query],
    queryFn: () => getLeavesApi(query),
  });
};

/* ---------- GET LEAVE BY ID ---------- */
export const useGetLeaveById = (id: string) => {
  return useQuery({
    queryKey: ["leave", id],
    queryFn: () => getLeaveByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- UPDATE STATUS ---------- */
export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLeaveStatusPayload;
    }) => updateLeaveStatusApi({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({
        queryKey: ["leave", variables.id],
      });
    },
  });
};

/* ---------- DELETE LEAVE ---------- */
export const useDeleteLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLeaveApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });
};
