import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarDisplayProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarDisplay({ rating, size = "sm", showValue = false }: StarDisplayProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <Star
            key={star}
            className={cn(
              iconSize,
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/15"
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-xs text-white/40">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
