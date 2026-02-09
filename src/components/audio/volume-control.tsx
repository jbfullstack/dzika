"use client";

import { Volume2, Volume1, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const displayVolume = isMuted ? 0 : volume;

  function getIcon() {
    if (isMuted || displayVolume === 0) return VolumeX;
    if (displayVolume < 0.5) return Volume1;
    return Volume2;
  }

  const Icon = getIcon();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="text-white/60 transition-colors hover:text-white"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <Icon className="h-4 w-4" />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={displayVolume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/10 accent-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        aria-label="Volume"
      />
    </div>
  );
}
