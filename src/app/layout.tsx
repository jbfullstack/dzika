import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AudioPlayerProvider } from "@/components/audio/audio-player-provider";
import { AudioPlayer } from "@/components/audio/audio-player";
import { getContentMap } from "@/actions/content-actions";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentMap("artist_name", "home_hero_subtitle");
  const artistName = content.artist_name || "Dzika";
  const subtitle = content.home_hero_subtitle || "Immersive beats. Bold sounds.";

  return {
    title: {
      default: `${artistName} — Music`,
      template: `%s | ${artistName}`,
    },
    description: `Discover the music of ${artistName} — ${subtitle.toLowerCase()}`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen`}>
        <AudioPlayerProvider>
          {children}
          <AudioPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
