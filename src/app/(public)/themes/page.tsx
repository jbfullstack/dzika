export const dynamic = "force-dynamic";

import { getActiveThemes } from "@/actions/theme-actions";
import { ThemeCard } from "@/components/theme/theme-card";
import type { ThemeStyles } from "@/types/theme-styles";

export const metadata = {
  title: "Themes",
  description: "Explore different sonic universes",
};

export default async function ThemesPage() {
  const themes = await getActiveThemes();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Themes</h1>
        <p className="mt-2 text-white/60">
          Each theme is a unique sonic universe with its own identity
        </p>
      </div>

      {themes.length === 0 ? (
        <p className="text-white/40">No themes available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              name={theme.name}
              slug={theme.slug}
              description={theme.description}
              styles={theme.styles as Partial<ThemeStyles>}
              trackCount={theme._count.tracks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
