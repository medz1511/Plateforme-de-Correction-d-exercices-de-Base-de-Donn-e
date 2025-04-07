// ThemeContext.js (votre version améliorée)
import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [clickEffects, setClickEffects] = useState({});

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const registerClickEffect = (id, effect) => {
    setClickEffects(prev => ({ ...prev, [id]: effect }));
    setTimeout(() => {
      setClickEffects(prev => {
        const newEffects = { ...prev };
        delete newEffects[id];
        return newEffects;
      });
    }, 1000); // Disparaît après 1 seconde
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleTheme,
      clickEffects,
      registerClickEffect
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}