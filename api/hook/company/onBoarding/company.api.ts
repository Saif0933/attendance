import { api } from "../../../../api/api";

/* ---------- TYPES ---------- */

export interface OnboardCompanyPayload {
  name?: string;
  email?: string;
  phone?: string;
  code?: string;
  address?: string;
  gstNumber?: string;
  logo?: any; // 👈 file upload (changed to any for React Native FormData support)
  numberOfEmployees?: string;
  estiblishedDate?: string;
  website?: string;
  status?: string;
  payPeriod?: string;
}

export interface Company {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  code: string;
  logo?: {
    public_id: string;
    secure_url: string;
  };
}

/* ---------- API CALLS ---------- */

// POST /company/onboard
export const onboardCompanyApi = async (
  payload: OnboardCompanyPayload
) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const { data } = await api.post(
    "/company/onboard",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// GET /company/:id
export const getCompanyByIdApi = async (id: number) => {
  const { data } = await api.get(`/company/${id}`);
  return data;
};
