"use client";

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
}

export function HomeTrackGrid({ tracks }: HomeTrackGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
