import { api } from "../../../api/api";

/* ---------- TYPES ---------- */

export interface EmployeeRequestOtpPayload {
  mobile: string;
}

export interface EmployeeVerifyOtpPayload {
  mobile: string;
  otp: string;
}

export interface Employee {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  designation: string;
  employeeCode: number;
}

export interface EmployeeVerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  employee: Employee;
  company: any; // Using any for now or I can import Company if available
}

/* ---------- API CALLS ---------- */

// POST /api/v1/employee/auth/request-otp
export const requestEmployeeOtpApi = async (
  payload: EmployeeRequestOtpPayload
) => {
  const { data } = await api.post(
    "/employee/auth/request-otp",
    payload
  );
  return data;
};

// POST /api/v1/employee/auth/verify-otp
export const verifyEmployeeOtpApi = async (
  payload: EmployeeVerifyOtpPayload
) => {
  const { data } = await api.post<EmployeeVerifyOtpResponse>(
    "/employee/auth/verify-otp",
    payload
  );
  return data;
};
