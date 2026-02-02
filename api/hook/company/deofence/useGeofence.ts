// src/hooks/useGeofence.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GeofencePayload } from "../../type/geofence";
import {
    createGeofenceApi,
    deleteGeofenceApi,
    getAllGeofencesApi,
    getGeofenceByIdApi,
    updateGeofenceApi,
} from "../deofence/geofence.api";

/* ---------- CREATE ---------- */
export const useCreateGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GeofencePayload) =>
      createGeofenceApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["geofences"],
      });
    },
  });
};

/* ---------- READ ALL ---------- */
export const useGetAllGeofences = () => {
  return useQuery({
    queryKey: ["geofences"],
    queryFn: getAllGeofencesApi,
  });
};

/* ---------- READ ONE ---------- */
export const useGetGeofenceById = (id: string) => {
  return useQuery({
    queryKey: ["geofence", id],
    queryFn: () => getGeofenceByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- UPDATE ---------- */
export const useUpdateGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGeofenceApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["geofences"] });
      queryClient.invalidateQueries({
        queryKey: ["geofence", variables.id],
      });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeofenceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["geofences"],
      });
    },
  });
};
