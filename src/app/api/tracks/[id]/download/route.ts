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

  let body: { versionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { versionId } = body;
  if (!versionId) {
    return NextResponse.json({ error: "versionId required" }, { status: 400 });
  }

  // Check version exists and is downloadable
  const version = await prisma.trackVersion.findUnique({
    where: { id: versionId },
  });

  if (!version || !version.isDownloadable || version.trackId !== trackId) {
    return NextResponse.json({ error: "Not found or not downloadable" }, { status: 404 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);
  const userAgent = request.headers.get("user-agent") || null;

  await prisma.$transaction([
    prisma.trackEvent.create({
      data: {
        type: "DOWNLOAD",
        trackId,
        versionId,
        ipHash,
        userAgent,
      },
    }),
    prisma.track.update({
      where: { id: trackId },
      data: { downloadCount: { increment: 1 } },
    }),
    prisma.trackVersion.update({
      where: { id: versionId },
      data: { downloadCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ url: version.audioUrl });
}
