import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type BoardColor = 'white' | 'black' | 'green' | 'blue';

interface ThemeContextType {
  theme: Theme;
  boardColor: BoardColor;
  toggleTheme: () => void;
  setBoardColor: (color: BoardColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [boardColor, setBoardColor] = useState<BoardColor>('white');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedBoardColor = localStorage.getItem('boardColor') as BoardColor;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedBoardColor) setBoardColor(savedBoardColor);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSetBoardColor = (color: BoardColor) => {
    setBoardColor(color);
    localStorage.setItem('boardColor', color);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      boardColor,
      toggleTheme,
      setBoardColor: handleSetBoardColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}