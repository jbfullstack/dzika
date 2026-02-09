"use client";

import { useState, useCallback } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  nickname: string;
  content: string;
  rating: number | null;
  isAdminReply: boolean;
  createdAt: Date | string;
  version?: { id: string; name: string } | null;
  replies: {
    id: string;
    nickname: string;
    content: string;
    isAdminReply: boolean;
    createdAt: Date | string;
    version?: { id: string; name: string } | null;
  }[];
}

interface CommentListProps {
  trackId: string;
  initialComments: Comment[];
  commentsEnabled: boolean;
  versions?: { id: string; name: string }[];
}

export function CommentList({ trackId, initialComments, commentsEnabled, versions }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialComments.length >= 20);
  const [loadingMore, setLoadingMore] = useState(false);

  const refreshComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/tracks/${trackId}/comments?page=1&limit=20`);
      const data = await res.json();
      setComments(data.comments);
      setPage(1);
      setHasMore(data.page < data.totalPages);
    } catch {
      // silent
    }
  }, [trackId]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/tracks/${trackId}/comments?page=${nextPage}&limit=20`);
      const data = await res.json();
      setComments((prev) => [...prev, ...data.comments]);
      setPage(nextPage);
      setHasMore(nextPage < data.totalPages);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="space-y-6">
      {commentsEnabled && (
        <CommentForm trackId={trackId} onSubmitted={refreshComments} versions={versions} />
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-white/30">
          No comments yet. {commentsEnabled ? "Be the first to share your thoughts!" : ""}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
