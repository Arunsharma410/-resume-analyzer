// frontend/src/context/ThemeContext.jsx
// 🌗 Theme Context - manages dark/light mode

import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEMES } from '@utils/constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 🎨 Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;

    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  });

  // 🔄 Apply theme to <html> when it changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === THEMES.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // 👂 Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 🔁 Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === THEMES.DARK,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🪝 Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;