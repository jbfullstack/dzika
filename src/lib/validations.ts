import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const trackSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  themeId: z.string().min(1, "Theme is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  commentsEnabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const trackVersionSchema = z.object({
  name: z.string().min(1, "Version name is required").max(100),
  audioUrl: z.string().min(1, "Audio URL is required").refine(
    (val) => val.startsWith("/") || val.startsWith("http"),
    "Invalid audio URL"
  ),
  duration: z.number().int().min(0).default(0),
  fileSize: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isDownloadable: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const themeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  styles: z.record(z.string(), z.unknown()).default({}),
});

export const commentSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  content: z.string().min(1, "Comment is required").max(2000),
  rating: z.number().int().min(0).max(5).optional(),
});

export const siteContentSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});
