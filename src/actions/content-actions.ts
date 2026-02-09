"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { siteContentSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function getAllContent() {
  return prisma.siteContent.findMany({
    orderBy: { key: "asc" },
  });
}

export async function getContent(key: string) {
  return prisma.siteContent.findUnique({
    where: { key },
  });
}

export async function upsertContent(formData: FormData) {
  await requireAdmin();

  const raw = {
    key: formData.get("key") as string,
    value: formData.get("value") as string,
  };

  const data = siteContentSchema.parse(raw);
  const type = (formData.get("type") as string) || "TEXT";

  const content = await prisma.siteContent.upsert({
    where: { key: data.key },
    update: { value: data.value, type: type as never },
    create: { key: data.key, value: data.value, type: type as never },
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
  return content;
}

export async function deleteContent(key: string) {
  await requireAdmin();

  await prisma.siteContent.delete({
    where: { key },
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
}
