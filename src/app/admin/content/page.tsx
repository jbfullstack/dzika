export const dynamic = "force-dynamic";

import { getAllContent } from "@/actions/content-actions";
import { ContentEditor } from "./content-editor";

export default async function AdminContentPage() {
  const content = await getAllContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Content</h1>
        <p className="mt-1 text-sm text-white/60">
          Manage editable text and content across the site
        </p>
      </div>

      <ContentEditor
        initialContent={content.map((c) => ({
          id: c.id,
          key: c.key,
          value: c.value,
          type: c.type,
          updatedAt: c.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
