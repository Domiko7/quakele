import type { CSSProperties } from "react";

interface ThemeVariables extends CSSProperties {
  "--accent": string;
}

export type ThemeMode = "strong" | "veryStrong" | "critical";

export const themes: Record<ThemeMode, ThemeVariables> = {
  strong: {
    "--accent": "#e8612c",
  },
  veryStrong: {
    "--accent": "#e82c2c",
  },
  critical: {
    "--accent": "#e82ce2",
  },
};

export const getEarthquakeColor = (magnitude: number): ThemeMode => {
  if (magnitude >= 8.0) return "critical";
  if (magnitude >= 7.5) return "veryStrong";
  return "strong";
};
