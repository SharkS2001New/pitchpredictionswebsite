export function getBlogCategoryLabel(blog) {
  if (!blog) return "Articles";

  return (
    blog.category?.name ||
    blog.category?.blogs_category_title ||
    "Articles"
  );
}

export function getFeaturedImage(blog) {
  if (!blog) return null;
  return blog.image || blog.featured_image || blog.og_image || null;
}

export function getBlogAuthor(blog) {
  return blog?.author || blog?.user?.name || "Admin";
}

export function formatBlogDate(value) {
  if (!value) return "";

  const normalized = String(value).trim().replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getBlogMetaDescription(blog) {
  return (
    blog?.meta_description ||
    blog?.excerpt ||
    "Read the latest football analysis and predictions from Pitch Predictions."
  );
}

/** SEO title from admin (falls back to visible H1 title). */
export function getBlogMetaTitle(blog) {
  const metaTitle = String(blog?.meta_title || "").trim();
  return metaTitle || blog?.title || "Blog";
}

/** Comma-separated meta keywords from admin; empty when not set. */
export function getBlogMetaKeywords(blog) {
  const raw = String(blog?.meta_keywords || "").trim();
  if (!raw) return [];

  return raw
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

/** Full article HTML from admin — never use excerpt on the detail page. */
export function getBlogHtmlContent(blog) {
  if (!blog || typeof blog !== "object") return "";

  const content = blog.content;
  return typeof content === "string" ? content : "";
}
