"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DateRange, TimeSeriesPoint } from "@/types";

const CHART_COLORS = {
  plays: "#3b82f6",
  downloads: "#10b981",
  grid: "rgba(255,255,255,0.05)",
  axis: "rgba(255,255,255,0.3)",
};

const tooltipStyle = {
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "white",
};

function formatDate(dateStr: string, range: DateRange): string {
  const date = new Date(dateStr);
  if (range === "7d" || range === "30d" || range === "90d") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

interface StatsChartsProps {
  data: TimeSeriesPoint[];
  range: DateRange;
}

export function StatsCharts({ data, range }: StatsChartsProps) {
  const formattedData = data.map((d) => ({
    ...d,
    label: formatDate(d.date, range),
  }));

  if (data.length === 0) {
    return (
      <Card className="border-white/10 bg-[var(--theme-surface)]">
        <CardHeader>
          <CardTitle className="text-lg">Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-sm text-white/40">
            No activity data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-[var(--theme-surface)]">
      <CardHeader>
        <CardTitle className="text-lg">Activity Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="combined">
          <TabsList className="mb-4">
            <TabsTrigger value="combined">Combined</TabsTrigger>
            <TabsTrigger value="plays">Plays</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="combined">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                  />
                  <XAxis
                    dataKey="label"
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="plays"
                    stroke={CHART_COLORS.plays}
                    fill={CHART_COLORS.plays}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Plays"
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke={CHART_COLORS.downloads}
                    fill={CHART_COLORS.downloads}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Downloads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="plays">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                  />
                  <XAxis
                    dataKey="label"
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="plays"
                    stroke={CHART_COLORS.plays}
                    fill={CHART_COLORS.plays}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name="Plays"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="downloads">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                  />
                  <XAxis
                    dataKey="label"
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={CHART_COLORS.axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke={CHART_COLORS.downloads}
                    fill={CHART_COLORS.downloads}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name="Downloads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
