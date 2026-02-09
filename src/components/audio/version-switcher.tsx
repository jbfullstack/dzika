"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlayerVersion } from "./audio-player-provider";

interface VersionSwitcherProps {
  versions: PlayerVersion[];
  currentVersionId: string;
  onSwitch: (versionId: string) => void;
}

export function VersionSwitcher({
  versions,
  currentVersionId,
  onSwitch,
}: VersionSwitcherProps) {
  if (versions.length <= 1) return null;

  return (
    <Select value={currentVersionId} onValueChange={onSwitch}>
      <SelectTrigger className="h-7 w-24 border-white/10 bg-white/5 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {versions.map((v) => (
          <SelectItem key={v.id} value={v.id} className="text-xs">
            {v.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
