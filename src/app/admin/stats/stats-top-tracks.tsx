"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Download, Star } from "lucide-react";
import type { TopTrack } from "@/types";

interface StatsTopTracksProps {
  topTracks: {
    byPlays: TopTrack[];
    byDownloads: TopTrack[];
    byRating: TopTrack[];
  };
}

export function StatsTopTracks({ topTracks }: StatsTopTracksProps) {
  return (
    <Card className="border-white/10 bg-[var(--theme-surface)]">
      <CardHeader>
        <CardTitle className="text-lg">Top Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plays">
          <TabsList className="mb-4">
            <TabsTrigger value="plays">
              <Play className="mr-1 h-3 w-3" />
              Plays
            </TabsTrigger>
            <TabsTrigger value="downloads">
              <Download className="mr-1 h-3 w-3" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="rating">
              <Star className="mr-1 h-3 w-3" />
              Rating
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plays">
            <TrackTable
              tracks={topTracks.byPlays}
              metric="playCount"
              label="Plays"
            />
          </TabsContent>
          <TabsContent value="downloads">
            <TrackTable
              tracks={topTracks.byDownloads}
              metric="downloadCount"
              label="Downloads"
            />
          </TabsContent>
          <TabsContent value="rating">
            <TrackTable
              tracks={topTracks.byRating}
              metric="averageRating"
              label="Rating"
              isRating
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TrackTable({
  tracks,
  metric,
  label,
  isRating = false,
}: {
  tracks: TopTrack[];
  metric: keyof TopTrack;
  label: string;
  isRating?: boolean;
}) {
  if (tracks.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-white/40">No data yet</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10 hover:bg-transparent">
          <TableHead className="w-8">#</TableHead>
          <TableHead>Track</TableHead>
          <TableHead>Theme</TableHead>
          <TableHead className="text-right">{label}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track, i) => (
          <TableRow key={track.id} className="border-white/10">
            <TableCell className="text-white/40">{i + 1}</TableCell>
            <TableCell className="font-medium">{track.title}</TableCell>
            <TableCell className="text-sm text-white/60">
              {track.themeName}
            </TableCell>
            <TableCell className="text-right">
              {isRating
                ? `${(track[metric] as number).toFixed(1)} (${track.ratingCount})`
                : (track[metric] as number).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
