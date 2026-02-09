"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            className="transition-transform hover:scale-110"
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                iconSize,
                "transition-colors",
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/20"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
