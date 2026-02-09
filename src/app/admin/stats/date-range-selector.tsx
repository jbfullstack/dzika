"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRange } from "@/types";

const ranges: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export function DateRangeSelector({ current }: { current: DateRange }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(value: string) {
    router.push(`${pathname}?range=${value}`);
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px] border-white/10 bg-[var(--theme-surface)]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-neutral-900 border-white/15 text-white">
        {ranges.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
