// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import {
  requestOtpApi,
  verifyOtpApi,
  RequestOtpPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../../company/auth/auth.api";

/* ---------- REQUEST OTP ---------- */
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: RequestOtpPayload) =>
      requestOtpApi(payload),
  });
};

/* ---------- VERIFY OTP ---------- */
export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: (payload) => verifyOtpApi(payload),
  });
};
