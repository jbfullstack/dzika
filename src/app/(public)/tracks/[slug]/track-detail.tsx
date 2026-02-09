"use client";

import { useAudioPlayer } from "@/hooks/use-audio-player";
import { PlayButton } from "@/components/audio/play-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Play, Download, Clock, Star } from "lucide-react";
import Link from "next/link";
import type { PlayerTrack, PlayerVersion } from "@/components/audio/audio-player-provider";
import { CommentList } from "@/components/comment/comment-list";

interface TrackDetailProps {
  track: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    coverImageUrl: string | null;
    playCount: number;
    downloadCount: number;
    commentsEnabled: boolean;
    theme: { id: string; name: string; slug: string; styles: unknown };
    versions: {
      id: string;
      name: string;
      audioUrl: string;
      duration: number;
      fileSize: number;
      isActive: boolean;
      isDownloadable: boolean;
      sortOrder: number;
    }[];
    comments: {
      id: string;
      nickname: string;
      content: string;
      rating: number | null;
      isAdminReply: boolean;
      createdAt: Date;
      version?: { id: string; name: string } | null;
      replies: {
        id: string;
        nickname: string;
        content: string;
        isAdminReply: boolean;
        createdAt: Date;
        version?: { id: string; name: string } | null;
      }[];
    }[];
    averageRating: number;
    ratingCount: number;
  };
}

export function TrackDetail({ track }: TrackDetailProps) {
  const player = useAudioPlayer();

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

  async function handleDownload(versionId: string, versionName: string) {
    try {
      const res = await fetch(`/api/tracks/${track.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (data.url) {
        const a = document.createElement("a");
        a.href = data.url;
        a.download = `${track.title} - ${versionName}.mp3`;
        a.click();
      }
    } catch {
      // silent fail
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:gap-8 md:flex-row">
        {/* Cover */}
        <div className="shrink-0">
          {track.coverImageUrl ? (
            <img
              src={track.coverImageUrl}
              alt={track.title}
              className="h-48 w-48 rounded-2xl object-cover shadow-2xl sm:h-64 sm:w-64"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white/5 sm:h-64 sm:w-64">
              <Play className="h-16 w-16 text-white/10" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col justify-end">
          <Link
            href={`/themes/${track.theme.slug}`}
            className="text-sm text-white/40 transition-colors hover:text-white/60"
          >
            {track.theme.name}
          </Link>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {track.title}
          </h1>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/40">
            {track.versions[0] && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(track.versions[0].duration)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              {track.playCount} plays
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {track.downloadCount} downloads
            </span>
            {track.ratingCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {track.averageRating.toFixed(1)} ({track.ratingCount})
              </span>
            )}
          </div>

          {/* Play button */}
          <div className="mt-6 flex items-center gap-3">
            <PlayButton track={playerTrack} versions={playerVersions} size="lg" />
            <span className="text-sm text-white/40">Play</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {track.description && (
        <div className="mt-8">
          <p className="whitespace-pre-wrap text-white/60">{track.description}</p>
        </div>
      )}

      {/* Versions */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Versions</h2>
        <div className="mt-4 space-y-2">
          {track.versions.map((version, index) => {
            const isCurrentVersion =
              player.track?.id === track.id &&
              player.version?.id === version.id;

            return (
              <div
                key={version.id}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                  isCurrentVersion
                    ? "border-white/20 bg-white/5"
                    : "border-white/10 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => {
                    if (isCurrentVersion) {
                      player.togglePlay();
                    } else {
                      player.play(playerTrack, playerVersions, index);
                    }
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  {isCurrentVersion && player.isPlaying ? (
                    <div className="flex gap-0.5">
                      <div className="h-3 w-0.5 animate-pulse bg-white" />
                      <div className="h-3 w-0.5 animate-pulse bg-white delay-75" />
                      <div className="h-3 w-0.5 animate-pulse bg-white delay-150" />
                    </div>
                  ) : (
                    <Play className="h-4 w-4 translate-x-0.5" fill="white" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium">{version.name}</p>
                  <p className="text-xs text-white/40">
                    {formatDuration(version.duration)} — {(version.fileSize / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {version.isDownloadable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(version.id, version.name)}
                    >
                      <Download className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">
          Comments ({track.comments.length})
        </h2>
        <div className="mt-4">
          <CommentList
            trackId={track.id}
            initialComments={track.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              version: c.version || null,
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
                version: r.version || null,
              })),
            }))}
            commentsEnabled={track.commentsEnabled}
            versions={track.versions.map((v) => ({ id: v.id, name: v.name }))}
          />
        </div>
      </div>
    </div>
  );
}
