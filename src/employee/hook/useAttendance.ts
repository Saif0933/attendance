// src/hooks/useAttendance.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    checkInApi,
    checkOutApi,
    getAttendanceApi,
    getDailyAttendanceSummaryApi,
} from "../hook/attendance.api";
import {
    CheckInPayload,
    CheckOutPayload,
    GetAttendanceQuery,
} from "../type/attendance.type";

/* ---------- CHECK IN ---------- */
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckInPayload) =>
      checkInApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
    },
  });
};

/* ---------- CHECK OUT ---------- */
export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckOutPayload) =>
      checkOutApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
    },
  });
};

/* ---------- GET ATTENDANCE ---------- */
export const useGetAttendance = (query: GetAttendanceQuery) => {
  return useQuery({
    queryKey: ["attendance", query],
    queryFn: () => getAttendanceApi(query),
    enabled: !!query.employeeId,
  });
};

/* ---------- DAILY SUMMARY ---------- */
export const useGetDailyAttendanceSummary = (date?: string) => {
  return useQuery({
    queryKey: ["attendance-summary", date],
    queryFn: () => getDailyAttendanceSummaryApi(date),
    enabled: !!date,
  });
};
