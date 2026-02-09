"use client";

import { Play, Pause } from "lucide-react";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import type { PlayerTrack, PlayerVersion } from "./audio-player-provider";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  track: PlayerTrack;
  versions: PlayerVersion[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PlayButton({ track, versions, size = "md", className }: PlayButtonProps) {
  const player = useAudioPlayer();

  const isCurrentTrack = player.track?.id === track.id;
  const isPlaying = isCurrentTrack && player.isPlaying;

  function handleClick() {
    if (isCurrentTrack) {
      player.togglePlay();
    } else {
      player.play(track, versions);
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105",
        sizeClasses[size],
        className
      )}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        <Pause className={iconSizes[size]} fill="currentColor" />
      ) : (
        <Play className={cn(iconSizes[size], "translate-x-0.5")} fill="currentColor" />
      )}
    </button>
  );
}
