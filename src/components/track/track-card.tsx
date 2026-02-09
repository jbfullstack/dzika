"use client";

import Link from "next/link";
import { PlayButton } from "@/components/audio/play-button";
import { Play, Download } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { PlayerTrack, PlayerVersion } from "@/components/audio/audio-player-provider";

interface TrackCardProps {
  track: {
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
  };
}

export function TrackCard({ track }: TrackCardProps) {
  const mainVersion = track.versions[0];

  const playerTrack: PlayerTrack = {
    id: track.id,
    title: track.title,
    slug: track.slug,
    coverImageUrl: track.coverImageUrl,
    theme: { name: track.theme.name, slug: track.theme.slug },
  };

  const playerVersions: PlayerVersion[] = track.versions.map((v) => ({
    id: v.id,
    name: v.name,
    audioUrl: v.audioUrl,
    duration: v.duration,
    isDownloadable: v.isDownloadable,
  }));

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[var(--theme-surface)] transition-all duration-200 hover:border-white/20">
      {/* Cover image */}
      <Link href={`/tracks/${track.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {track.coverImageUrl ? (
            <img
              src={track.coverImageUrl}
              alt={track.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5">
              <Play className="h-12 w-12 text-white/10" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <PlayButton track={playerTrack} versions={playerVersions} size="lg" />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/tracks/${track.slug}`}>
          <h3 className="truncate font-medium hover:underline">{track.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-white/40">{track.theme.name}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-white/30">
          {mainVersion && (
            <span>{formatDuration(mainVersion.duration)}</span>
          )}
          <span className="flex items-center gap-0.5">
            <Play className="h-3 w-3" /> {track.playCount}
          </span>
          <span className="flex items-center gap-0.5">
            <Download className="h-3 w-3" /> {track.downloadCount}
          </span>
          {track.versions.length > 1 && (
            <span>{track.versions.length} versions</span>
          )}
        </div>
      </div>
    </div>
  );
}
