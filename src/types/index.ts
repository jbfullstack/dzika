export type { ThemeStyles, AnimationType } from "./theme-styles";

export interface TrackWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  commentsEnabled: boolean;
  sortOrder: number;
  playCount: number;
  downloadCount: number;
  themeId: string;
  theme: {
    id: string;
    name: string;
    slug: string;
  };
  versions: TrackVersionInfo[];
  _count?: {
    comments: number;
  };
  averageRating?: number;
  createdAt: Date;
}

export interface TrackVersionInfo {
  id: string;
  name: string;
  audioUrl: string;
  duration: number;
  fileSize: number;
  isActive: boolean;
  isDownloadable: boolean;
  sortOrder: number;
  playCount: number;
  downloadCount: number;
}

export interface CommentWithReplies {
  id: string;
  nickname: string;
  content: string;
  rating: number | null;
  isAdminReply: boolean;
  createdAt: Date;
  replies: {
    id: string;
    nickname: string;
    content: string;
    isAdminReply: boolean;
    createdAt: Date;
  }[];
}

// ─── Stats types ──────────────────────────────────────

export type DateRange = "7d" | "30d" | "90d" | "all";

export interface StatsOverview {
  totalPlays: number;
  totalDownloads: number;
  totalComments: number;
  averageRating: number;
  ratingCount: number;
  totalTracks: number;
  totalThemes: number;
  playsTrend: number | null;
  downloadsTrend: number | null;
}

export interface TimeSeriesPoint {
  date: string;
  plays: number;
  downloads: number;
}

export interface TopTrack {
  id: string;
  title: string;
  slug: string;
  themeName: string;
  playCount: number;
  downloadCount: number;
  averageRating: number;
  ratingCount: number;
}

export interface ThemeStats {
  id: string;
  name: string;
  slug: string;
  trackCount: number;
  totalPlays: number;
  totalDownloads: number;
}

export interface RecentEvent {
  id: string;
  type: "PLAY" | "DOWNLOAD";
  trackTitle: string;
  versionName: string | null;
  createdAt: string;
}
