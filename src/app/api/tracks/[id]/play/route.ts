import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: trackId } = await params;
  const versionId = request.nextUrl.searchParams.get("versionId");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);
  const userAgent = request.headers.get("user-agent") || null;

  // Deduplicate: max 1 play per IP per track per 30 minutes
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const existing = await prisma.trackEvent.findFirst({
    where: {
      trackId,
      type: "PLAY",
      ipHash,
      createdAt: { gte: thirtyMinAgo },
    },
  });

  if (existing) {
    return NextResponse.json({ ok: true, deduplicated: true });
  }

  await prisma.$transaction([
    prisma.trackEvent.create({
      data: {
        type: "PLAY",
        trackId,
        versionId,
        ipHash,
        userAgent,
      },
    }),
    prisma.track.update({
      where: { id: trackId },
      data: { playCount: { increment: 1 } },
    }),
    ...(versionId
      ? [
          prisma.trackVersion.update({
            where: { id: versionId },
            data: { playCount: { increment: 1 } },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ ok: true });
}
