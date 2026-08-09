import { revalidatePath } from "next/cache";
import { clearBlogListCaches } from "../../components/functions/blog_list_cache";
import {
  BLOG_CACHE_CLEAR_KEY_LENGTH,
  isBlogCacheClearAuthorized,
  resolveBlogCacheClearKey,
} from "../../components/functions/blog_cache_clear_auth";

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

  const cleared = clearBlogListCaches();

  try {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/api/blog-list");
  } catch {
    // Pages-router / older Next builds may not support revalidatePath
  }

  return res.status(200).json({
    ...cleared,
    revalidated: true,
    message:
      "Blog list and homepage snippet caches cleared. The next visit will fetch fresh posts.",
  });
}
