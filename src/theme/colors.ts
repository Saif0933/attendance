export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export const lightTheme: ThemeColors = {
  background: '#F8F9FB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  primary: '#4B43F0',
  secondary: '#10B981',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const darkTheme: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  primary: '#6366F1',
  secondary: '#34D399',
  border: '#334155',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
};
