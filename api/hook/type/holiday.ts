// src/types/holiday.ts

export interface Holiday {
  id: string;
  name: string;
  description?: string;
  date: string;
  isPaid: boolean;
  companyId: string;
  createdAt: string;
}

export interface HolidayFilters {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedHolidayResponse {
  holidays: Holiday[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
