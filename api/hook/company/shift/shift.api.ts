// src/api/shift.api.ts
import { api } from "../../../../api/api";
import {
  CreateShiftPayload,
  UpdateShiftPayload,
} from "../../type/shift";

/* ---------- CREATE ---------- */
export const createShiftApi = async (
  payload: CreateShiftPayload
) => {
  const { data } = await api.post(
    "/company/shift",
    payload
  );
  return data;
};

/* ---------- READ ALL ---------- */
export const getAllShiftsApi = async () => {
  const { data } = await api.get(
    "/company/shift"
  );
  return data;
};

/* ---------- READ ONE ---------- */
export const getShiftByIdApi = async (id: string) => {
  const { data } = await api.get(
    `/company/shift/${id}`
  );
  return data;
};

/* ---------- UPDATE ---------- */
export const updateShiftApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateShiftPayload;
}) => {
  const { data } = await api.put(
    `/company/shift/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ---------- */
export const deleteShiftApi = async (id: string) => {
  const { data } = await api.delete(
    `/company/shift/${id}`
  );
  return data;
};
