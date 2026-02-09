"use client";

import { useAudioPlayer } from "@/hooks/use-audio-player";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { VersionSwitcher } from "./version-switcher";
import { Play, Pause, Download } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useEffect } from "react";
import Link from "next/link";

export function AudioPlayer() {
  const player = useAudioPlayer();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          player.togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          player.seek(Math.max(0, player.currentTime - 5));
          break;
        case "ArrowRight":
          e.preventDefault();
          player.seek(Math.min(player.duration, player.currentTime + 5));
          break;
        case "m":
        case "M":
          player.toggleMute();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player]);

  if (!player.track) return null;

  async function handleDownload() {
    if (!player.track || !player.version?.isDownloadable) return;

    try {
      const res = await fetch(`/api/tracks/${player.track.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: player.version.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[Download]", data.error || res.statusText);
        return;
      }

      const data = await res.json();
      if (data.url) {
        const a = document.createElement("a");
        a.href = data.url;
        a.download = `${player.track.title} - ${player.version.name}.mp3`;
        a.click();
      }
    } catch (err) {
      console.error("[Download]", err);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl">
      {/* Progress bar at top of player */}
      <div className="px-4">
        <ProgressBar
          currentTime={player.currentTime}
          duration={player.duration}
          onSeek={player.seek}
        />
      </div>

      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-4">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {player.track.coverImageUrl ? (
            <img
              src={player.track.coverImageUrl}
              alt={player.track.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Play className="h-4 w-4 text-white/40" />
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/tracks/${player.track.slug}`}
              className="block truncate text-sm font-medium hover:underline"
            >
              {player.track.title}
            </Link>
            <p className="truncate text-xs text-white/40">
              {player.track.theme.name}
              {player.version && ` — ${player.version.name}`}
            </p>
          </div>
        </div>

        {/* Play controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={player.togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
            aria-label={player.isPlaying ? "Pause" : "Play"}
          >
            {player.isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
            )}
          </button>
        </div>

        {/* Time */}
        <div className="hidden w-24 text-center text-xs tabular-nums text-white/60 sm:block">
          {formatDuration(Math.floor(player.currentTime))} /{" "}
          {formatDuration(Math.floor(player.duration))}
        </div>

        {/* Version switcher */}
        <div className="hidden md:block">
          <VersionSwitcher
            versions={player.versions}
            currentVersionId={player.version?.id || ""}
            onSwitch={player.switchVersion}
          />
        </div>

        {/* Volume */}
        <div className="hidden lg:block">
          <VolumeControl
            volume={player.volume}
            isMuted={player.isMuted}
            onVolumeChange={player.setVolume}
            onToggleMute={player.toggleMute}
          />
        </div>

        {/* Download */}
        {player.version?.isDownloadable && (
          <button
            onClick={handleDownload}
            className="text-white/40 transition-colors hover:text-white"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
