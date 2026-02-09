import { useMutation } from "@tanstack/react-query";
import {
  requestEmployeeOtpApi,
  verifyEmployeeOtpApi,
  EmployeeRequestOtpPayload,
  EmployeeVerifyOtpPayload,
  EmployeeVerifyOtpResponse,
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
