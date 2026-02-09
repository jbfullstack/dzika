"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/admin/file-upload";
import { createTrack, updateTrack } from "@/actions/track-actions";
import { MAX_IMAGE_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { Info, ChevronUp, ChevronDown } from "lucide-react";

interface TrackFormProps {
  track?: {
    id: string;
    title: string;
    description: string | null;
    coverImageUrl: string | null;
    themeId: string;
    isActive: boolean;
    isFeatured: boolean;
    commentsEnabled: boolean;
    sortOrder: number;
  };
  themes: { id: string; name: string }[];
}

export function TrackForm({ track, themes }: TrackFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(track?.title || "");
  const [description, setDescription] = useState(track?.description || "");
  const [coverImageUrl, setCoverImageUrl] = useState(track?.coverImageUrl || "");
  const [themeId, setThemeId] = useState(track?.themeId || "");
  const [isActive, setIsActive] = useState(track?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(track?.isFeatured ?? false);
  const [commentsEnabled, setCommentsEnabled] = useState(track?.commentsEnabled ?? true);
  const [sortOrder, setSortOrder] = useState(track?.sortOrder ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("coverImageUrl", coverImageUrl);
      formData.set("themeId", themeId);
      formData.set("isActive", String(isActive));
      formData.set("isFeatured", String(isFeatured));
      formData.set("commentsEnabled", String(commentsEnabled));
      formData.set("sortOrder", String(sortOrder));

      if (track) {
        await updateTrack(track.id, formData);
        toast.success("Track updated");
      } else {
        const created = await createTrack(formData);
        toast.success("Track created");
        // Redirect to versions page to add audio
        router.push(`/admin/tracks/${created.id}/versions`);
        return;
      }
      router.push("/admin/tracks");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function ToggleRow({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between rounded-lg border border-white/5 px-3 py-3 text-left transition-colors hover:bg-white/5"
      >
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-white/40">{description}</p>
        </div>
        <div
          className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-white" : "bg-white/15"}`}
        >
          <div
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform ${checked ? "translate-x-4 bg-black" : "translate-x-0 bg-white/60"}`}
          />
        </div>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-[var(--theme-surface)]">
            <CardHeader>
              <CardTitle className="text-lg">Track Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Track title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this track..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={themeId} onValueChange={setThemeId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-white/15 text-white">
                    {themes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[var(--theme-surface)]">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Active"
                description="Track is visible on the public site"
                checked={isActive}
                onChange={setIsActive}
              />
              <ToggleRow
                label="Featured"
                description="Highlighted on the homepage"
                checked={isFeatured}
                onChange={setIsFeatured}
              />
              <ToggleRow
                label="Comments"
                description="Visitors can leave comments"
                checked={commentsEnabled}
                onChange={setCommentsEnabled}
              />

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Display Order</p>
                    <p className="text-xs text-white/40">
                      Lower numbers appear first
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSortOrder(Math.max(0, sortOrder - 1))}
                      className="rounded-md border border-white/10 p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm tabular-nums">
                      {sortOrder}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSortOrder(sortOrder + 1)}
                      className="rounded-md border border-white/10 p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-[var(--theme-surface)]">
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                maxSize={MAX_IMAGE_FILE_SIZE}
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                type="image"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {!track && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          <p className="text-sm text-white/60">
            After creating the track, you&apos;ll be redirected to add audio files
            (versions). Tracks support multiple audio versions (e.g. V1, VHard, instrumental).
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? track ? "Updating..." : "Creating..."
            : track ? "Update Track" : "Create Track"
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tracks")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
