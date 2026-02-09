import { notFound } from "next/navigation";
import { getThemeBySlug } from "@/actions/theme-actions";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeTrackList } from "./theme-track-list";
import type { ThemeStyles } from "@/types/theme-styles";
import type { Metadata } from "next";

interface ThemePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) return {};

  return {
    title: theme.name,
    description: theme.description || `Explore ${theme.name} tracks`,
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  const styles = theme.styles as Partial<ThemeStyles>;

  return (
    <ThemeProvider styles={styles}>
      <div className="mx-auto max-w-7xl px-6 py-16 pb-28">
        <div className="mb-12">
          <h1
            className="text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--theme-font-heading)",
              color: "var(--theme-primary)",
            }}
          >
            {theme.name}
          </h1>
          {theme.description && (
            <p className="mt-3 text-lg" style={{ color: "var(--theme-text-muted)" }}>
              {theme.description}
            </p>
          )}
          <p className="mt-1 text-sm" style={{ color: "var(--theme-text-muted)" }}>
            {theme.tracks.length} {theme.tracks.length === 1 ? "track" : "tracks"}
          </p>
        </div>

        {theme.tracks.length === 0 ? (
          <p style={{ color: "var(--theme-text-muted)" }}>
            No tracks in this theme yet.
          </p>
        ) : (
          <ThemeTrackList
            tracks={theme.tracks.map((track) => ({
              id: track.id,
              title: track.title,
              slug: track.slug,
              coverImageUrl: track.coverImageUrl,
              playCount: track.playCount,
              downloadCount: track.downloadCount,
              theme: { name: theme.name, slug: theme.slug },
              versions: track.versions.map((v) => ({
                id: v.id,
                name: v.name,
                audioUrl: v.audioUrl,
                duration: v.duration,
                isDownloadable: v.isDownloadable,
              })),
            }))}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
