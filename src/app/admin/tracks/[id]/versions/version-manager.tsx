"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/admin/file-upload";
import {
  createVersion,
  deleteVersion,
  reorderVersions,
} from "@/actions/track-actions";
import { MAX_AUDIO_FILE_SIZE, ACCEPTED_AUDIO_TYPES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Play,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Version {
  id: string;
  name: string;
  audioUrl: string;
  duration: number;
  fileSize: number;
  isActive: boolean;
  isDownloadable: boolean;
  sortOrder: number;
  playCount: number;
  downloadCount: number;
}

interface VersionManagerProps {
  trackId: string;
  initialVersions: Version[];
}

export function VersionManager({
  trackId,
  initialVersions,
}: VersionManagerProps) {
  const router = useRouter();
  const [versions, setVersions] = useState(initialVersions);
  const [addOpen, setAddOpen] = useState(false);
  const [reordering, setReordering] = useState(false);

  async function moveVersion(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= versions.length) return;

    const newVersions = [...versions];
    [newVersions[index], newVersions[targetIndex]] = [
      newVersions[targetIndex],
      newVersions[index],
    ];
    setVersions(newVersions);

    setReordering(true);
    try {
      await reorderVersions(
        trackId,
        newVersions.map((v) => v.id)
      );
    } catch {
      setVersions(versions);
      toast.error("Failed to reorder");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">
          {versions.length} version{versions.length !== 1 ? "s" : ""}
        </p>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Version
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Version</DialogTitle>
            </DialogHeader>
            <AddVersionForm
              trackId={trackId}
              onSuccess={() => {
                setAddOpen(false);
                router.refresh();
                window.location.reload();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {versions.length === 0 && (
        <Card className="border-white/10 bg-[var(--theme-surface)]">
          <CardContent className="py-12 text-center">
            <p className="text-white/40">
              No versions yet. Add your first audio version.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card
            key={version.id}
            className="border-white/10 bg-[var(--theme-surface)]"
          >
            <CardContent className="flex items-center gap-4 py-4">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveVersion(index, "up")}
                  disabled={index === 0 || reordering}
                  className="rounded p-0.5 text-white/20 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/20"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveVersion(index, "down")}
                  disabled={index === versions.length - 1 || reordering}
                  className="rounded p-0.5 text-white/20 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/20"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{version.name}</p>
                  <Badge
                    variant={version.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {version.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {version.isDownloadable && (
                    <Badge variant="outline" className="text-xs">
                      DL
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-white/40">
                  <span>{formatDuration(version.duration)}</span>
                  <span>
                    {(version.fileSize / 1024 / 1024).toFixed(1)}MB
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" /> {version.playCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" /> {version.downloadCount}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  if (!confirm(`Delete version "${version.name}"?`)) return;
                  try {
                    await deleteVersion(version.id);
                    toast.success("Version deleted");
                    setVersions((v) => v.filter((item) => item.id !== version.id));
                  } catch (err) {
                    toast.error(
                      err instanceof Error ? err.message : "Failed to delete"
                    );
                  }
                }}
                className="text-white/40 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddVersionForm({
  trackId,
  onSuccess,
}: {
  trackId: string;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [isDownloadable, setIsDownloadable] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!audioUrl) {
      toast.error("Please upload an audio file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("audioUrl", audioUrl);
      formData.set("duration", String(duration));
      formData.set("fileSize", String(fileSize));
      formData.set("isDownloadable", String(isDownloadable));
      formData.set("sortOrder", "0"); // New versions go to top

      await createVersion(trackId, formData);
      toast.success("Version added");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add version");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="versionName">Version Name</Label>
        <Input
          id="versionName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., V1, V2, VHard, VTechno"
          required
        />
      </div>

      <FileUpload
        accept={ACCEPTED_AUDIO_TYPES.join(",")}
        maxSize={MAX_AUDIO_FILE_SIZE}
        value={audioUrl}
        onChange={setAudioUrl}
        onFileInfo={(info) => {
          if (info.duration) setDuration(info.duration);
          setFileSize(info.fileSize);
        }}
        type="audio"
        label="Audio File"
      />

      <div className="flex items-center gap-2">
        <Switch checked={isDownloadable} onCheckedChange={setIsDownloadable} />
        <Label>Allow download</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !audioUrl}>
        {loading ? "Adding..." : "Add Version"}
      </Button>
    </form>
  );
}
