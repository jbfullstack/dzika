"use client";

import type { ThemeStyles } from "@/types/theme-styles";
import { defaultThemeStyles } from "@/types/theme-styles";

interface ThemePreviewProps {
  styles: Partial<ThemeStyles>;
}

export function ThemePreview({ styles }: ThemePreviewProps) {
  const s = { ...defaultThemeStyles, ...styles };

  return (
    <div
      className="overflow-hidden rounded-xl border border-white/10"
      style={{
        background: `linear-gradient(135deg, ${s.backgroundColor}, ${s.surfaceColor})`,
        color: s.textColor,
        fontFamily: `'${s.fontFamily}', sans-serif`,
      }}
    >
      <div className="p-6 space-y-4">
        <h3
          className="text-2xl font-bold tracking-tight"
          style={{
            color: s.primaryColor,
            fontFamily: `'${s.fontHeadingFamily}', sans-serif`,
          }}
        >
          Theme Preview
        </h3>
        <p style={{ color: s.textMutedColor }} className="text-sm">
          This is how your theme will look to visitors.
        </p>

        {/* Sample card */}
        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: s.surfaceColor,
            borderRadius: s.borderRadius,
            border: `1px solid ${s.secondaryColor}33`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: s.accentColor }}
            />
            <div>
              <p className="font-medium text-sm" style={{ color: s.textColor }}>
                Sample Track
              </p>
              <p className="text-xs" style={{ color: s.textMutedColor }}>
                3:42 — V1
              </p>
            </div>
          </div>
        </div>

        {/* Sample button */}
        <button
          className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: s.accentColor,
            color: s.backgroundColor,
            borderRadius: s.borderRadius,
          }}
        >
          Play Now
        </button>

        {/* Color swatches */}
        <div className="flex gap-2 pt-2">
          {[s.primaryColor, s.secondaryColor, s.accentColor, s.backgroundColor, s.surfaceColor].map(
            (color, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
