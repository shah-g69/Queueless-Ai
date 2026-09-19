import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

/**
 * Theme tokens – every component reads colours from here.
 *
 *   mode       – "light" | "dark" | "midnight"
 *   bg         – page background
 *   surface    – card / panel surface
 *   surfaceAlt – slightly different surface (e.g. hover, badge bg)
 *   border     – default border colour
 *   text       – primary text
 *   textMuted  – secondary / muted text
 *   accent     – primary accent (teal/emerald)
 *   accentHover – accent hover state
 *   accentText – text placed on accent background
 *   badgeBg    – badge / chip background
 *   navBg      – bottom nav bar background
 */
const themes = {
  light: {
    mode: "light",
    bg: "#f1f5f9",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    accent: "#0d9488",
    accentHover: "#0f766e",
    accentText: "#ffffff",
    badgeBg: "#f1f5f9",
    navBg: "#ffffff",
    cardShadow: "0 1px 8px rgba(0,0,0,0.04)",
    alertBg: "#fef9c3",
    alertBorder: "#fef08a",
    alertText: "#854d0e",
  },
  dark: {
    mode: "dark",
    bg: "#0f172a",
    surface: "#1e293b",
    surfaceAlt: "#334155",
    border: "#334155",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    accent: "#0d9488",
    accentHover: "#14b8a6",
    accentText: "#ffffff",
    badgeBg: "#1e293b",
    navBg: "#1e293b",
    cardShadow: "0 1px 8px rgba(0,0,0,0.25)",
    alertBg: "#422006",
    alertBorder: "#854d0e",
    alertText: "#fef08a",
  },
  midnight: {
    mode: "midnight",
    bg: "#0b1329",
    surface: "#111c44",
    surfaceAlt: "#1a2555",
    border: "#1e3a5f",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    accent: "#06b6d4",
    accentHover: "#22d3ee",
    accentText: "#0b1329",
    badgeBg: "#1a2555",
    navBg: "#111c44",
    cardShadow: "0 1px 8px rgba(0,0,0,0.4)",
    alertBg: "#422006",
    alertBorder: "#854d0e",
    alertText: "#fef08a",
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const theme = themes[mode];

  const toggleTheme = (newMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
