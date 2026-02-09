"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  DateRange,
  StatsOverview,
  TimeSeriesPoint,
  TopTrack,
  ThemeStats,
  RecentEvent,
} from "@/types";

// ─── Helpers ──────────────────────────────────────────

type Granularity = "day" | "week" | "month";

function getDateBounds(range: DateRange): { start: Date | null; end: Date } {
  const end = new Date();
  if (range === "all") return { start: null, end };
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function getPreviousPeriodBounds(
  range: DateRange
): { start: Date; end: Date } | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const end = new Date();
  end.setDate(end.getDate() - days);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function granularityForRange(range: DateRange): Granularity {
  if (range === "7d" || range === "30d") return "day";
  if (range === "90d") return "week";
  return "month";
}

// ─── getStatsOverview ─────────────────────────────────

export async function getStatsOverview(
  range: DateRange = "30d"
): Promise<StatsOverview> {
  const { start } = getDateBounds(range);
  const previousBounds = getPreviousPeriodBounds(range);

  const dateFilter = start ? { createdAt: { gte: start } } : {};

  const [
    playCount,
    downloadCount,
    commentCount,
    ratingAgg,
    trackCount,
    themeCount,
    previousPlays,
    previousDownloads,
  ] = await Promise.all([
    prisma.trackEvent.count({ where: { type: "PLAY", ...dateFilter } }),
    prisma.trackEvent.count({ where: { type: "DOWNLOAD", ...dateFilter } }),
    prisma.comment.count({
      where: { parentId: null, isAdminReply: false },
    }),
    prisma.comment.aggregate({
      where: { rating: { not: null } },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.track.count(),
    prisma.theme.count(),
    previousBounds
      ? prisma.trackEvent.count({
          where: {
            type: "PLAY",
            createdAt: { gte: previousBounds.start, lt: previousBounds.end },
          },
        })
      : Promise.resolve(0),
    previousBounds
      ? prisma.trackEvent.count({
          where: {
            type: "DOWNLOAD",
            createdAt: { gte: previousBounds.start, lt: previousBounds.end },
          },
        })
      : Promise.resolve(0),
  ]);

  const playsTrend =
    previousBounds && previousPlays > 0
      ? Math.round(((playCount - previousPlays) / previousPlays) * 100)
      : null;
  const downloadsTrend =
    previousBounds && previousDownloads > 0
      ? Math.round(
          ((downloadCount - previousDownloads) / previousDownloads) * 100
        )
      : null;

  return {
    totalPlays: playCount,
    totalDownloads: downloadCount,
    totalComments: commentCount,
    averageRating: ratingAgg._avg.rating ?? 0,
    ratingCount: ratingAgg._count.rating,
    totalTracks: trackCount,
    totalThemes: themeCount,
    playsTrend,
    downloadsTrend,
  };
}

// ─── getTimeSeries ────────────────────────────────────

export async function getTimeSeries(
  range: DateRange = "30d"
): Promise<TimeSeriesPoint[]> {
  const { start } = getDateBounds(range);
  const granularity = granularityForRange(range);

  // Build static date_trunc fragment (safe — no user input)
  const truncExpr =
    granularity === "day"
      ? Prisma.sql`date_trunc('day', "createdAt")`
      : granularity === "week"
        ? Prisma.sql`date_trunc('week', "createdAt")`
        : Prisma.sql`date_trunc('month', "createdAt")`;

  const query = start
    ? Prisma.sql`
        SELECT ${truncExpr} AS bucket, "type", COUNT(*)::int AS count
        FROM "track_events"
        WHERE "createdAt" >= ${start}
        GROUP BY bucket, "type"
        ORDER BY bucket ASC
      `
    : Prisma.sql`
        SELECT ${truncExpr} AS bucket, "type", COUNT(*)::int AS count
        FROM "track_events"
        GROUP BY bucket, "type"
        ORDER BY bucket ASC
      `;

  const rows = await prisma.$queryRaw<
    { bucket: Date; type: string; count: number }[]
  >(query);

  // Merge into a map keyed by date string
  const map = new Map<string, { plays: number; downloads: number }>();

  for (const row of rows) {
    const dateKey = row.bucket.toISOString().split("T")[0];
    const existing = map.get(dateKey) || { plays: 0, downloads: 0 };
    if (row.type === "PLAY") existing.plays = Number(row.count);
    if (row.type === "DOWNLOAD") existing.downloads = Number(row.count);
    map.set(dateKey, existing);
  }

  // Fill gaps for continuous timeline
  const result: TimeSeriesPoint[] = [];
  if (start) {
    const current = new Date(start);
    const now = new Date();
    const stepDays =
      granularity === "day" ? 1 : granularity === "week" ? 7 : 30;
    while (current <= now) {
      const key = current.toISOString().split("T")[0];
      const data = map.get(key) || { plays: 0, downloads: 0 };
      result.push({ date: key, ...data });
      current.setDate(current.getDate() + stepDays);
    }
  } else {
    for (const [date, data] of map) {
      result.push({ date, ...data });
    }
  }

  return result;
}

// ─── getTopTracks ─────────────────────────────────────

export async function getTopTracks(
  range: DateRange = "30d",
  limit: number = 10
): Promise<{ byPlays: TopTrack[]; byDownloads: TopTrack[]; byRating: TopTrack[] }> {
  const tracks = await prisma.track.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      playCount: true,
      downloadCount: true,
      theme: { select: { name: true } },
      comments: {
        where: { rating: { not: null } },
        select: { rating: true },
      },
    },
  });

  // Compute ratings in-memory (avoids N+1 aggregate queries)
  const allTracks: TopTrack[] = tracks.map((track) => {
    const ratings = track.comments
      .map((c) => c.rating)
      .filter((r): r is number => r !== null);
    const avg =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    return {
      id: track.id,
      title: track.title,
      slug: track.slug,
      themeName: track.theme.name,
      playCount: track.playCount,
      downloadCount: track.downloadCount,
      averageRating: Math.round(avg * 10) / 10,
      ratingCount: ratings.length,
    };
  });

  // For time-bounded ranges, use event counts instead of denormalized totals
  if (range !== "all") {
    const { start } = getDateBounds(range);
    const dateFilter = start ? { createdAt: { gte: start } } : {};

    const eventCounts = await prisma.trackEvent.groupBy({
      by: ["trackId", "type"],
      _count: true,
      where: dateFilter,
    });

    const playMap = new Map<string, number>();
    const downloadMap = new Map<string, number>();
    for (const row of eventCounts) {
      if (row.type === "PLAY") playMap.set(row.trackId, row._count);
      if (row.type === "DOWNLOAD") downloadMap.set(row.trackId, row._count);
    }

    const periodTracks = allTracks.map((t) => ({
      ...t,
      playCount: playMap.get(t.id) || 0,
      downloadCount: downloadMap.get(t.id) || 0,
    }));

    return {
      byPlays: [...periodTracks]
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, limit),
      byDownloads: [...periodTracks]
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, limit),
      byRating: [...allTracks]
        .filter((t) => t.ratingCount > 0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit),
    };
  }

  return {
    byPlays: [...allTracks]
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit),
    byDownloads: [...allTracks]
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit),
    byRating: [...allTracks]
      .filter((t) => t.ratingCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit),
  };
}

