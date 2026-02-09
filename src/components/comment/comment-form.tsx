"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./star-rating";

interface CommentFormProps {
  trackId: string;
  onSubmitted: () => void;
  versions?: { id: string; name: string }[];
}

export function CommentForm({ trackId, onSubmitted, versions }: CommentFormProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/tracks/${trackId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          content,
          rating: rating > 0 ? rating : undefined,
          versionId: selectedVersionId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit comment");
        return;
      }

      // Reset form
      setNickname("");
      setContent("");
      setRating(0);
      setSelectedVersionId("");
      onSubmitted();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[1fr,auto]">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-sm text-white/60">Nickname</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            required
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-white/60">Rating (optional)</Label>
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>

      {versions && versions.length > 1 && (
        <div className="space-y-2">
          <Label className="text-sm text-white/60">Version (optional)</Label>
          <Select value={selectedVersionId || "__all__"} onValueChange={(v) => setSelectedVersionId(v === "__all__" ? "" : v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All versions" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-white/15 text-white">
              <SelectItem value="__all__" className="text-white/80 focus:bg-white/10 focus:text-white">
                All versions
              </SelectItem>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.id} className="text-white/80 focus:bg-white/10 focus:text-white">
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="comment-content" className="text-sm text-white/60">Comment</Label>
        <Textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          maxLength={2000}
          rows={3}
          required
          className="bg-white/5 border-white/10"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={loading} size="sm" className="bg-white text-black hover:bg-white/90">
        {loading ? "Submitting..." : "Post Comment"}
      </Button>
    </form>
  );
}
