import { fetchBlogPost } from "../../../lib/blog/fetch-blog-post";
import { hasCacheableData } from "../../../components/functions/file_cache";
import {
  readBlogPostContentHtml,
  readBlogPostJsonCache,
} from "../../../components/functions/blog_list_cache";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const blogData = await fetchBlogPost(slug);

    if (!hasCacheableData(blogData)) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const cached = readBlogPostJsonCache(slug);

    return res.status(200).json({
      fromCache: Boolean(cached?.isFresh),
      generatedAt: cached?.cache?.generatedAt || new Date().toISOString(),
      data: blogData,
    });
  } catch (error) {
    const cached = readBlogPostJsonCache(slug);

    if (cached?.cache?.data) {
      const content = readBlogPostContentHtml(slug);

      return res.status(200).json({
        fromCache: true,
        isFallback: true,
        generatedAt: cached.cache.generatedAt,
        data: {
          ...cached.cache.data,
          content: content || "",
        },
      });
    }

    console.error("Error in blog slug API:", error);
    return res.status(500).json({ error: error.message });
  }
}
