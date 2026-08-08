'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  routeOverride: Theme | null;
  setRouteOverride: (theme: Theme | null) => void;
  activeTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  initialTheme = 'auto' 
}: { 
  children: React.ReactNode, 
  initialTheme?: Theme 
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [routeOverride, setRouteOverride] = useState<Theme | null>(null);
  const [isPending, startTransition] = useTransition();

  const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const activeTheme = routeOverride || theme;

  const setTheme = (newTheme: Theme) => {
    startTransition(() => {
      setThemeState(newTheme);
      // 1. Save to LocalStorage for instant client-side retrieval
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {}

      // 2. Save to Cookie for SSR flash-free rendering
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
      
      // 3. Update DOM attribute for immediate CSS update (no reload)
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  };

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    try {
      const localTheme = localStorage.getItem('theme') as Theme;
      if (localTheme && localTheme !== theme) {
        setTheme(localTheme);
      } else if (!localTheme) {
        setTheme('auto');
      }
    } catch (e) {}

    // Listen for OS theme changes if 'auto' is selected
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-theme', 'auto');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, routeOverride, setRouteOverride, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
