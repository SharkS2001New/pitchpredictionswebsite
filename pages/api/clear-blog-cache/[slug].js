import { revalidatePath } from "next/cache";
import { clearBlogPostCache } from "../../../components/functions/blog_list_cache";

const KEY_LENGTH = 24;

function getBlogCacheClearKey() {
  const secret = (process.env.BLOG_CACHE_CLEAR_KEY || "").trim();

  if (secret.length !== KEY_LENGTH) {
    return null;
  }

  return secret;
}

function normalizeSlug(rawSlug) {
  if (!rawSlug) return "";

  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  try {
    return decodeURIComponent(String(slug)).trim();
  } catch {
    return String(slug).trim();
  }
}

function isAuthorized(req) {
  const secret = getBlogCacheClearKey();

  if (!secret) {
    return false;
  }

  const token =
    req.headers.authorization?.replace("Bearer ", "") || req.query.key || "";

  return String(token).trim() === secret;
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

  const slug = normalizeSlug(req.query.slug);
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const cleared = clearBlogPostCache(slug);

  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/api/blog/${slug}`);
  revalidatePath(`/api/blog-content/${slug}`);

  return res.status(200).json({
    ...cleared,
    revalidated: true,
    message:
      "Blog cache cleared (JSON, meta JSON, and HTML). The next visit will fetch and write fresh cache files.",
  });
}
