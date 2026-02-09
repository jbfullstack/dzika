import Link from "next/link";
import type { ThemeStyles } from "@/types/theme-styles";
import { defaultThemeStyles } from "@/types/theme-styles";

interface ThemeCardProps {
  name: string;
  slug: string;
  description: string | null;
  styles: Partial<ThemeStyles>;
  trackCount?: number;
}

export function ThemeCard({ name, slug, description, styles, trackCount }: ThemeCardProps) {
  const merged = { ...defaultThemeStyles, ...styles };

  return (
    <Link href={`/themes/${slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-xl border border-white/10 p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20"
        style={{
          background: `linear-gradient(135deg, ${merged.backgroundColor}, ${merged.surfaceColor})`,
        }}
      >
        {/* Accent glow */}
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ backgroundColor: merged.accentColor }}
        />

        <h3
          className="text-2xl font-bold tracking-tight"
          style={{
            color: merged.primaryColor,
            fontFamily: `'${merged.fontHeadingFamily}', sans-serif`,
          }}
        >
          {name}
        </h3>

        {description && (
          <p
            className="mt-2 text-sm line-clamp-2"
            style={{ color: merged.textMutedColor }}
          >
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {trackCount !== undefined && (
            <span
              className="text-xs"
              style={{ color: merged.textMutedColor }}
            >
              {trackCount} {trackCount === 1 ? "track" : "tracks"}
            </span>
          )}
          <span
            className="text-xs font-medium transition-colors group-hover:underline"
            style={{ color: merged.accentColor }}
          >
            Step inside
          </span>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          style={{ backgroundColor: merged.accentColor }}
        />
      </div>
    </Link>
  );
}
