import {
  CACHE_CLEAR_KEY_LENGTH,
  CACHE_DIR,
  clearPredictionJsonCaches,
  getCacheClearKey,
} from "../../components/functions/file_cache";

function isAuthorized(req) {
  const secret = getCacheClearKey();

  if (!secret) {
    return false;
  }

  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.query.key ||
    "";

  return String(token).trim() === secret;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!getCacheClearKey()) {
    return res.status(503).json({
      error: `CACHE_CLEAR_KEY or BLOG_CACHE_CLEAR_KEY must be set to exactly ${CACHE_CLEAR_KEY_LENGTH} characters`,
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prefix =
    typeof req.query.prefix === "string" && req.query.prefix.trim().length > 0
      ? req.query.prefix.trim()
      : null;
  const includeBlog = req.query.all === "1" || req.query.include_blog === "1";

  try {
    const cleared = clearPredictionJsonCaches({
      prefix,
      cacheDir: CACHE_DIR,
      includeBlog,
    });

    if (!cleared.cleared) {
      return res.status(500).json({
        error: "Failed to remove one or more cache files",
        cacheDir: CACHE_DIR,
        ...cleared,
      });
    }

    return res.status(200).json({
      message: prefix
        ? `Cleared ${cleared.count} cache file(s) matching prefix "${prefix}"`
        : `Cleared ${cleared.count} cache file(s)`,
      cacheDir: CACHE_DIR,
      prefix,
      includeBlog,
      ...cleared,
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return res.status(500).json({ error: error.message });
  }
}
