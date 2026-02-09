// src/api/leave.api.ts
import { api } from "../../../api";
import {
  ApplyLeavePayload,
  GetLeavesQuery,
  UpdateLeaveStatusPayload,
} from "../../leaves/type";

/* ---------- APPLY LEAVE ---------- */
export const applyLeaveApi = async (
  payload: ApplyLeavePayload
) => {
  const { data } = await api.post(
    "/leaves/apply",
    payload
  );
  return data;
};

/* ---------- GET LEAVES ---------- */
export const getLeavesApi = async (
  query: GetLeavesQuery
) => {
  const { data } = await api.get(
    "/leaves",
    { params: query }
  );
  return data;
};

/* ---------- GET LEAVE BY ID ---------- */
export const getLeaveByIdApi = async (id: string) => {
  const { data } = await api.get(
    `/leaves/${id}`
  );
  return data;
};

/* ---------- UPDATE LEAVE STATUS ---------- */
export const updateLeaveStatusApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateLeaveStatusPayload;
}) => {
  const { data } = await api.patch(
    `/leaves/${id}/status`,
    payload
  );
  return data;
};

/* ---------- DELETE LEAVE ---------- */
export const deleteLeaveApi = async (id: string) => {
  const { data } = await api.delete(
    `/leaves/${id}`
  );
  return data;
};
