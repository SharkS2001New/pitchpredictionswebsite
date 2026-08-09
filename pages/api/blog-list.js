import {
  fetchBlogList,
  getCachePath,
  readTrimmedBlogListCache,
  writeCache,
} from "../../components/functions/blog_list_cache";
import { BLOG_LIST_CACHE_CONTROL } from "../../lib/blog/blog-content-config";

function refreshListCacheInBackground(page, category, cacheDir, cachePath) {
  void fetchBlogList(page, category)
    .then((payload) => writeCache(cacheDir, cachePath, payload))
    .catch((error) => {
      console.error("Background blog-list refresh failed:", error.message);
    });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || "ALL";
  const { cacheDir, cachePath, legacyCachePath } = getCachePath(page, category);

  try {
    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);

    if (cached?.payload) {
      if (!cached.isFresh) {
        refreshListCacheInBackground(page, category, cacheDir, cachePath);
      }

      res.setHeader("Cache-Control", BLOG_LIST_CACHE_CONTROL);
      return res.status(200).json({
        fromCache: true,
        generatedAt: cached.cache.generatedAt,
        ...cached.payload,
      });
    }

    const payload = await fetchBlogList(page, category);
    const cacheData = writeCache(cacheDir, cachePath, payload);

    res.setHeader("Cache-Control", BLOG_LIST_CACHE_CONTROL);
    return res.status(200).json({
      fromCache: false,
      generatedAt: cacheData.generatedAt,
      ...payload,
    });
  } catch (error) {
    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);

    if (cached?.payload) {
      res.setHeader("Cache-Control", "private, max-age=30, must-revalidate");
      return res.status(200).json({
        fromCache: true,
        isFallback: true,
        generatedAt: cached.cache.generatedAt,
        ...cached.payload,
      });
    }

    console.error("Error in blog-list API:", error);
    return res.status(500).json({ error: error.message });
  }
}
