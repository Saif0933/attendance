// src/api/holiday.api.ts
import {api} from "../../../api/api";
import {
  Holiday,
  HolidayFilters,
  PaginatedHolidayResponse,
} from "../type/holiday";

// 🔹 Get All Holidays (Protected)
export const getHolidaysApi = async (
  filters: HolidayFilters
): Promise<PaginatedHolidayResponse> => {
  const { page = 1, limit = 10, ...query } = filters;

  const { data } = await api.get("/holiday", {
    params: query,
  });

  const holidays: Holiday[] = data.data;

  const total = holidays.length;
  const startIndex = (page - 1) * limit;
  const paginated = holidays.slice(startIndex, startIndex + limit);

  return {
    holidays: paginated,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// 🔹 Public Get Holidays By Company ID
export const getPublicHolidaysApi = async (
  companyId: string,
  filters: HolidayFilters
): Promise<PaginatedHolidayResponse> => {
  const { page = 1, limit = 10, ...query } = filters;

  const { data } = await api.get(`/holiday/all/${companyId}`, {
    params: query,
  });

  const holidays: Holiday[] = data.data;

  const total = holidays.length;
  const startIndex = (page - 1) * limit;
  const paginated = holidays.slice(startIndex, startIndex + limit);

  return {
    holidays: paginated,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// 🔹 Create
export const createHolidayApi = async (payload: {
  name: string;
  description?: string;
  date: string;
  isPaid?: boolean;
}) => {
  const { data } = await api.post("/holiday", payload);
  return data.data;
};

// 🔹 Update
export const updateHolidayApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: {
    name?: string;
    description?: string;
    date?: string;
    isPaid?: boolean;
  };
}) => {
  const { data } = await api.put(`/holiday/${id}`, payload);
  return data.data;
};

// 🔹 Delete
export const deleteHolidayApi = async (id: string) => {
  const { data } = await api.delete(`/holiday/${id}`);
  return data.data;
};