// ─── getThemeStats ────────────────────────────────────

export async function getThemeStats(
  range: DateRange = "30d"
): Promise<ThemeStats[]> {
  const themes = await prisma.theme.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { tracks: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  const { start } = getDateBounds(range);

  const eventCounts = await prisma.trackEvent.groupBy({
    by: ["trackId", "type"],
    _count: true,
    where: start ? { createdAt: { gte: start } } : {},
  });

  // Map trackId → themeId
  const trackToTheme = await prisma.track.findMany({
    select: { id: true, themeId: true },
  });
  const trackThemeMap = new Map(trackToTheme.map((t) => [t.id, t.themeId]));

  // Aggregate per theme
  const themePlayMap = new Map<string, number>();
  const themeDownloadMap = new Map<string, number>();

  for (const row of eventCounts) {
    const themeId = trackThemeMap.get(row.trackId);
    if (!themeId) continue;
    if (row.type === "PLAY") {
      themePlayMap.set(themeId, (themePlayMap.get(themeId) || 0) + row._count);
    } else {
      themeDownloadMap.set(
        themeId,
        (themeDownloadMap.get(themeId) || 0) + row._count
      );
    }
  }

  return themes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    slug: theme.slug,
    trackCount: theme._count.tracks,
    totalPlays: themePlayMap.get(theme.id) || 0,
    totalDownloads: themeDownloadMap.get(theme.id) || 0,
  }));
}

// ─── getRecentActivity ────────────────────────────────

export async function getRecentActivity(
  limit: number = 20
): Promise<RecentEvent[]> {
  const events = await prisma.trackEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      track: { select: { title: true } },
      version: { select: { name: true } },
    },
  });

  return events.map((e) => ({
    id: e.id,
    type: e.type,
    trackTitle: e.track.title,
    versionName: e.version?.name || null,
    createdAt: e.createdAt.toISOString(),
  }));
}
