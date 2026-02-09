// src/api/auth.api.ts
import { api } from "../../../../api/api";

/* ---------- TYPES ---------- */

export interface RequestOtpPayload {
  mobile: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  data: {
    mobile: string;
    otp: string;
  };
}

export interface VerifyOtpPayload {
  mobile: string;
  otp: string;
}

export interface Company {
  id: string;
  name: string | null;
  code: string;
  numberOfEmployees: number | null;
  address: string | null;
  logo: string | null;
  email: string | null;
  phone: string;
  website: string | null;
  gstNumber: string | null;
  estiblishedDate: string | null;
  status: string;
  payPeriod: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  company: Company;
}

/* ---------- API CALLS ---------- */

export const requestOtpApi = async (payload: RequestOtpPayload) => {
  const { data } = await api.post<RequestOtpResponse>(
    "/company/auth/request-otp",
    payload
  );
  return data;
};

export const verifyOtpApi = async (payload: VerifyOtpPayload) => {
  const { data } = await api.post<VerifyOtpResponse>(
    "/company/auth/verify-otp",
    payload
  );
  return data;
};
