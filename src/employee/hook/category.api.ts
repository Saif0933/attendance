// src/api/category.api.ts
import { api } from "../../../api/api";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  Category,
} from "../type/category";

/* ---------- CREATE ---------- */
export const createCategoryApi = async (
  payload: CreateCategoryPayload
) => {
  const { data } = await api.post<Category>(
    "/employee/category",
    payload
  );
  return data;
};

/* ---------- GET ALL ---------- */
export const getAllCategoriesApi = async () => {
  const { data } = await api.get<Category[]>(
    "/employee/category"
  );
  return data;
};

/* ---------- GET BY ID ---------- */
export const getCategoryByIdApi = async (id: string) => {
  const { data } = await api.get<Category>(
    `/employee/category/${id}`
  );
  return data;
};

/* ---------- UPDATE ---------- */
export const updateCategoryApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCategoryPayload;
}) => {
  const { data } = await api.put<Category>(
    `/employee/category/${id}`,
    payload
  );
  return data;
};

/* ---------- DELETE ---------- */
export const deleteCategoryApi = async (id: string) => {
  const { data } = await api.delete(
    `/employee/category/${id}`
  );
  return data;
};
