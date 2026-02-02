// src/types/shift.ts

export interface CreateShiftPayload {
  name: string;
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  latePunchInLimit: number; // in minutes
}

export type UpdateShiftPayload = Partial<CreateShiftPayload>;

export interface Shift extends CreateShiftPayload {
  id: string;             // cuid
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
