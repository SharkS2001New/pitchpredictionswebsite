import { revalidatePath } from "next/cache";
import { clearBlogPostCache } from "../../../components/functions/blog_list_cache";
import {
  BLOG_CACHE_CLEAR_KEY_LENGTH,
  isBlogCacheClearAuthorized,
  resolveBlogCacheClearKey,
} from "../../../components/functions/blog_cache_clear_auth";

function normalizeSlug(rawSlug) {
  if (!rawSlug) return "";

  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  try {
    return decodeURIComponent(String(slug)).trim();
  } catch {
    return String(slug).trim();
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!resolveBlogCacheClearKey()) {
    return res.status(503).json({
      error: `BLOG_CACHE_CLEAR_KEY must be set to exactly ${BLOG_CACHE_CLEAR_KEY_LENGTH} characters`,
    });
  }

  if (!isBlogCacheClearAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const slug = normalizeSlug(req.query.slug);
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const cleared = clearBlogPostCache(slug);

  try {
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/api/blog/${slug}`);
    revalidatePath(`/api/blog-content/${slug}`);
  } catch {
    // Pages-router / older Next builds may not support revalidatePath
  }

  return res.status(200).json({
    ...cleared,
    revalidated: true,
    message:
      "Blog cache cleared (JSON, meta JSON, and HTML). The next visit will fetch and write fresh cache files.",
  });
}
