export const dynamic = "force-dynamic";

import Link from "next/link";
import { getThemes } from "@/actions/theme-actions";
import { Button } from "@/components/ui/button";
import { ThemeTable } from "@/components/admin/theme-table";
import { Plus } from "lucide-react";

export default async function AdminThemesPage() {
  const themes = await getThemes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Themes</h1>
          <p className="mt-1 text-sm text-white/60">
            Manage your musical categories and their visual styles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/themes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Theme
          </Link>
        </Button>
      </div>

      <ThemeTable
        initialThemes={themes.map((theme) => {
          const styles = theme.styles as Record<string, string>;
          return {
            id: theme.id,
            name: theme.name,
            slug: theme.slug,
            isActive: theme.isActive,
            sortOrder: theme.sortOrder,
            trackCount: theme._count.tracks,
            primaryColor: styles.primaryColor || "#fff",
            accentColor: styles.accentColor || "#f44",
          };
        })}
      />
    </div>
  );
}
