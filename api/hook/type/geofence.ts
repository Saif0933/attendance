// src/types/geofence.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateGeofencePayload {
  name: string;
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
  radius: number;     // positive
  employeeIds?: string[];
}

export type GeofencePayload = CreateGeofencePayload;

export type UpdateGeofencePayload = Partial<CreateGeofencePayload>;

export interface Geofence extends Omit<CreateGeofencePayload, 'employeeIds'> {
  id: string;         // cuid
  companyId: string;
  createdAt: string;
  updatedAt: string;
  employees?: any[];
}
