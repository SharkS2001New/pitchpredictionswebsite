import { clearBlogPostCache } from "../../../components/functions/blog_list_cache";

const KEY_LENGTH = 24;

function getBlogCacheClearKey() {
  const secret = process.env.BLOG_CACHE_CLEAR_KEY || "";

  if (secret.length !== KEY_LENGTH) {
    return null;
  }

  return secret;
}

function isAuthorized(req) {
  const secret = getBlogCacheClearKey();

  if (!secret) {
    return false;
  }

  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.query.key || "";

  return token === secret;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!getBlogCacheClearKey()) {
    return res.status(503).json({
      error: `BLOG_CACHE_CLEAR_KEY must be set to exactly ${KEY_LENGTH} characters`,
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const slug = req.query.slug;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  const cleared = clearBlogPostCache(slug);

  return res.status(200).json({
    ...cleared,
    message: "Blog cache cleared. The next visit will fetch fresh content from the backend.",
  });
}
