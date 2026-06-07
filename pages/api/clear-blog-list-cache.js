import { revalidatePath } from "next/cache";
import { clearBlogListCaches } from "../../components/functions/blog_list_cache";

const KEY_LENGTH = 24;

function getBlogCacheClearKey() {
  const secret = (process.env.BLOG_CACHE_CLEAR_KEY || "").trim();

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

  const cleared = clearBlogListCaches();

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/api/blog-list");

  return res.status(200).json({
    ...cleared,
    revalidated: true,
    message:
      "Blog list and homepage snippet caches cleared. The next visit will fetch fresh posts.",
  });
}
