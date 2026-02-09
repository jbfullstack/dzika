import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getContentMap } from "@/actions/content-actions";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContentMap(
    "artist_name",
    "footer_legal",
    "footer_contact_email",
    "footer_social_instagram",
    "footer_social_twitter",
    "footer_social_youtube",
    "footer_social_soundcloud",
    "footer_social_spotify"
  );

  const artistName = content.artist_name || "DZIKA";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar artistName={artistName} />
      <main className="flex-1">{children}</main>
      <Footer
        artistName={artistName}
        legalText={content.footer_legal || "All rights reserved."}
        contactEmail={content.footer_contact_email}
        socials={{
          instagram: content.footer_social_instagram,
          twitter: content.footer_social_twitter,
          youtube: content.footer_social_youtube,
          soundcloud: content.footer_social_soundcloud,
          spotify: content.footer_social_spotify,
        }}
      />
    </div>
  );
}
