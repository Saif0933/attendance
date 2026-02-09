// src/api/profilePicture.api.ts
import { api } from "../../../api/api";
import { UploadProfilePicturePayload } from "../validator/employee.validator";

/* ---------- UPLOAD / UPDATE ---------- */
export const uploadProfilePictureApi = async ({
  employeeId,
  file,
}: UploadProfilePicturePayload) => {
  const formData = new FormData();
  formData.append("profilePicture", file); // MUST match multer field name

  const { data } = await api.post(
    `/employee/${employeeId}/profile-picture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/* ---------- DELETE ---------- */
export const deleteProfilePictureApi = async (employeeId: string) => {
  const { data } = await api.delete(
    `/employee/${employeeId}/profile-picture`
  );
  return data;
};
