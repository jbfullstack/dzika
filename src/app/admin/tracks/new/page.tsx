export const dynamic = "force-dynamic";

import { getThemes } from "@/actions/theme-actions";
import { TrackForm } from "@/components/admin/track-form";

export default async function NewTrackPage() {
  const themes = await getThemes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Track</h1>
        <p className="mt-1 text-sm text-white/60">
          Add a new music track to your library
        </p>
      </div>
      <TrackForm themes={themes.map((t) => ({ id: t.id, name: t.name }))} />
    </div>
  );
}
