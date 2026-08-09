/**
 * Resolve the shared blog cache-clear secret.
 * Prefers BLOG_CACHE_CLEAR_KEY, falls back to CACHE_CLEAR_KEY.
 * Must be exactly 24 characters on admin + every frontend host.
 */
export const BLOG_CACHE_CLEAR_KEY_LENGTH = 24;

export function resolveBlogCacheClearKey() {
  const candidates = [
    process.env.BLOG_CACHE_CLEAR_KEY,
    process.env.CACHE_CLEAR_KEY,
  ];

  for (const candidate of candidates) {
    const secret = String(candidate || "").trim();
    if (secret.length === BLOG_CACHE_CLEAR_KEY_LENGTH) {
      return secret;
    }
  }

  return null;
}

export function isBlogCacheClearAuthorized(req) {
  const secret = resolveBlogCacheClearKey();
  if (!secret) return false;

  const token =
    req.headers.authorization?.replace(/^Bearer\s+/i, "") ||
    req.query.key ||
    "";

  return String(token).trim() === secret;
}
