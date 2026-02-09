// src/types/leave.ts

export type LeaveType =
  | "CASUAL"
  | "SICK"
  | "PRIVILEGE"
  | "EMERGENCY";

export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

/* ---------- APPLY LEAVE ---------- */
export interface ApplyLeavePayload {
  employeeId?: string; // optional (from token if not provided)
  type: LeaveType;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  reason?: string;
}

/* ---------- UPDATE STATUS ---------- */
export interface UpdateLeaveStatusPayload {
  status: LeaveStatus;
}

/* ---------- GET LEAVES QUERY ---------- */
export interface GetLeavesQuery {
  employeeId?: string;
  status?: LeaveStatus;
  type?: LeaveType;
}

/* ---------- LEAVE RECORD ---------- */
export interface Leave {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  createdAt: string;
  employee?: {
    id: string;
    firstname: string;
    lastname: string;
    employeeCode: string;
    designation: string;
  };
}
