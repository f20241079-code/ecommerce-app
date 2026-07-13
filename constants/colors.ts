export const baseColors = {
  primary: "#FF6B00",
  secondary: "#FF8C00",
  background: "#FFF7F1",
  card: "#FFFFFF",
  text: "#1F2937",
  subtext: "#6B7280",
  border: "#F2E4D8",
  error: "#EF4444",
  success: "#10B981",
  white: "#FFFFFF",
  black: "#000000",
};

export const Colors = {
  light: { ...baseColors },
  dark: {
    ...baseColors,
    primary: "#FF8C00",
    secondary: "#FFB347",
    background: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    subtext: "#9CA3AF",
    border: "#374151",
    error: "#F87171",
    success: "#34D399",
  },
};

export type ThemeColors = typeof Colors.light;

export function getThemeColors(theme: "light" | "dark"): ThemeColors {
  return {
    ...baseColors,
    ...(theme === "dark" ? Colors.dark : Colors.light),
  };
}