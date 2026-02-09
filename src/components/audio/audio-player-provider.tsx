"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface PlayerTrack {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  theme: { name: string; slug: string };
}

export interface PlayerVersion {
  id: string;
  name: string;
  audioUrl: string;
  duration: number;
  isDownloadable: boolean;
}

interface AudioPlayerState {
  track: PlayerTrack | null;
  version: PlayerVersion | null;
  versions: PlayerVersion[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
  isMuted: boolean;
}

interface AudioPlayerContextType extends AudioPlayerState {
  play: (track: PlayerTrack, versions: PlayerVersion[], versionIndex?: number) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  switchVersion: (versionId: string) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTrackedRef = useRef<string | null>(null);

  const [state, setState] = useState<AudioPlayerState>({
    track: null,
    version: null,
    versions: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isLoaded: false,
    isMuted: false,
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    };
    const onDurationChange = () => {
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    };
    const onLoadedData = () => {
      setState((s) => ({ ...s, isLoaded: true, duration: audio.duration || 0 }));
    };
    const onEnded = () => {
      setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
    };
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onError = () => {
      console.error("[AudioPlayer] Failed to load audio:", audio.src);
      setState((s) => ({ ...s, isPlaying: false, isLoaded: false }));
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadeddata", onLoadedData);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadeddata", onLoadedData);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Track play event after 3 seconds of playback
  useEffect(() => {
    if (!state.isPlaying || !state.track || !state.version) return;

    const key = `${state.track.id}:${state.version.id}`;
    if (playTrackedRef.current === key) return;

    const timer = setTimeout(() => {
      if (playTrackedRef.current === key) return;
      playTrackedRef.current = key;

      fetch(`/api/tracks/${state.track!.id}/play?versionId=${state.version!.id}`, {
        method: "POST",
      }).catch((e) => console.error("[AudioPlayer]", e));
    }, 3000);

    return () => clearTimeout(timer);
  }, [state.isPlaying, state.track, state.version]);

  const play = useCallback(
    (track: PlayerTrack, versions: PlayerVersion[], versionIndex = 0) => {
      const audio = audioRef.current;
      if (!audio) return;

      const version = versions[versionIndex];
      if (!version) return;

      // Reset play tracking for new track/version
      const key = `${track.id}:${version.id}`;
      if (playTrackedRef.current !== key) {
        playTrackedRef.current = null;
      }

      audio.src = version.audioUrl;
      audio.play().catch((e) => console.error("[AudioPlayer]", e));

      setState((s) => ({
        ...s,
        track,
        version,
        versions,
        isLoaded: false,
        currentTime: 0,
      }));
    },
    []
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.version) return;

    if (audio.paused) {
      audio.play().catch((e) => console.error("[AudioPlayer]", e));
    } else {
      audio.pause();
    }
  }, [state.version]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setState((s) => ({ ...s, currentTime: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = vol;
    setState((s) => ({ ...s, volume: vol, isMuted: vol === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.volume > 0) {
      audio.volume = 0;
      setState((s) => ({ ...s, isMuted: true }));
    } else {
      audio.volume = state.volume || 0.8;
      setState((s) => ({ ...s, isMuted: false }));
    }
  }, [state.volume]);

  const switchVersion = useCallback(
    (versionId: string) => {
      const audio = audioRef.current;
      if (!audio || !state.track) return;

      const version = state.versions.find((v) => v.id === versionId);
      if (!version) return;

      const wasPlaying = !audio.paused;
      audio.src = version.audioUrl;
      if (wasPlaying) audio.play().catch((e) => console.error("[AudioPlayer]", e));

      playTrackedRef.current = null;

      setState((s) => ({
        ...s,
        version,
        isLoaded: false,
        currentTime: 0,
      }));
    },
    [state.track, state.versions]
  );

  return (
    <AudioPlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        switchVersion,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
