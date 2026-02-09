interface FooterProps {
  artistName: string;
  legalText: string;
  contactEmail?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    soundcloud?: string;
    spotify?: string;
  };
}

export function Footer({ artistName, legalText, contactEmail, socials }: FooterProps) {
  const socialLinks = Object.entries(socials || {}).filter(
    ([, url]) => url && url.trim() !== ""
  );

  return (
    <footer className="border-t border-white/10 bg-[var(--theme-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xl font-bold tracking-tighter">
            {artistName.toUpperCase()}
          </p>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {socialLinks.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 capitalize transition-colors hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          )}

          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm text-white/40 transition-colors hover:text-white"
            >
              {contactEmail}
            </a>
          )}

          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {artistName} — {legalText}
          </p>

          <p className="mt-4 text-[10px] tracking-widest text-white/[0.08] transition-colors duration-700 hover:text-white/30 select-none">
            Identity: A frequency · Form: Signal · Pronouns: low / high
          </p>
        </div>
      </div>
    </footer>
  );
}
