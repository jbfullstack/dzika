"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Download } from "lucide-react";
import type { RecentEvent } from "@/types";

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function StatsActivityFeed({ events }: { events: RecentEvent[] }) {
  if (events.length === 0) {
    return (
      <Card className="border-white/10 bg-[var(--theme-surface)]">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-white/40">
            No activity yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-[var(--theme-surface)]">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                {event.type === "PLAY" ? (
                  <Play className="h-4 w-4 text-blue-400" />
                ) : (
                  <Download className="h-4 w-4 text-emerald-400" />
                )}
                <div>
                  <span className="text-sm font-medium">
                    {event.trackTitle}
                  </span>
                  {event.versionName && (
                    <span className="ml-2 text-xs text-white/40">
                      ({event.versionName})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    event.type === "PLAY"
                      ? "border-blue-500/30 text-blue-400"
                      : "border-emerald-500/30 text-emerald-400"
                  }
                >
                  {event.type.toLowerCase()}
                </Badge>
                <span className="text-xs text-white/30">
                  {formatRelativeTime(event.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
