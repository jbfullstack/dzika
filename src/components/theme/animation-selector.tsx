"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ANIMATION_TYPES } from "@/lib/constants";
import type { AnimationType } from "@/types/theme-styles";

interface AnimationSelectorProps {
  value: AnimationType;
  onChange: (value: AnimationType) => void;
}

export function AnimationSelector({ value, onChange }: AnimationSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/60">Animation</Label>
      <Select value={value} onValueChange={(v) => onChange(v as AnimationType)}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ANIMATION_TYPES.map((anim) => (
            <SelectItem key={anim.value} value={anim.value}>
              {anim.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
