"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Play, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration } from "@/lib/utils";

type StatusFilter = "all" | "active" | "inactive";

interface TrackRow {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  playCount: number;
  downloadCount: number;
  isActive: boolean;
  isFeatured: boolean;
  themeName: string;
  versionCount: number;
  mainVersionDuration: number | null;
}

interface TrackTableFilterProps {
  tracks: TrackRow[];
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function TrackTableFilter({ tracks }: TrackTableFilterProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = tracks.filter((t) => {
    const matchesQuery =
      !query.trim() ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.themeName.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      status === "all" ||
      (status === "active" && t.isActive) ||
      (status === "inactive" && !t.isActive);

    return matchesQuery && matchesStatus;
  });

  const activeCount = tracks.filter((t) => t.isActive).length;
  const inactiveCount = tracks.length - activeCount;

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks or themes..."
            className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.07]"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 p-0.5">
          {statusOptions.map((opt) => {
            const isSelected = status === opt.value;
            const count =
              opt.value === "all"
                ? tracks.length
                : opt.value === "active"
                  ? activeCount
                  : inactiveCount;

            return (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {opt.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/10 bg-[var(--theme-surface)]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Track</TableHead>
              <TableHead className="hidden sm:table-cell">Theme</TableHead>
              <TableHead className="hidden md:table-cell">Versions</TableHead>
              <TableHead className="hidden md:table-cell">Stats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-8 text-center text-white/40">
                  {query.trim() || status !== "all"
                    ? "No tracks match your filters."
                    : "No tracks yet. Add your first track to get started."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((track) => (
              <TableRow key={track.id} className="border-white/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {track.coverImageUrl ? (
                      <img
                        src={track.coverImageUrl}
                        alt={track.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/5" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{track.title}</p>
                      <p className="text-xs text-white/40">
                        {track.mainVersionDuration != null
                          ? formatDuration(track.mainVersionDuration)
                          : "No audio"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-sm text-white/60">{track.themeName}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm">{track.versionCount}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {track.playCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {track.downloadCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={track.isActive ? "default" : "secondary"}>
                      {track.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {track.isFeatured && (
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/tracks/${track.id}/versions`}>Versions</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/tracks/${track.id}`}>Edit</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Result count */}
      {(query.trim() || status !== "all") && filtered.length > 0 && (
        <p className="text-xs text-white/30">
          {filtered.length} of {tracks.length} tracks
        </p>
      )}
    </div>
  );
}
