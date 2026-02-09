import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--theme-bg)]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          DZIKA
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/themes"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Themes
          </Link>
          <Link
            href="/artist"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Artist
          </Link>
        </nav>
      </div>
    </header>
  );
}
