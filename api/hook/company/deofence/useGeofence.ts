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
import { showError } from "../../../../src/utils/meesage";

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
    onError(error) {
        showError(error)
    }
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
    onError(error) {
        showError(error)
    }
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
    onError(error) {
        showError(error)
    }
  });
};
