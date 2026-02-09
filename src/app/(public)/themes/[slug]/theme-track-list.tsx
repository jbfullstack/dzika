"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TrackCard } from "@/components/track/track-card";

interface ThemeTrackListProps {
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
}

export function ThemeTrackList({ tracks }: ThemeTrackListProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? tracks.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase())
      )
    : tracks;

  return (
    <div>
      {tracks.length > 1 && (
        <div className="mb-6 relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40" style={{ color: "var(--theme-text-muted)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tracks..."
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-white/25 focus:bg-white/[0.07]"
            style={{ color: "var(--theme-text)" }}
          />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      {query.trim() && filtered.length === 0 && (
        <p className="mt-8 text-center text-sm" style={{ color: "var(--theme-text-muted)" }}>
          No tracks matching &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
}
