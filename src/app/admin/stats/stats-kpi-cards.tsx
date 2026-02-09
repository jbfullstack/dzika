import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Download,
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { StatsOverview } from "@/types";

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}
    >
      <Icon className="h-3 w-3" />
      {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}

export function StatsKpiCards({ overview }: { overview: StatsOverview }) {
  const cards = [
    {
      title: "Total Plays",
      value: overview.totalPlays.toLocaleString(),
      icon: Play,
      trend: overview.playsTrend,
      subtitle: undefined as string | undefined,
    },
    {
      title: "Total Downloads",
      value: overview.totalDownloads.toLocaleString(),
      icon: Download,
      trend: overview.downloadsTrend,
      subtitle: undefined as string | undefined,
    },
    {
      title: "Comments",
      value: overview.totalComments.toLocaleString(),
      icon: MessageSquare,
      trend: null,
      subtitle: undefined as string | undefined,
    },
    {
      title: "Average Rating",
      value:
        overview.ratingCount > 0
          ? `${overview.averageRating.toFixed(1)} / 5`
          : "No ratings",
      icon: Star,
      trend: null,
      subtitle:
        overview.ratingCount > 0
          ? `${overview.ratingCount} rating${overview.ratingCount !== 1 ? "s" : ""}`
          : undefined,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-white/10 bg-[var(--theme-surface)]"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="mt-1 flex items-center gap-2">
              <TrendBadge value={card.trend} />
              {card.subtitle && (
                <span className="text-xs text-white/40">{card.subtitle}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
