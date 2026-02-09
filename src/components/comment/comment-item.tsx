import { StarDisplay } from "./star-display";
import { Badge } from "@/components/ui/badge";

interface CommentItemProps {
  comment: {
    id: string;
    nickname: string;
    content: string;
    rating: number | null;
    isAdminReply: boolean;
    createdAt: Date | string;
    replies?: {
      id: string;
      nickname: string;
      content: string;
      isAdminReply: boolean;
      createdAt: Date | string;
    }[];
  };
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.nickname}</span>
            {comment.isAdminReply && (
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                Admin
              </Badge>
            )}
            <span className="text-xs text-white/30">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          {comment.rating !== null && comment.rating > 0 && (
            <StarDisplay rating={comment.rating} />
          )}
        </div>
        <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>

      {/* Admin replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 space-y-2">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{reply.nickname}</span>
                {reply.isAdminReply && (
                  <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-white/30">
                  {formatDate(reply.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
