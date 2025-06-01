
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type ColorScheme = 'default' | 'high-contrast' | 'custom';

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  colorScheme: ColorScheme;
  isHighContrast: boolean;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('default');
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedColorScheme) setColorSchemeState(savedColorScheme);
    setIsHighContrast(savedHighContrast);

    // Check system preference if no saved theme
    if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Apply high contrast
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('colorScheme', colorScheme);
    localStorage.setItem('highContrast', isHighContrast.toString());
  }, [theme, fontSize, colorScheme, isHighContrast]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      fontSize,
      colorScheme,
      isHighContrast,
      toggleTheme,
      setFontSize,
      setColorScheme,
      toggleHighContrast
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
