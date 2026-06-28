import {
  getBlogPostContentInfo,
  readBlogPostContentHtml,
} from "../../../components/functions/blog_list_cache";
import { fetchBlogPost } from "../../../lib/blog/fetch-blog-post";
import { getBlogHtmlContent } from "../../../lib/blog/blog-utils";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    let html = readBlogPostContentHtml(slug);

    if (!html) {
      const blogData = await fetchBlogPost(slug);
      html = getBlogHtmlContent(blogData) || readBlogPostContentHtml(slug);
    }

    if (!html) {
      return res.status(404).json({ error: "Blog content not found" });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Error in blog-content API:", error);
    return res.status(500).json({ error: error.message });
  }
}
