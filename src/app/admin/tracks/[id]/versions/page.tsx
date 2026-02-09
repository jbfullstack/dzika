export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTrackById } from "@/actions/track-actions";
import { getVersionsByTrackId } from "@/actions/track-actions";
import { VersionManager } from "./version-manager";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [track, versions] = await Promise.all([
    getTrackById(id),
    getVersionsByTrackId(id),
  ]);

  if (!track) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/tracks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Versions — {track.title}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Manage audio versions for this track
          </p>
        </div>
      </div>

      <VersionManager
        trackId={track.id}
        initialVersions={versions.map((v) => ({
          id: v.id,
          name: v.name,
          audioUrl: v.audioUrl,
          duration: v.duration,
          fileSize: v.fileSize,
          isActive: v.isActive,
          isDownloadable: v.isDownloadable,
          sortOrder: v.sortOrder,
          playCount: v.playCount,
          downloadCount: v.downloadCount,
        }))}
      />
    </div>
  );
}
