// src/api/attendance.api.ts
import { api } from "../../../api/api";
import {
  CheckInPayload,
  CheckOutPayload,
  GetAttendanceQuery,
} from "../type/attendance.type";

/* ---------- CHECK IN ---------- */
export const checkInApi = async (payload: CheckInPayload) => {
  const { data } = await api.post(
    "/attendance/check-in",
    payload
  );
  return data;
};

/* ---------- CHECK OUT ---------- */
export const checkOutApi = async (payload: CheckOutPayload) => {
  const { data } = await api.post(
    "/attendance/check-out",
    payload
  );
  return data;
};

/* ---------- GET ATTENDANCE ---------- */
export const getAttendanceApi = async (
  query: GetAttendanceQuery
) => {
  const { data } = await api.get(
    "/attendance",
    { params: query }
  );
  return data;
};

/* ---------- DAILY SUMMARY ---------- */
export const getDailyAttendanceSummaryApi = async (
  date?: string
) => {
  const { data } = await api.get(
    "/attendance/summary",
    {
      params: date ? { date } : undefined,
    }
  );
  return data;
};
