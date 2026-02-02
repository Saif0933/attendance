// src/types/attendance.ts

export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "HALF_DAY"
  | "ON_LEAVE";

/* ---------- CHECK IN ---------- */
export interface CheckInPayload {
  employeeId: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

/* ---------- CHECK OUT ---------- */
export interface CheckOutPayload {
  employeeId: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

/* ---------- ATTENDANCE RECORD ---------- */
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  status: AttendanceStatus;
  remarks?: string;
}

/* ---------- GET ATTENDANCE QUERY ---------- */
export interface GetAttendanceQuery {
  employeeId?: string;
  startDate?: string; // yyyy-mm-dd
  endDate?: string;   // yyyy-mm-dd
}

/* ---------- DAILY SUMMARY ---------- */
export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  totalRecords: number;
  records: Attendance[];
}
