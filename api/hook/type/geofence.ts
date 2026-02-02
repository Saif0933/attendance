// src/types/geofence.ts

export interface CreateGeofencePayload {
  name: string;
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
  radius: number;     // positive
}

export type GeofencePayload = CreateGeofencePayload;

export type UpdateGeofencePayload = Partial<CreateGeofencePayload>;

export interface Geofence extends CreateGeofencePayload {
  id: string;         // cuid
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
