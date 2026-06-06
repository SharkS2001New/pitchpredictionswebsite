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
