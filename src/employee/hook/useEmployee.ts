// src/hooks/useEmployee.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteEmployeeApi,
  getAllEmployeesApi,
  getEmployeeByIdApi,
  onboardEmployeeApi,
  updateEmployeeApi,
} from "../../employee/hook/employee.api";
import { EmployeePayload } from "../../employee/validator/employee.validator";
import { showError } from "../../utils/meesage";
import { GetEmployeesQuery } from "../type/employee";

/* ---------- CREATE ---------- */
export const useOnboardEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeePayload) =>
      onboardEmployeeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError(error){
      showError(error)
    }
  });
};

/* ---------- READ ALL ---------- */
export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => getAllEmployeesApi(),
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
    onError(error){
      showError(error)
    }
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
    onError(error){
      showError(error)
    }
  });
};

// src/hooks/useEmployees.ts
export const useGetAllEmployeesWithInfiniteQuery = (query: GetEmployeesQuery) => {
  return useInfiniteQuery({
    queryKey: ["employees", query],
    queryFn: ({ pageParam = 1 }) =>
      getAllEmployeesApi({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
