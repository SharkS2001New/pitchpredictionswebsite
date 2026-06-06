import {
  fetchBlogList,
  getCachePath,
  readTrimmedBlogListCache,
  writeCache,
  trimBlogListPayload,
} from "../../components/functions/blog_list_cache";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || "ALL";
  const { cacheDir, cachePath, legacyCachePath } = getCachePath(page, category);

  try {
    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);

    if (cached?.isFresh) {
      res.setHeader("Cache-Control", "private, max-age=3600, stale-while-revalidate=86400");
      return res.status(200).json({
        fromCache: true,
        generatedAt: cached.cache.generatedAt,
        ...cached.payload,
      });
    }

    const payload = await fetchBlogList(page, category);
    const cacheData = writeCache(cacheDir, cachePath, payload);

    res.setHeader("Cache-Control", "private, max-age=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      fromCache: false,
      generatedAt: cacheData.generatedAt,
      ...payload,
    });
  } catch (error) {
    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);

    if (cached?.payload) {
      res.setHeader("Cache-Control", "private, max-age=60");
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
