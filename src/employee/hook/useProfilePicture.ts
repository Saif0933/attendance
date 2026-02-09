// src/hooks/useProfilePicture.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadProfilePictureApi,
  deleteProfilePictureApi,
} from "../hook/profilePicture.api";
import { UploadProfilePicturePayload } from "../validator/employee.validator";

/* ---------- UPLOAD / UPDATE ---------- */
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadProfilePicturePayload) =>
      uploadProfilePictureApi(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee", variables.employeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) =>
      deleteProfilePictureApi(employeeId),
    onSuccess: (_, employeeId) => {
      queryClient.invalidateQueries({
        queryKey: ["employee", employeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};
