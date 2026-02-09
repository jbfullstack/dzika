export const dynamic = "force-dynamic";

import Link from "next/link";
import { getThemes } from "@/actions/theme-actions";
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

      <div className="rounded-lg border border-white/10 bg-[var(--theme-surface)]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Theme</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {themes.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="py-8 text-center text-white/40">
                  No themes yet. Create your first theme to get started.
                </TableCell>
              </TableRow>
            )}
            {themes.map((theme) => {
              const styles = theme.styles as Record<string, string>;
              return (
                <TableRow key={theme.id} className="border-white/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${styles.primaryColor || "#fff"}, ${styles.accentColor || "#f44"})`,
                        }}
                      />
                      <div>
                        <p className="font-medium">{theme.name}</p>
                        <p className="text-xs text-white/40">/{theme.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{theme._count.tracks}</TableCell>
                  <TableCell>
                    <Badge variant={theme.isActive ? "default" : "secondary"}>
                      {theme.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{theme.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/themes/${theme.id}`}>Edit</Link>
                    </Button>
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
