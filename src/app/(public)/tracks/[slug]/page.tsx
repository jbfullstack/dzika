export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getTrackBySlug } from "@/actions/track-actions";
import { TrackDetail } from "./track-detail";
import type { Metadata } from "next";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) return {};

  return {
    title: track.title,
    description: track.description || `Listen to ${track.title}`,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);

  if (!track) {
    notFound();
  }

  return <TrackDetail track={track} />;
}
