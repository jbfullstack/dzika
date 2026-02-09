import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AudioPlayerProvider } from "@/components/audio/audio-player-provider";
import { AudioPlayer } from "@/components/audio/audio-player";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DzikA — Music",
    template: "%s | DzikA",
  },
  description: "Discover the music of Dzika — immersive beats, unique themes, and bold sounds.",
};

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
