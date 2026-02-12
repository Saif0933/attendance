// src/types/category.ts

export interface CreateCategoryPayload {
  name: string;
  employeeIds?: string[];
}

export interface UpdateCategoryPayload {
  name?: string;
  employeeIds?: string[];
}

export interface Category {
  id: string;
  name: string;
  companyId: string;
  employees: {
    id: string;
    firstname: string;
    lastname: string;
    employeeCode?: number;
  }[];
  createdAt: string;
}
