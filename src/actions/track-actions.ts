"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { trackSchema, trackVersionSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ─── Track reads ──────────────────────────────────────

export async function getTracks() {
  return prisma.track.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      theme: { select: { id: true, name: true, slug: true } },
      versions: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, duration: true, isActive: true },
      },
      _count: { select: { comments: true } },
    },
  });
}

export async function getActiveTracks(limit?: number) {
  return prisma.track.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
    include: {
      theme: { select: { id: true, name: true, slug: true } },
      versions: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { comments: true } },
    },
  });
}

export async function getFeaturedTracks() {
  return prisma.track.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    include: {
      theme: { select: { id: true, name: true, slug: true } },
      versions: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getTrackBySlug(slug: string) {
  const track = await prisma.track.findUnique({
    where: { slug },
    include: {
      theme: { select: { id: true, name: true, slug: true, styles: true } },
      versions: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!track) return null;

  // Calculate average rating
  const ratings = await prisma.comment.aggregate({
    where: { trackId: track.id, rating: { not: null } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    ...track,
    averageRating: ratings._avg.rating || 0,
    ratingCount: ratings._count.rating,
  };
}

export async function getTrackById(id: string) {
  return prisma.track.findUnique({
    where: { id },
    include: {
      theme: { select: { id: true, name: true } },
      versions: { orderBy: { sortOrder: "asc" } },
    },
  });
}

// ─── Track CRUD ───────────────────────────────────────

export async function createTrack(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const raw = {
    title,
    slug: slugify(title),
    description: (formData.get("description") as string) || undefined,
    themeId: formData.get("themeId") as string,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    commentsEnabled: formData.get("commentsEnabled") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const data = trackSchema.parse(raw);
  const coverImageUrl = (formData.get("coverImageUrl") as string) || null;

  const track = await prisma.track.create({
    data: {
      ...data,
      coverImageUrl,
    },
  });

  revalidatePath("/admin/tracks");
  revalidatePath("/themes");
  return track;
}

export async function updateTrack(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const raw = {
    title,
    slug: slugify(title),
    description: (formData.get("description") as string) || undefined,
    themeId: formData.get("themeId") as string,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    commentsEnabled: formData.get("commentsEnabled") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const data = trackSchema.parse(raw);
  const coverImageUrl = (formData.get("coverImageUrl") as string) || null;

  const track = await prisma.track.update({
    where: { id },
    data: {
      ...data,
      coverImageUrl,
    },
  });

  revalidatePath("/admin/tracks");
  revalidatePath(`/tracks/${track.slug}`);
  revalidatePath("/themes");
  return track;
}

export async function deleteTrack(id: string) {
  await requireAdmin();

  await prisma.track.delete({ where: { id } });

  revalidatePath("/admin/tracks");
  revalidatePath("/themes");
}

// ─── Version CRUD ─────────────────────────────────────

export async function getVersionsByTrackId(trackId: string) {
  return prisma.trackVersion.findMany({
    where: { trackId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createVersion(trackId: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    audioUrl: formData.get("audioUrl") as string,
    duration: parseInt(formData.get("duration") as string) || 0,
    fileSize: parseInt(formData.get("fileSize") as string) || 0,
    isActive: formData.get("isActive") !== "false",
    isDownloadable: formData.get("isDownloadable") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const data = trackVersionSchema.parse(raw);

  // Shift existing versions down to make room at position 0
  if (data.sortOrder === 0) {
    await prisma.trackVersion.updateMany({
      where: { trackId },
      data: { sortOrder: { increment: 1 } },
    });
  }

  const version = await prisma.trackVersion.create({
    data: {
      ...data,
      trackId,
    },
  });

  revalidatePath(`/admin/tracks/${trackId}/versions`);
  return version;
}

export async function updateVersion(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    audioUrl: formData.get("audioUrl") as string,
    duration: parseInt(formData.get("duration") as string) || 0,
    fileSize: parseInt(formData.get("fileSize") as string) || 0,
    isActive: formData.get("isActive") !== "false",
    isDownloadable: formData.get("isDownloadable") !== "false",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const data = trackVersionSchema.parse(raw);

  const version = await prisma.trackVersion.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/tracks/${version.trackId}/versions`);
  return version;
}

export async function deleteVersion(id: string) {
  await requireAdmin();

  const version = await prisma.trackVersion.findUnique({ where: { id } });
  if (!version) throw new Error("Version not found");

  await prisma.trackVersion.delete({ where: { id } });

  revalidatePath(`/admin/tracks/${version.trackId}/versions`);
}

export async function reorderVersions(trackId: string, orderedIds: string[]) {
  await requireAdmin();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.trackVersion.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath(`/admin/tracks/${trackId}/versions`);
}

export async function reorderTracks(orderedIds: string[]) {
  await requireAdmin();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.track.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/admin/tracks");
  revalidatePath("/themes");
}
