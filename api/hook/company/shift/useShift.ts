// src/hooks/useShift.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShiftApi,
  getAllShiftsApi,
  getShiftByIdApi,
  updateShiftApi,
  deleteShiftApi,
} from "../shift/shift.api";
import {
  CreateShiftPayload,
  UpdateShiftPayload,
} from "../../type/shift";
import { showError } from "../../../../src/utils/meesage";

/* ---------- CREATE ---------- */
export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShiftPayload) =>
      createShiftApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError(error){
      showError(error)
    }
  });
};

/* ---------- READ ALL ---------- */
export const useGetAllShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: getAllShiftsApi,
  });
};

/* ---------- READ ONE ---------- */
export const useGetShiftById = (id: string) => {
  return useQuery({
    queryKey: ["shift", id],
    queryFn: () => getShiftByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- UPDATE ---------- */
export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateShiftPayload;
    }) => updateShiftApi({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({
        queryKey: ["shift", variables.id],
      });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShiftApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};
