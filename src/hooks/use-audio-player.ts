"use client";

import { useContext } from "react";
import { AudioPlayerContext } from "@/components/audio/audio-player-provider";

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return ctx;
}
