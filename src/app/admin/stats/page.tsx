export const dynamic = "force-dynamic";

import {
  getStatsOverview,
  getTimeSeries,
  getTopTracks,
  getThemeStats,
  getRecentActivity,
} from "@/actions/stats-actions";
import type { DateRange } from "@/types";
import { StatsKpiCards } from "./stats-kpi-cards";
import { DateRangeSelector } from "./date-range-selector";
import { StatsCharts } from "./stats-charts";
import { StatsTopTracks } from "./stats-top-tracks";
import { StatsThemeBreakdown } from "./stats-theme-breakdown";
import { StatsActivityFeed } from "./stats-activity-feed";

interface StatsPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminStatsPage({
  searchParams,
}: StatsPageProps) {
  const params = await searchParams;
  const range = (
    ["7d", "30d", "90d", "all"].includes(params.range || "")
      ? params.range
      : "30d"
  ) as DateRange;

  const [overview, timeSeries, topTracks, themeStats, recentActivity] =
    await Promise.all([
      getStatsOverview(range),
      getTimeSeries(range),
      getTopTracks(range),
      getThemeStats(range),
      getRecentActivity(),
    ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="mt-1 text-sm text-white/60">
            Analytics and insights for your music platform
          </p>
        </div>
        <DateRangeSelector current={range} />
      </div>

      <StatsKpiCards overview={overview} />

      <StatsCharts data={timeSeries} range={range} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StatsTopTracks topTracks={topTracks} />
        <StatsThemeBreakdown themes={themeStats} />
      </div>

      <StatsActivityFeed events={recentActivity} />
    </div>
  );
}
