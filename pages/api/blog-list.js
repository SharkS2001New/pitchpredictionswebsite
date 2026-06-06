import {
  fetchBlogList,
  getCachePath,
  readCache,
  writeCache,
} from "../../components/functions/blog_list_cache";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || "ALL";
  const { cacheDir, cachePath } = getCachePath(page, category);

  try {
    const cached = readCache(cachePath);

    if (cached?.isFresh) {
      return res.status(200).json({
        fromCache: true,
        generatedAt: cached.cache.generatedAt,
        ...cached.cache.payload,
      });
    }

    const payload = await fetchBlogList(page, category);
    const cacheData = writeCache(cacheDir, cachePath, payload);

    return res.status(200).json({
      fromCache: false,
      generatedAt: cacheData.generatedAt,
      ...payload,
    });
  } catch (error) {
    const cached = readCache(cachePath);

    if (cached?.cache?.payload) {
      return res.status(200).json({
        fromCache: true,
        isFallback: true,
        generatedAt: cached.cache.generatedAt,
        ...cached.cache.payload,
      });
    }

    console.error("Error in blog-list API:", error);
    return res.status(500).json({ error: error.message });
  }
}
