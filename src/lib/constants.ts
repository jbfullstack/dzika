import type { AnimationType } from "@/types/theme-styles";

export const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "fade-in", label: "Fade In" },
  { value: "slide-up", label: "Slide Up" },
  { value: "slide-left", label: "Slide Left" },
  { value: "glitch", label: "Glitch" },
  { value: "pulse-glow", label: "Pulse Glow" },
  { value: "wave", label: "Wave" },
  { value: "float", label: "Float" },
  { value: "flicker", label: "Flicker" },
  { value: "grain", label: "Film Grain" },
];

export const FONT_OPTIONS = [
  "Inter",
  "Playfair Display",
  "Oswald",
  "Space Mono",
  "Orbitron",
  "Space Grotesk",
  "Bebas Neue",
  "Montserrat",
  "Roboto Mono",
  "Archivo Black",
  "Poppins",
  "Raleway",
  "Fira Code",
  "JetBrains Mono",
  "Libre Baskerville",
  "DM Sans",
  "Unbounded",
  "Syne",
  "Chakra Petch",
  "Press Start 2P",
];

export const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"];
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const COMMENT_RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes
