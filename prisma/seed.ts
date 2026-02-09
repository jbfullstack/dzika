import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─── Create default admin user ───────────────────────
  const email = process.env.ADMIN_EMAIL || "admin@dzika.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      name: "Admin",
      passwordHash,
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // ─── Seed site content ───────────────────────────────
  const contentDefaults = [
    { key: "artist_name", value: "dzika", type: "TEXT" as const },
    { key: "artist_bio", value: "Between noise and poetry", type: "MARKDOWN" as const },
    { key: "artist_vision", value: "The groove never lies", type: "MARKDOWN" as const },
    { key: "artist_projects", value: "Sonic explorations and shared journeys", type: "MARKDOWN" as const },
    { key: "artist_image_main", value: "/dzika-logo.png", type: "IMAGE_URL" as const },
    { key: "footer_legal", value: "Sound and silence reserved", type: "TEXT" as const },
    { key: "footer_contact_email", value: "dzika.music@gmail.com", type: "TEXT" as const },
    { key: "footer_social_instagram", value: "", type: "TEXT" as const },
    { key: "footer_social_twitter", value: "", type: "TEXT" as const },
    { key: "footer_social_youtube", value: "", type: "TEXT" as const },
    { key: "footer_social_soundcloud", value: "", type: "TEXT" as const },
    { key: "footer_social_spotify", value: "", type: "TEXT" as const },
    { key: "home_hero_title", value: "DZIKA", type: "TEXT" as const },
    { key: "home_hero_subtitle", value: "Between noise and poetry", type: "TEXT" as const },
  ];

  for (const content of contentDefaults) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: { value: content.value, type: content.type },
      create: content,
    });
  }
  console.log(`Site content seeded: ${contentDefaults.length} entries`);

  // ─── Seed sample themes ──────────────────────────────
  const themes = [
    {
      name: "Cinematic",
      slug: "cinematictar",
      description: "Atmosphere, tension, and narrative",
      styles: {
        primaryColor: "#c9a84c",
        secondaryColor: "#8b7332",
        accentColor: "#ffd700",
        backgroundColor: "#0d0d0d",
        surfaceColor: "#1a1708",
        textColor: "#f5f0e1",
        textMutedColor: "#8b8470",
        fontFamily: "Playfair Display",
        fontHeadingFamily: "Playfair Display",
        animationType: "fade-in",
        borderRadius: "0.5rem",
      },
    },
    {
      name: "Guitar",
      slug: "guitar",
      description: "Strings, dirt, and tension",
      styles: {
        primaryColor: "#b87333",
        secondaryColor: "#5a3a1e",
        accentColor: "#e09f3e",
        backgroundColor: "#0f0b08",
        surfaceColor: "#1c1510",
        textColor: "#f3ede6",
        textMutedColor: "#9c8a78",
        fontFamily: "DM Sans",
        fontHeadingFamily: "Syne",
        animationType: "fade-in",
        borderRadius: "0.75rem",
      },
    },
    {
      name: "Violence",
      slug: "violence",
      description: "Intensity without apology",
      styles: {
        primaryColor: "#ff0000",
        secondaryColor: "#8b0000",
        accentColor: "#ff4444",
        backgroundColor: "#0a0000",
        surfaceColor: "#1a0505",
        textColor: "#ffffff",
        textMutedColor: "#ff8888",
        fontFamily: "Oswald",
        fontHeadingFamily: "Oswald",
        animationType: "glitch",
        borderRadius: "0",
      },
    },
    {
      name: "Groove",
      slug: "groove",
      description: "Rhythm as a physical force",
      styles: {
        primaryColor: "#00ff88",
        secondaryColor: "#008844",
        accentColor: "#00ffcc",
        backgroundColor: "#050a08",
        surfaceColor: "#0a1a14",
        textColor: "#e0fff0",
        textMutedColor: "#66aa88",
        fontFamily: "Space Mono",
        fontHeadingFamily: "Orbitron",
        animationType: "pulse-glow",
        borderRadius: "0.25rem",
      },
    },
    {
      name: "Experimental",
      slug: "experimental",
      description: "Sound without a map",
      styles: {
        primaryColor: "#aa44ff",
        secondaryColor: "#6622aa",
        accentColor: "#dd88ff",
        backgroundColor: "#08050d",
        surfaceColor: "#140a1a",
        textColor: "#f0e0ff",
        textMutedColor: "#9966bb",
        fontFamily: "Space Grotesk",
        fontHeadingFamily: "Space Grotesk",
        animationType: "float",
        borderRadius: "1rem",
      },
    },
  ];

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: {
        name: theme.name,
        description: theme.description,
        styles: theme.styles,
        sortOrder: themes.indexOf(theme),
      },
      create: {
        name: theme.name,
        slug: theme.slug,
        description: theme.description,
        styles: theme.styles,
        sortOrder: themes.indexOf(theme),
      },
    });
  }
  console.log(`Themes seeded: ${themes.length} themes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
