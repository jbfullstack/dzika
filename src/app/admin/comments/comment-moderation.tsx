"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StarDisplay } from "@/components/comment/star-display";
import { replyToComment, deleteComment } from "@/actions/comment-actions";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ModerationComment {
  id: string;
  nickname: string;
  content: string;
  rating: number | null;
  isAdminReply: boolean;
  createdAt: string;
  trackTitle: string;
  trackSlug: string;
  replies: {
    id: string;
    nickname: string;
    content: string;
    isAdminReply: boolean;
    createdAt: string;
  }[];
}

interface CommentModerationProps {
  initialComments: ModerationComment[];
}

export function CommentModeration({ initialComments }: CommentModerationProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment and all its replies?")) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function handleReplied() {
    router.refresh();
    window.location.reload();
  }

  if (comments.length === 0) {
    return (
      <Card className="border-white/10 bg-[var(--theme-surface)]">
        <CardContent className="py-12 text-center text-white/40">
          No comments yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.id} className="border-white/10 bg-[var(--theme-surface)]">
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{comment.nickname}</span>
                  <span className="text-xs text-white/30">on</span>
                  <Badge variant="outline" className="text-xs">{comment.trackTitle}</Badge>
                  <span className="text-xs text-white/30">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {comment.rating !== null && comment.rating > 0 && (
                    <StarDisplay rating={comment.rating} />
                  )}
                </div>
                <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Existing replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{reply.nickname}</span>
                          <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                            Admin
                          </Badge>
                          <span className="text-xs text-white/30">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/70">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-1">
                <ReplyDialog commentId={comment.id} onReplied={handleReplied} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                  className="text-white/40 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReplyDialog({
  commentId,
  onReplied,
}: {
  commentId: string;
  onReplied: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReply() {
    if (!content.trim()) return;
    setLoading(true);

    try {
      await replyToComment(commentId, content);
      toast.success("Reply posted");
      setContent("");
      setOpen(false);
      onReplied();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/40 hover:text-blue-400">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply as Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleReply} disabled={loading || !content.trim()}>
              {loading ? "Posting..." : "Reply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
