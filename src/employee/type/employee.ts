// src/types/employee.ts

export interface GetEmployeesQuery {
  companyId?: string;
  search?: string;
  designation?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeListItem {
  id: string;
  firstname: string;
  lastname: string;
  designation: string | null;
  profilePicture?: {
    url: string;
  } | null;
  attendances: {
    checkIn: string | null;
    checkOut: string | null;
    status: "PRESENT" | "LATE" | "ABSENT" | "HALF_DAY" | "ON_LEAVE";
  }[];
}

export interface GetEmployeesResponse {
  success: boolean;
  message: string;
  data: {
    employees: EmployeeListItem[];
    meta: {
      totalCount: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
