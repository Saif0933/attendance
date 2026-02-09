// src/api/employee.api.ts
import { api } from "../../../api/api";
import { GetEmployeesQuery, GetEmployeesResponse } from "../type/employee";
import { EmployeePayload } from "../validator/employee.validator";

/* ---------- CREATE ---------- */
export const onboardEmployeeApi = async (
  payload: EmployeePayload
) => {
  const { data } = await api.post(
    "/employee/onboard",
    payload
  );
  return data;
};

/* ---------- READ ALL ---------- */
export const getAllEmployeesApi = async (query?: GetEmployeesQuery) => {
  const { data } = await api.get<GetEmployeesResponse>("/employee", {
    params: query,
  });
  return data;
};

/* ---------- READ ONE ---------- */
export const getEmployeeByIdApi = async (id: string) => {
  const { data } = await api.get(`/employee/${id}`);
  return data;
};

/* ---------- UPDATE ---------- */
export const updateEmployeeApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<EmployeePayload>;
}) => {
  const { data } = await api.put(
    `/employee/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ---------- */
export const deleteEmployeeApi = async (id: string) => {
  const { data } = await api.delete(`/employee/${id}`);
  return data;
};

