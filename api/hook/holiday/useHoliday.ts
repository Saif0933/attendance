// src/hooks/useHoliday.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createHolidayApi,
    deleteHolidayApi,
    getHolidaysApi,
    getPublicHolidaysApi,
    updateHolidayApi,
} from "../../hook/holiday/holiday.api";
import { HolidayFilters } from "../../hook/type/holiday";

const queryKey = "holidays";

// ✅ Protected Holidays
export const useGetHolidays = (filters: HolidayFilters) => {
  return useQuery({
    queryKey: [queryKey, filters],
    queryFn: () => getHolidaysApi(filters),
    placeholderData: (previousData) => previousData,
  });
};

// ✅ Public Holidays
export const useGetPublicHolidays = (
  companyId: string,
  filters: HolidayFilters
) => {
  return useQuery({
    queryKey: [queryKey, companyId, filters],
    queryFn: () => getPublicHolidaysApi(companyId, filters),
    enabled: !!companyId,
    placeholderData: (previousData) => previousData,
  });
};

// ✅ Create
export const useCreateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createHolidayApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ Update
export const useUpdateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateHolidayApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

// ✅ Delete
export const useDeleteHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteHolidayApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
