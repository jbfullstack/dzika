"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ThemeStats } from "@/types";

const CHART_COLORS = {
  plays: "#3b82f6",
  downloads: "#10b981",
  axis: "rgba(255,255,255,0.3)",
};

export function StatsThemeBreakdown({ themes }: { themes: ThemeStats[] }) {
  if (themes.length === 0) {
    return (
      <Card className="border-white/10 bg-[var(--theme-surface)]">
        <CardHeader>
          <CardTitle className="text-lg">By Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-white/40">
            No themes yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = themes.map((t) => ({
    name: t.name,
    Plays: t.totalPlays,
    Downloads: t.totalDownloads,
  }));

  return (
    <Card className="border-white/10 bg-[var(--theme-surface)]">
      <CardHeader>
        <CardTitle className="text-lg">By Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis
                type="number"
                stroke={CHART_COLORS.axis}
                fontSize={12}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke={CHART_COLORS.axis}
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Bar
                dataKey="Plays"
                fill={CHART_COLORS.plays}
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="Downloads"
                fill={CHART_COLORS.downloads}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-white/80">{theme.name}</span>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>{theme.trackCount} tracks</span>
                <span>{theme.totalPlays} plays</span>
                <span>{theme.totalDownloads} downloads</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
