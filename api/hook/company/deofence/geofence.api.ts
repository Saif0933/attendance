// src/api/geofence.api.ts
import { api } from "../../../../api/api";
import { ApiResponse, Geofence, GeofencePayload } from "../../type/geofence";
/* ---------- CREATE ---------- */
export const createGeofenceApi = async (
  payload: GeofencePayload
): Promise<ApiResponse<Geofence>> => {
  const { data } = await api.post(
    "/company/geofence",
    payload
  );
  return data;
};

/* ---------- READ ALL ---------- */
export const getAllGeofencesApi = async (): Promise<ApiResponse<Geofence[]>> => {
  const { data } = await api.get(
    "/company/geofence"
  );
  return data;
};

/* ---------- READ ONE ---------- */
export const getGeofenceByIdApi = async (id: string): Promise<ApiResponse<Geofence>> => {
  const { data } = await api.get(
    `/company/geofence/${id}`
  );
  return data;
};

/* ---------- UPDATE ---------- */
export const updateGeofenceApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<GeofencePayload>;
}): Promise<ApiResponse<Geofence>> => {
  const { data } = await api.put(
    `/company/geofence/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ---------- */
export const deleteGeofenceApi = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await api.delete(
    `/company/geofence/${id}`
  );
  return data;
};
