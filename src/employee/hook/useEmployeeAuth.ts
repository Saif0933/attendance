import { useMutation } from "@tanstack/react-query";
import {
  requestEmployeeOtpApi,
  verifyEmployeeOtpApi,
  EmployeeRequestOtpPayload,
  EmployeeVerifyOtpPayload,
  EmployeeVerifyOtpResponse,
} from "../hook/employeeAuth.api";

/* ---------- REQUEST OTP ---------- */
export const useEmployeeRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: EmployeeRequestOtpPayload) =>
      requestEmployeeOtpApi(payload),
  });
};

/* ---------- VERIFY OTP ---------- */
export const useEmployeeVerifyOtp = () => {
  return useMutation<
    EmployeeVerifyOtpResponse,
    Error,
    EmployeeVerifyOtpPayload
  >({
    mutationFn: (payload) => verifyEmployeeOtpApi(payload),
  });
};
