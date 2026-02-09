import { notFound } from "next/navigation";
import { getThemeById } from "@/actions/theme-actions";
import { ThemeForm } from "@/components/admin/theme-form";
import { DeleteThemeButton } from "./delete-button";

export default async function EditThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = await getThemeById(id);

  if (!theme) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Theme</h1>
          <p className="mt-1 text-sm text-white/60">
            Modify &ldquo;{theme.name}&rdquo; and its visual style
          </p>
        </div>
        <DeleteThemeButton themeId={theme.id} themeName={theme.name} />
      </div>
      <ThemeForm
        theme={{
          id: theme.id,
          name: theme.name,
          description: theme.description,
          isActive: theme.isActive,
          sortOrder: theme.sortOrder,
          styles: theme.styles as Record<string, unknown>,
        }}
      />
    </div>
  );
}
