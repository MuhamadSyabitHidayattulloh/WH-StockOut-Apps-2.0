import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('darkMode', JSON.stringify(newTheme));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const setTheme = async (isDark) => {
    try {
      setIsDarkMode(isDark);
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDark));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  // Theme colors based on current mode
  const theme = {
    isDarkMode,
    isLoading,
    toggleTheme,
    setTheme,
    colors: isDarkMode ? {
      // Dark mode colors
      primary: '#1f2937',      // bg-gray-900
      secondary: '#111827',    // bg-gray-800
      surface: '#374151',      // bg-gray-700
      card: '#1f2937',         // bg-gray-800/50
      border: '#4b5563',       // border-gray-600
      text: '#ffffff',         // text-white
      textSecondary: '#9ca3af', // text-gray-400
      textMuted: '#6b7280',    // text-gray-500
      accent: '#3b82f6',       // bg-blue-600
      accentHover: '#2563eb',  // bg-blue-700
      success: '#10b981',      // bg-green-600
      error: '#ef4444',        // bg-red-600
      warning: '#f59e0b',      // bg-yellow-600
    } : {
      // Light mode colors
      primary: '#ffffff',      // bg-white
      secondary: '#f9fafb',    // bg-gray-50
      surface: '#f3f4f6',      // bg-gray-100
      card: '#ffffff',         // bg-white
      border: '#e5e7eb',       // border-gray-200
      text: '#111827',         // text-gray-900
      textSecondary: '#6b7280', // text-gray-500
      textMuted: '#9ca3af',    // text-gray-400
      accent: '#3b82f6',       // bg-blue-600
      accentHover: '#2563eb',  // bg-blue-700
      success: '#10b981',      // bg-green-600
      error: '#ef4444',        // bg-red-600
      warning: '#f59e0b',      // bg-yellow-600
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 