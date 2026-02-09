import { COMMENT_RATE_LIMIT_MS } from "@/lib/constants";

const rateLimitMap = new Map<string, number>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of rateLimitMap) {
    if (now - timestamp > COMMENT_RATE_LIMIT_MS) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(key);

  if (lastRequest && now - lastRequest < COMMENT_RATE_LIMIT_MS) {
    return {
      allowed: false,
      retryAfterMs: COMMENT_RATE_LIMIT_MS - (now - lastRequest),
    };
  }

  rateLimitMap.set(key, now);
  return { allowed: true, retryAfterMs: 0 };
}
