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
    url?: string;
  };
}

/* ---------- API CALLS ---------- */

// POST /company/onboard
export const onboardCompanyApi = async (
  payload: OnboardCompanyPayload
) => {
  // If there's a logo/file, use FormData
  if (payload.logo) {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && typeof value === 'object' && (value as any).uri) {
          // React Native specific File object format
          formData.append('logo', {
            uri: (value as any).uri,
            name: (value as any).name || 'logo.jpg',
            type: (value as any).type || 'image/jpeg',
          } as any);
        } else {
          formData.append(key, value as any);
        }
      }
    });

    const { data } = await api.post(
      "/company/onboard",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Prevents React Native Axios from trying to JSON.stringify the FormData
        transformRequest: (data) => {
          return data;
        },
      }
    );
    return data;
  } else {
    // Plain JSON for text-only updates
    const { data } = await api.post("/company/onboard", payload);
    return data;
  }
};

// GET /company/:id
export const getCompanyByIdApi = async (id: string | number) => {
  const { data } = await api.get(`/company/${id}`);
  return data;
};
