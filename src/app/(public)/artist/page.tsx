import { getContentMap } from "@/actions/content-actions";
import { getActiveTracks } from "@/actions/track-actions";
import { Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentMap("artist_name");
  const name = content.artist_name || "Artist";
  return { title: name };
}

export default async function ArtistPage() {
  const [content, tracks] = await Promise.all([
    getContentMap(
      "artist_name",
      "artist_bio",
      "artist_vision",
      "artist_projects",
      "artist_image_main",
      "footer_contact_email",
      "footer_social_instagram",
      "footer_social_twitter",
      "footer_social_youtube",
      "footer_social_soundcloud",
      "footer_social_spotify"
    ),
    getActiveTracks(),
  ]);

  const artistName = content.artist_name || "Artist";
  const contactEmail = content.footer_contact_email;

  const socials = [
    { name: "Instagram", url: content.footer_social_instagram },
    { name: "Twitter", url: content.footer_social_twitter },
    { name: "YouTube", url: content.footer_social_youtube },
    { name: "SoundCloud", url: content.footer_social_soundcloud },
    { name: "Spotify", url: content.footer_social_spotify },
  ].filter((s) => s.url && s.url.trim() !== "");

  const totalPlays = tracks.reduce((sum, t) => sum + t.playCount, 0);
  const totalTracks = tracks.length;

  return (
    <div className="flex flex-col">
      {/* Hero section — full-width image */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden">
        {content.artist_image_main ? (
          <>
            <img
              src={content.artist_image_main}
              alt={artistName}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-white/5" />
        )}
      </section>

      {/* Bio — centered below hero */}
      {content.artist_bio && (
        <section className="py-10 px-6">
          <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-white/60">
            {content.artist_bio}
          </p>
        </section>
      )}

      {/* Stats bar */}
      {totalTracks > 0 && (
        <section className="border-y border-white/10">
          <div className="mx-auto flex max-w-5xl divide-x divide-white/10">
            <div className="flex-1 px-3 py-5 text-center sm:px-6 sm:py-6">
              <p className="text-2xl font-bold sm:text-3xl">{totalTracks}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                Tracks
              </p>
            </div>
            <div className="flex-1 px-3 py-5 text-center sm:px-6 sm:py-6">
              <p className="text-2xl font-bold sm:text-3xl">
                {totalPlays >= 1000
                  ? `${(totalPlays / 1000).toFixed(1)}k`
                  : totalPlays}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                Plays
              </p>
            </div>
            {socials.length > 0 && (
              <div className="flex-1 px-3 py-5 text-center sm:px-6 sm:py-6">
                <p className="text-2xl font-bold sm:text-3xl">{socials.length}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                  Platforms
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Content sections */}
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:gap-16 md:grid-cols-[1fr,280px]">
          {/* Left — main content */}
          <div className="space-y-12">
            {content.artist_vision && (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-widest text-white/30">
                  Vision
                </h2>
                <div className="mt-4 border-l-2 border-white/10 pl-6">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/70">
                    {content.artist_vision}
                  </p>
                </div>
              </div>
            )}

            {content.artist_projects && (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-widest text-white/30">
                  Projects
                </h2>
                <div className="mt-4 border-l-2 border-white/10 pl-6">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/70">
                    {content.artist_projects}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right — sidebar: contact + socials */}
          <aside className="space-y-8">
            {contactEmail && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-white/30">
                  Contact
                </h3>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {contactEmail}
                </a>
              </div>
            )}

            {socials.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest text-white/30">
                  Links
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-white/30">
                Discover
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/themes"
                  className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
                >
                  Explore Themes
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
