import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  designation: string;
  employeeCode: number;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  numberOfEmployees: number | null;
  address: string | null;
  logo: any;
  email: string;
  phone: string;
  website: string | null;
  gstNumber: string | null;
  estiblishedDate: string | null;
  status: string;
  payPeriod: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeAuthState {
  token: string | null;
  employee: Employee | null;
  company: Company | null;
  isLoggedIn: boolean;
  setEmployeeAuth: (token: string, employee: Employee, company: Company) => void;
  logout: () => void;
}

export const useEmployeeAuthStore = create<EmployeeAuthState>()(
  persist(
    (set) => ({
      token: null,
      employee: null,
      company: null,
      isLoggedIn: false,
      setEmployeeAuth: (token: string, employee: Employee, company: Company) => {
        console.log('Storing Employee Auth Data:', { token: !!token, employee: !!employee, company: !!company });
        set({
          token,
          employee,
          company,
          isLoggedIn: true
        });
      },
      logout: () =>
        set({
          token: null,
          employee: null,
          company: null,
          isLoggedIn: false
        }),
    }),
    {
      name: 'employee-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
