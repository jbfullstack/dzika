import type { ThemeStyles } from "@/types/theme-styles";
import { defaultThemeStyles } from "@/types/theme-styles";

interface ThemeProviderProps {
  styles: Partial<ThemeStyles>;
  className?: string;
  children: React.ReactNode;
}

function stylesToCSSVars(styles: Partial<ThemeStyles>): React.CSSProperties {
  const merged = { ...defaultThemeStyles, ...styles };
  return {
    "--theme-primary": merged.primaryColor,
    "--theme-secondary": merged.secondaryColor,
    "--theme-accent": merged.accentColor,
    "--theme-bg": merged.backgroundColor,
    "--theme-surface": merged.surfaceColor,
    "--theme-text": merged.textColor,
    "--theme-text-muted": merged.textMutedColor,
    "--theme-font": `'${merged.fontFamily}', sans-serif`,
    "--theme-font-heading": `'${merged.fontHeadingFamily}', sans-serif`,
    "--theme-radius": merged.borderRadius,
    "--theme-gradient-start": merged.gradientStart || merged.backgroundColor,
    "--theme-gradient-end": merged.gradientEnd || merged.surfaceColor,
    "--theme-gradient-angle": `${merged.gradientAngle || 135}deg`,
  } as React.CSSProperties;
}

function getAnimationClass(animationType: string): string {
  switch (animationType) {
    case "fade-in": return "animate-fade-in";
    case "slide-up": return "animate-slide-up";
    case "slide-left": return "animate-slide-left";
    case "glitch": return "animate-glitch";
    case "pulse-glow": return "animate-pulse-glow";
    case "wave": return "animate-wave";
    case "float": return "animate-float";
    case "flicker": return "animate-flicker";
    case "grain": return "animate-grain";
    default: return "";
  }
}

export function ThemeProvider({ styles, className, children }: ThemeProviderProps) {
  const merged = { ...defaultThemeStyles, ...styles };
  const cssVars = stylesToCSSVars(styles);
  const animClass = getAnimationClass(merged.animationType);

  return (
    <div
      style={cssVars}
      className={`relative min-h-screen ${className || ""}`}
    >
      {/* Background layer */}
      {merged.backgroundImage && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${merged.backgroundImage})`,
            filter: merged.backgroundBlur ? `blur(${merged.backgroundBlur}px)` : undefined,
          }}
        >
          {merged.backgroundOverlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: merged.backgroundOverlay }}
            />
          )}
        </div>
      )}

      {!merged.backgroundImage && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: `linear-gradient(${merged.gradientAngle || 135}deg, ${merged.gradientStart || merged.backgroundColor}, ${merged.gradientEnd || merged.surfaceColor})`,
          }}
        />
      )}

      <div
        className={animClass}
        style={{
          color: "var(--theme-text)",
          fontFamily: "var(--theme-font)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
