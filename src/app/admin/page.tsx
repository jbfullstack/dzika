export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Palette, MessageSquare, BarChart3 } from "lucide-react";
import { getStatsOverview } from "@/actions/stats-actions";

export default async function AdminDashboard() {
  const overview = await getStatsOverview("all");

  const cards = [
    {
      title: "Total Tracks",
      value: overview.totalTracks.toLocaleString(),
      icon: Music,
    },
    {
      title: "Themes",
      value: overview.totalThemes.toLocaleString(),
      icon: Palette,
    },
    {
      title: "Total Plays",
      value: overview.totalPlays.toLocaleString(),
      icon: BarChart3,
    },
    {
      title: "Comments",
      value: overview.totalComments.toLocaleString(),
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">
          Overview of your music platform
        </p>
      </div>

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
