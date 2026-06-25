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

function normalizePlainText(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Removes a leading paragraph when it duplicates the list-preview excerpt.
 * Excerpt is for blog cards only; full HTML should not repeat it on the detail page.
 */
export function stripLeadingExcerptFromHtml(html, excerpt) {
  if (!html || !excerpt) return html;

  const normalizedExcerpt = normalizePlainText(excerpt);
  if (!normalizedExcerpt) return html;

  const match = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return html;

  const paragraphText = normalizePlainText(match[1]);
  if (!paragraphText) return html;

  const isDuplicate =
    paragraphText === normalizedExcerpt ||
    (normalizedExcerpt.length >= 40 &&
      paragraphText.startsWith(normalizedExcerpt)) ||
    (paragraphText.length >= 40 &&
      normalizedExcerpt.startsWith(paragraphText));

  if (!isDuplicate) return html;

  return html.slice(match.index + match[0].length).trimStart();
}
