"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function getAllComments(options?: {
  trackId?: string;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 30;
  const skip = (page - 1) * limit;
  const where = options?.trackId ? { trackId: options.trackId, parentId: null } : { parentId: null };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        track: { select: { id: true, title: true, slug: true } },
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { comments, total, page, totalPages: Math.ceil(total / limit) };
}

export async function replyToComment(commentId: string, content: string) {
  await requireAdmin();

  const parent = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { trackId: true },
  });

  if (!parent) throw new Error("Comment not found");

  const reply = await prisma.comment.create({
    data: {
      nickname: "Admin",
      content,
      isAdminReply: true,
      trackId: parent.trackId,
      parentId: commentId,
    },
  });

  revalidatePath("/admin/comments");
  return reply;
}

export async function deleteComment(commentId: string) {
  await requireAdmin();

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath("/admin/comments");
}

export async function getTrackRatings() {
  const tracks = await prisma.track.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      _count: { select: { comments: true } },
    },
  });

  const ratings = await Promise.all(
    tracks.map(async (track) => {
      const agg = await prisma.comment.aggregate({
        where: { trackId: track.id, rating: { not: null } },
        _avg: { rating: true },
        _count: { rating: true },
      });
      return {
        ...track,
        averageRating: agg._avg.rating || 0,
        ratingCount: agg._count.rating,
      };
    })
  );

  return ratings;
}
