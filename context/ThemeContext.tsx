import { getThemeColors, ThemeColors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | null>(null);
const THEME_STORAGE_KEY = "app-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log("Failed to load theme", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.log("Failed to save theme", error);
    }
  }, [theme]);

  const colors = useMemo(() => getThemeColors(theme), [theme]);

  const value = useMemo(() => ({ theme, toggleTheme, colors }), [theme, toggleTheme, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}