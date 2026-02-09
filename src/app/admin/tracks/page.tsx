export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTracks } from "@/actions/track-actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TrackTableFilter } from "@/components/admin/track-table-filter";

export default async function AdminTracksPage() {
  const tracks = await getTracks();

  const rows = tracks.map((track) => ({
    id: track.id,
    title: track.title,
    slug: track.slug,
    coverImageUrl: track.coverImageUrl,
    playCount: track.playCount,
    downloadCount: track.downloadCount,
    isActive: track.isActive,
    isFeatured: track.isFeatured,
    themeName: track.theme.name,
    versionCount: track.versions.length,
    mainVersionDuration: track.versions[0]?.duration ?? null,
  }));

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

      <TrackTableFilter tracks={rows} />
    </div>
  );
}
