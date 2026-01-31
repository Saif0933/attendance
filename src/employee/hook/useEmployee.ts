// src/hooks/useEmployee.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  onboardEmployeeApi,
  getAllEmployeesApi,
  getEmployeeByIdApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from "../../employee/hook/employee.api";
import { EmployeePayload } from "../../employee/validator/employee.validator";

/* ---------- CREATE ---------- */
export const useOnboardEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeePayload) =>
      onboardEmployeeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/* ---------- READ ALL ---------- */
export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployeesApi,
  });
};

/* ---------- READ ONE ---------- */
export const useGetEmployeeById = (id: string) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- UPDATE ---------- */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployeeApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.id],
      });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
