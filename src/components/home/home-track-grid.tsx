"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TrackCard } from "@/components/track/track-card";

interface HomeTrackGridProps {
  tracks: {
    id: string;
    title: string;
    slug: string;
    coverImageUrl: string | null;
    playCount: number;
    downloadCount: number;
    theme: { name: string; slug: string };
    versions: {
      id: string;
      name: string;
      audioUrl: string;
      duration: number;
      isDownloadable: boolean;
    }[];
  }[];
  label: string;
  subtitle: string;
}

export function HomeTrackGrid({ tracks, label, subtitle }: HomeTrackGridProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.theme.name.toLowerCase().includes(query.toLowerCase())
      )
    : tracks;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="shrink-0">
          <h2 className="text-2xl font-bold tracking-tight">{label}</h2>
          <p className="mt-1 text-sm text-white/40">{subtitle}</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tracks..."
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.07]"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      {query.trim() && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-white/30">
          No tracks matching &ldquo;{query}&rdquo;
        </p>
      )}
    </section>
  );
}
