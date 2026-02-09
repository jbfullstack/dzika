"use client";

import { useState } from "react";
import Link from "next/link";
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
import { reorderThemes } from "@/actions/theme-actions";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface ThemeRow {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  trackCount: number;
  primaryColor: string;
  accentColor: string;
}

interface ThemeTableProps {
  initialThemes: ThemeRow[];
}

export function ThemeTable({ initialThemes }: ThemeTableProps) {
  const [themes, setThemes] = useState(initialThemes);
  const [reordering, setReordering] = useState(false);

  async function moveTheme(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= themes.length) return;

    const newThemes = [...themes];
    [newThemes[index], newThemes[targetIndex]] = [
      newThemes[targetIndex],
      newThemes[index],
    ];
    setThemes(newThemes);

    setReordering(true);
    try {
      await reorderThemes(newThemes.map((t) => t.id));
    } catch {
      setThemes(themes);
      toast.error("Failed to reorder");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[var(--theme-surface)]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="w-[60px]">Order</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Tracks</TableHead>
            <TableHead>Status</TableHead>
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
          {themes.map((theme, index) => (
            <TableRow key={theme.id} className="border-white/10">
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveTheme(index, "up")}
                    disabled={index === 0 || reordering}
                    className="rounded p-0.5 text-white/20 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/20"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTheme(index, "down")}
                    disabled={index === themes.length - 1 || reordering}
                    className="rounded p-0.5 text-white/20 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/20"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    }}
                  />
                  <div>
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-white/40">/{theme.slug}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{theme.trackCount}</TableCell>
              <TableCell>
                <Badge variant={theme.isActive ? "default" : "secondary"}>
                  {theme.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/themes/${theme.id}`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
