export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTrackById } from "@/actions/track-actions";
import { getThemes } from "@/actions/theme-actions";
import { TrackForm } from "@/components/admin/track-form";
import { DeleteTrackButton } from "./delete-button";

export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [track, themes] = await Promise.all([
    getTrackById(id),
    getThemes(),
  ]);

  if (!track) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Track</h1>
          <p className="mt-1 text-sm text-white/60">
            Modify &ldquo;{track.title}&rdquo;
          </p>
        </div>
        <DeleteTrackButton trackId={track.id} trackTitle={track.title} />
      </div>
      <TrackForm
        track={{
          id: track.id,
          title: track.title,
          description: track.description,
          coverImageUrl: track.coverImageUrl,
          themeId: track.themeId,
          isActive: track.isActive,
          isFeatured: track.isFeatured,
          commentsEnabled: track.commentsEnabled,
          sortOrder: track.sortOrder,
        }}
        themes={themes.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  );
}
