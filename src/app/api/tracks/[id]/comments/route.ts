import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { createHash } from "crypto";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: trackId } = await params;
  const url = request.nextUrl;
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { trackId, parentId: null },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        version: { select: { id: true, name: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            version: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.comment.count({
      where: { trackId, parentId: null },
    }),
  ]);

  return NextResponse.json({
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: trackId } = await params;

  // Check track exists and comments are enabled
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    select: { id: true, commentsEnabled: true },
  });

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
  if (!track.commentsEnabled) {
    return NextResponse.json({ error: "Comments are disabled for this track" }, { status: 403 });
  }

  // Rate limit by IP + track
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);
  const rateLimitKey = `comment:${ipHash}:${trackId}`;

  const { allowed, retryAfterMs } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    const retryMinutes = Math.ceil(retryAfterMs / 60000);
    return NextResponse.json(
      { error: `Please wait ${retryMinutes} minute${retryMinutes > 1 ? "s" : ""} before commenting again` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { nickname, content, rating, versionId } = parsed.data;

  // Validate versionId belongs to this track if provided
  if (versionId) {
    const version = await prisma.trackVersion.findFirst({
      where: { id: versionId, trackId },
    });
    if (!version) {
      return NextResponse.json(
        { error: "Invalid version for this track" },
        { status: 400 }
      );
    }
  }

  const comment = await prisma.comment.create({
    data: {
      nickname,
      content,
      rating: rating ?? null,
      trackId,
      ipHash,
      versionId: versionId ?? null,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
