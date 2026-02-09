export const dynamic = "force-dynamic";

import { getAllComments, getTrackRatings } from "@/actions/comment-actions";
import { CommentModeration } from "./comment-moderation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarDisplay } from "@/components/comment/star-display";

export default async function AdminCommentsPage() {
  const [{ comments, total }, ratings] = await Promise.all([
    getAllComments(),
    getTrackRatings(),
  ]);

  const tracksWithRatings = ratings.filter((r) => r.ratingCount > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="mt-1 text-sm text-white/60">
          {total} total comments across all tracks
        </p>
      </div>

      {/* Average ratings per track */}
      {tracksWithRatings.length > 0 && (
        <Card className="border-white/10 bg-[var(--theme-surface)]">
          <CardHeader>
            <CardTitle className="text-lg">Average Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tracksWithRatings.map((track) => (
                <div key={track.id} className="flex items-center justify-between">
                  <span className="text-sm">{track.title}</span>
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={track.averageRating} showValue />
                    <span className="text-xs text-white/30">
                      ({track.ratingCount} rating{track.ratingCount !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comment list */}
      <CommentModeration
        initialComments={comments.map((c) => ({
          id: c.id,
          nickname: c.nickname,
          content: c.content,
          rating: c.rating,
          isAdminReply: c.isAdminReply,
          createdAt: c.createdAt.toISOString(),
          trackTitle: c.track.title,
          trackSlug: c.track.slug,
          replies: c.replies.map((r) => ({
            id: r.id,
            nickname: r.nickname,
            content: r.content,
            isAdminReply: r.isAdminReply,
            createdAt: r.createdAt.toISOString(),
          })),
        }))}
      />
    </div>
  );
}
