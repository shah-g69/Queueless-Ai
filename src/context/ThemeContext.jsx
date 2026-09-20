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
    bg: "#f0f4f8",
    surface: "rgba(255,255,255,0.55)",
    surfaceSolid: "#ffffff",
    surfaceAlt: "rgba(248,250,252,0.65)",
    border: "rgba(255,255,255,0.6)",
    borderSoft: "rgba(226,232,240,0.8)",
    text: "#0f172a",
    textMuted: "#64748b",
    accent: "#0d9488",
    accentHover: "#0f766e",
    accentText: "#ffffff",
    badgeBg: "rgba(241,245,249,0.7)",
    navBg: "rgba(255,255,255,0.7)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.06)",
    alertBg: "#fef9c3",
    alertBorder: "#fef08a",
    alertText: "#854d0e",
    errorBg: "#fef2f2",
    errorText: "#dc2626",
    glow1: "rgba(13,148,136,0.12)",
    glow2: "rgba(99,102,241,0.08)",
    glow3: "rgba(236,72,153,0.06)",
    navBorder: "rgba(226,232,240,0.5)",
    innerBg: "rgba(248,250,252,0.65)",
    inputBg: "#ffffff",
  },
  dark: {
    mode: "dark",
    bg: "#0b1222",
    surface: "rgba(30,41,59,0.6)",
    surfaceSolid: "#1e293b",
    surfaceAlt: "rgba(51,65,85,0.55)",
    border: "rgba(255,255,255,0.08)",
    borderSoft: "rgba(255,255,255,0.1)",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    accent: "#0d9488",
    accentHover: "#14b8a6",
    accentText: "#ffffff",
    badgeBg: "rgba(30,41,59,0.65)",
    navBg: "rgba(15,23,42,0.75)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.2)",
    alertBg: "#422006",
    alertBorder: "#854d0e",
    alertText: "#fef08a",
    errorBg: "rgba(239,68,68,0.12)",
    errorText: "#f87171",
    glow1: "rgba(13,148,136,0.15)",
    glow2: "rgba(99,102,241,0.10)",
    glow3: "rgba(236,72,153,0.07)",
    navBorder: "rgba(255,255,255,0.06)",
    innerBg: "rgba(51,65,85,0.45)",
    inputBg: "rgba(30,41,59,0.8)",
  },
  midnight: {
    mode: "midnight",
    bg: "#060d1f",
    surface: "rgba(17,28,68,0.6)",
    surfaceSolid: "#111c44",
    surfaceAlt: "rgba(26,37,85,0.55)",
    border: "rgba(255,255,255,0.08)",
    borderSoft: "rgba(255,255,255,0.1)",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    accent: "#06b6d4",
    accentHover: "#22d3ee",
    accentText: "#0b1329",
    badgeBg: "rgba(26,37,85,0.65)",
    navBg: "rgba(11,19,41,0.8)",
    cardShadow: "0 4px 24px rgba(0,0,0,0.35)",
    alertBg: "#422006",
    alertBorder: "#854d0e",
    alertText: "#fef08a",
    errorBg: "rgba(239,68,68,0.12)",
    errorText: "#f87171",
    glow1: "rgba(6,182,212,0.15)",
    glow2: "rgba(139,92,246,0.10)",
    glow3: "rgba(236,72,153,0.07)",
    navBorder: "rgba(255,255,255,0.06)",
    innerBg: "rgba(26,37,85,0.45)",
    inputBg: "rgba(17,28,68,0.8)",
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
