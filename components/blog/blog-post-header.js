import Link from "next/link";
import BlogPostImage from "./blog-post-image";
import {
  formatBlogDate,
  getBlogAuthor,
  getBlogCategoryLabel,
  getFeaturedImage,
} from "../../lib/blog/blog-utils";

export default function BlogPostHeader({ meta }) {
  const category = getBlogCategoryLabel(meta);
  const featuredImage = getFeaturedImage(meta);
  const publishedDate = formatBlogDate(meta.published_at || meta.created_at);

  return (
    <>
      <br />

      <Link
        href="/blog"
        className="btn btn-outline-primary btn-sm"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          textDecoration: "none",
        }}
      >
        ← Back to Blogs
      </Link>

      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "0.5rem",
          lineHeight: "1.3",
        }}
      >
        {meta.title}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#666",
          fontSize: "0.9rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          {getBlogAuthor(meta)} / {publishedDate}
        </div>
        <div>
          <span
            style={{
              color: "#bb2200",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Read Time:&nbsp; <i className="bi bi-clock"></i>&nbsp;
            {meta.read_time || 5} Minutes
          </span>
        </div>
      </div>

      <small
        className="blog-category"
        style={{
          display: "block",
          marginBottom: "1rem",
          fontSize: "0.9rem",
          textTransform: "capitalize",
          color: "#666",
        }}
      >
        Category: {category}
      </small>

      {featuredImage && (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <BlogPostImage
            src={featuredImage}
            alt={meta.title || "Blog featured image"}
            priority
          />
        </div>
      )}
    </>
  );
}
