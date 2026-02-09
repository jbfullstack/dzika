"use client";

import type { ThemeStyles, AnimationType } from "@/types/theme-styles";
import { defaultThemeStyles } from "@/types/theme-styles";
import { ColorPicker } from "./color-picker";
import { FontSelector } from "./font-selector";
import { AnimationSelector } from "./animation-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ThemeStyleEditorProps {
  styles: Partial<ThemeStyles>;
  onChange: (styles: Partial<ThemeStyles>) => void;
}

export function ThemeStyleEditor({ styles, onChange }: ThemeStyleEditorProps) {
  const s = { ...defaultThemeStyles, ...styles };

  function update(key: keyof ThemeStyles, value: string | number) {
    onChange({ ...styles, [key]: value });
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Colors</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <ColorPicker label="Primary" value={s.primaryColor} onChange={(v) => update("primaryColor", v)} />
          <ColorPicker label="Secondary" value={s.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
          <ColorPicker label="Accent" value={s.accentColor} onChange={(v) => update("accentColor", v)} />
          <ColorPicker label="Background" value={s.backgroundColor} onChange={(v) => update("backgroundColor", v)} />
          <ColorPicker label="Surface" value={s.surfaceColor} onChange={(v) => update("surfaceColor", v)} />
          <ColorPicker label="Text" value={s.textColor} onChange={(v) => update("textColor", v)} />
          <ColorPicker label="Text Muted" value={s.textMutedColor} onChange={(v) => update("textMutedColor", v)} />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Gradient */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Gradient</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <ColorPicker label="Gradient Start" value={s.gradientStart || s.backgroundColor} onChange={(v) => update("gradientStart", v)} />
          <ColorPicker label="Gradient End" value={s.gradientEnd || s.surfaceColor} onChange={(v) => update("gradientEnd", v)} />
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Angle</Label>
            <Input
              type="number"
              min={0}
              max={360}
              value={s.gradientAngle || 135}
              onChange={(e) => update("gradientAngle", parseInt(e.target.value) || 135)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Typography */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Typography</h4>
        <div className="grid grid-cols-2 gap-4">
          <FontSelector label="Body Font" value={s.fontFamily} onChange={(v) => update("fontFamily", v)} />
          <FontSelector label="Heading Font" value={s.fontHeadingFamily} onChange={(v) => update("fontHeadingFamily", v)} />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Visual Effects */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Effects</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <AnimationSelector value={s.animationType} onChange={(v: AnimationType) => update("animationType", v)} />
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">Border Radius</Label>
            <Input
              type="text"
              value={s.borderRadius}
              onChange={(e) => update("borderRadius", e.target.value)}
              className="h-9"
              placeholder="0.5rem"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60">BG Blur (px)</Label>
            <Input
              type="number"
              min={0}
              max={50}
              value={s.backgroundBlur || 0}
              onChange={(e) => update("backgroundBlur", parseInt(e.target.value) || 0)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Background overlay */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Background Overlay</h4>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60">Overlay Color (rgba)</Label>
          <Input
            type="text"
            value={s.backgroundOverlay || ""}
            onChange={(e) => update("backgroundOverlay", e.target.value)}
            className="h-9"
            placeholder="rgba(0,0,0,0.7)"
          />
        </div>
      </div>
    </div>
  );
}
