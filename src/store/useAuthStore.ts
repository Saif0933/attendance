import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Company } from '../../api/hook/company/auth/auth.api';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  company: Company;
}

interface AuthState {
  token: string | null;
  company: Company | null;
  isLoggedIn: boolean;
  setAuth: (token: string, company: Company) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      company: null,
      isLoggedIn: false,
      setAuth: (token: string, company: Company) => 
        set({ 
          token, 
          company, 
          isLoggedIn: true 
        }),
      logout: () => 
        set({ 
          token: null, 
          company: null, 
          isLoggedIn: false 
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
