// src/hooks/useCategory.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCategoryApi,
    deleteCategoryApi,
    getAllCategoriesApi,
    getCategoryByIdApi,
    updateCategoryApi,
} from "../hook/category.api";
import {
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../type/category";

/* ---------- GET ALL ---------- */
export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesApi,
  });
};

/* ---------- GET BY ID ---------- */
export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryByIdApi(id),
    enabled: !!id,
  });
};

/* ---------- CREATE ---------- */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      createCategoryApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/* ---------- UPDATE ---------- */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategoryApi({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({
        queryKey: ["category", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/* ---------- DELETE ---------- */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
