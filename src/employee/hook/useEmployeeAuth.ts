import { useMutation } from "@tanstack/react-query";
import {
  requestEmployeeOtpApi,
  verifyEmployeeOtpApi,
  loginWithPasswordApi,
  EmployeeRequestOtpPayload,
  EmployeeVerifyOtpPayload,
  EmployeeVerifyOtpResponse,
  EmployeeLoginWithPasswordPayload,
} from "../hook/employeeAuth.api";
import { showError } from "../../utils/meesage";

/* ---------- REQUEST OTP ---------- */
export const useEmployeeRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: EmployeeRequestOtpPayload) =>
      requestEmployeeOtpApi(payload),
    onError(error){
      showError(error)
    }
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
    onError(error){
      showError(error)
    }
  });
};

/* ---------- LOGIN WITH PASSWORD ---------- */
export const useEmployeeLoginWithPassword = () => {
  return useMutation<
    EmployeeVerifyOtpResponse,
    Error,
    EmployeeLoginWithPasswordPayload
  >({
    mutationFn: (payload) => loginWithPasswordApi(payload),
    onError(error) {
      showError(error);
    },
  });
};
