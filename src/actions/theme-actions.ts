"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { themeSchema } from "@/lib/validations";
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

export async function getThemes() {
  return prisma.theme.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { tracks: true } },
    },
  });
}

export async function getActiveThemes() {
  return prisma.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { tracks: true } },
    },
  });
}

export async function getThemeBySlug(slug: string) {
  return prisma.theme.findUnique({
    where: { slug },
    include: {
      tracks: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          versions: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });
}

export async function getThemeById(id: string) {
  return prisma.theme.findUnique({
    where: { id },
  });
}

export async function createTheme(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: slugify(formData.get("name") as string),
    description: (formData.get("description") as string) || undefined,
    isActive: formData.get("isActive") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    styles: JSON.parse((formData.get("styles") as string) || "{}"),
  };

  const data = themeSchema.parse(raw);

  const theme = await prisma.theme.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      styles: data.styles as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/admin/themes");
  revalidatePath("/themes");
  return theme;
}

export async function updateTheme(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: slugify(formData.get("name") as string),
    description: (formData.get("description") as string) || undefined,
    isActive: formData.get("isActive") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    styles: JSON.parse((formData.get("styles") as string) || "{}"),
  };

  const data = themeSchema.parse(raw);

  const theme = await prisma.theme.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      styles: data.styles as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/admin/themes");
  revalidatePath(`/themes/${theme.slug}`);
  revalidatePath("/themes");
  return theme;
}

export async function deleteTheme(id: string) {
  await requireAdmin();

  const theme = await prisma.theme.findUnique({
    where: { id },
    include: { _count: { select: { tracks: true } } },
  });

  if (!theme) throw new Error("Theme not found");
  if (theme._count.tracks > 0) {
    throw new Error("Cannot delete theme with existing tracks. Remove or reassign tracks first.");
  }

  await prisma.theme.delete({ where: { id } });

  revalidatePath("/admin/themes");
  revalidatePath("/themes");
}

export async function reorderThemes(orderedIds: string[]) {
  await requireAdmin();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.theme.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/admin/themes");
  revalidatePath("/themes");
}
