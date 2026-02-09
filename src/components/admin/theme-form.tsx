"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeStyleEditor } from "@/components/theme/theme-style-editor";
import { ThemePreview } from "@/components/theme/theme-preview";
import { createTheme, updateTheme } from "@/actions/theme-actions";
import { THEME_PRESETS } from "@/lib/theme-presets";
import type { ThemeStyles } from "@/types/theme-styles";
import { defaultThemeStyles } from "@/types/theme-styles";
import { toast } from "sonner";

interface ThemeFormProps {
  theme?: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
    styles: Record<string, unknown>;
  };
}

export function ThemeForm({ theme }: ThemeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(theme?.name || "");
  const [description, setDescription] = useState(theme?.description || "");
  const [isActive, setIsActive] = useState(theme?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(theme?.sortOrder ?? 0);
  const [styles, setStyles] = useState<Partial<ThemeStyles>>(
    (theme?.styles as Partial<ThemeStyles>) || { ...defaultThemeStyles }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("isActive", String(isActive));
      formData.set("sortOrder", String(sortOrder));
      formData.set("styles", JSON.stringify(styles));

      if (theme) {
        await updateTheme(theme.id, formData);
        toast.success("Theme updated");
      } else {
        await createTheme(formData);
        toast.success("Theme created");
      }
      router.push("/admin/themes");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        {/* Left column — form fields */}
        <div className="space-y-6">
          {!theme && (
            <Card className="border-white/10 bg-[var(--theme-surface)]">
              <CardHeader>
                <CardTitle className="text-lg">Start from Preset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    const preset = THEME_PRESETS.find((p) => p.name === value);
                    if (preset) {
                      setName(preset.name);
                      setDescription(preset.description);
                      setStyles({ ...preset.styles });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a preset..." />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/15 text-white">
                    {THEME_PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/40">
                  Selecting a preset fills in all fields. You can then customize anything.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/10 bg-[var(--theme-surface)]">
            <CardHeader>
              <CardTitle className="text-lg">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Theme name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this theme's vibe..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sortOrder">Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[var(--theme-surface)]">
            <CardHeader>
              <CardTitle className="text-lg">Visual Style</CardTitle>
            </CardHeader>
            <CardContent>
              <ThemeStyleEditor styles={styles} onChange={setStyles} />
            </CardContent>
          </Card>
        </div>

        {/* Right column — live preview */}
        <div className="space-y-4">
          <div className="sticky top-8">
            <h3 className="mb-3 text-sm font-medium text-white/60">Live Preview</h3>
            <ThemePreview styles={styles} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? theme ? "Updating..." : "Creating..."
            : theme ? "Update Theme" : "Create Theme"
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/themes")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
