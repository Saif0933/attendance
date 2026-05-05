import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, ThemeColors, ThemeType } from './colors';

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  // Sanitize the system theme to match our ThemeType ('light' | 'dark')
  const initialTheme: ThemeType = systemColorScheme === 'dark' ? 'dark' : 'light';
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  // Sync with system theme whenever it changes
  useEffect(() => {
    if (systemColorScheme === 'light' || systemColorScheme === 'dark') {
      setThemeState(systemColorScheme);
    }
  }, [systemColorScheme]);

  // Load saved theme from storage on mount (optional, but good for persistence if override is allowed)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          // If a theme was explicitly saved, we could use it, 
          // but the requirement is to follow phone theme.
          // For now, let's keep it simple and follow systemColorScheme.
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
