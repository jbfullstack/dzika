export type AnimationType =
  | "none"
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "glitch"
  | "pulse-glow"
  | "wave"
  | "float"
  | "flicker"
  | "grain";

export interface ThemeStyles {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;
  fontFamily: string;
  fontHeadingFamily: string;
  animationType: AnimationType;
  borderRadius: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  backgroundBlur?: number;
}

export const defaultThemeStyles: ThemeStyles = {
  primaryColor: "#ffffff",
  secondaryColor: "#888888",
  accentColor: "#ff4444",
  backgroundColor: "#0a0a0a",
  surfaceColor: "#1a1a1a",
  textColor: "#ffffff",
  textMutedColor: "#888888",
  fontFamily: "Inter",
  fontHeadingFamily: "Inter",
  animationType: "none",
  borderRadius: "0.5rem",
};
