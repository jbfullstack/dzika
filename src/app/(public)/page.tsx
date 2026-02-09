export const dynamic = "force-dynamic";

import Link from "next/link";
import { getActiveThemes } from "@/actions/theme-actions";
import { getFeaturedTracks, getActiveTracks } from "@/actions/track-actions";
import { ThemeCard } from "@/components/theme/theme-card";
import { HomeTrackGrid } from "@/components/home/home-track-grid";
import type { ThemeStyles } from "@/types/theme-styles";

export default async function HomePage() {
  const [themes, featuredTracks, recentTracks] = await Promise.all([
    getActiveThemes(),
    getFeaturedTracks(),
    getActiveTracks(6),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-7xl font-bold tracking-tighter sm:text-8xl">
          DZIKA
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/50">
          Immersive beats. Bold sounds. Explore unique sonic universes.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/themes"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            Explore Themes
          </Link>
          <Link
            href="/artist"
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            About
          </Link>
        </div>
      </section>

      {/* Featured tracks */}
      {featuredTracks.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
          <p className="mt-1 text-sm text-white/40">Hand-picked tracks</p>
          <div className="mt-6">
            <HomeTrackGrid
              tracks={featuredTracks.map((t) => ({
                id: t.id,
                title: t.title,
                slug: t.slug,
                coverImageUrl: t.coverImageUrl,
                playCount: t.playCount,
                downloadCount: t.downloadCount,
                theme: { name: t.theme.name, slug: t.theme.slug },
                versions: t.versions.map((v) => ({
                  id: v.id,
                  name: v.name,
                  audioUrl: v.audioUrl,
                  duration: v.duration,
                  isDownloadable: v.isDownloadable,
                })),
              }))}
            />
          </div>
        </section>
      )}

      {/* Recent tracks */}
      {recentTracks.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Latest</h2>
          <p className="mt-1 text-sm text-white/40">Recently added</p>
          <div className="mt-6">
            <HomeTrackGrid
              tracks={recentTracks.map((t) => ({
                id: t.id,
                title: t.title,
                slug: t.slug,
                coverImageUrl: t.coverImageUrl,
                playCount: t.playCount,
                downloadCount: t.downloadCount,
                theme: { name: t.theme.name, slug: t.theme.slug },
                versions: t.versions.map((v) => ({
                  id: v.id,
                  name: v.name,
                  audioUrl: v.audioUrl,
                  duration: v.duration,
                  isDownloadable: v.isDownloadable,
                })),
              }))}
            />
          </div>
        </section>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Themes</h2>
          <p className="mt-1 text-sm text-white/40">Explore sonic universes</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </section>
      )}
    </div>
  );
}
