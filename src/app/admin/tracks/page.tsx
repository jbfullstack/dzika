export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTracks } from "@/actions/track-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Play, Download } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default async function AdminTracksPage() {
  const tracks = await getTracks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracks</h1>
          <p className="mt-1 text-sm text-white/60">
            Manage your music library
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tracks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Track
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-white/10 bg-[var(--theme-surface)]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Track</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Versions</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-8 text-center text-white/40">
                  No tracks yet. Add your first track to get started.
                </TableCell>
              </TableRow>
            )}
            {tracks.map((track) => {
              const mainVersion = track.versions[0];
              return (
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
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-xs text-white/40">
                          {mainVersion
                            ? formatDuration(mainVersion.duration)
                            : "No audio"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-white/60">{track.theme.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{track.versions.length}</span>
                  </TableCell>
                  <TableCell>
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
                    <div className="flex gap-1">
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
