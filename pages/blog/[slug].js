import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import PreLoader from "../../components/includes/loader";

export default function BlogPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://api.pitchpredictions.com/api/blog/${slug}`, {
          headers: { Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2" },
        });

        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // 🔄 Show loader
  if (loading) return <PreLoader />;

  // ❌ Show error
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>
        Error: {error}
      </p>
    );

  // 🚫 Blog not found
  if (!blog)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Blog not found
      </p>
    );

  // 🏷️ Format category
  const category =
    blog.category?.blogs_category_title
      ? blog.category.blogs_category_title.charAt(0).toUpperCase() +
        blog.category.blogs_category_title.slice(1).toLowerCase()
      : "Articles";

  // 🖼️ Optimize images: add lazy loading + async decoding
  const optimizedContent = blog.content.replace(
    /<img /g,
    '<img loading="lazy" decoding="async" style="max-width:100%;height:auto;" '
  );

  // 🧠 Meta title & description
  const metaTitle = `${blog.title} | Pitch Predictions`;
  const metaDescription =
    blog.meta_description ||
    (blog.content
      ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160) + "..."
      : "Read the latest football analysis and predictions from Pitch Predictions.");

  return (
    <>
      <Head>
        {/* 🔹 Basic SEO Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />

        {/* 🔹 Open Graph / Facebook */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {blog.image && (
          <meta property="og:image" content={blog.image} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pitchpredictions.com/blog/${slug}`} />

        {/* 🔹 Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.image && (
          <meta name="twitter:image" content={blog.image} />
        )}
      </Head>

      <div
        className="blogs-page"
        style={{
          maxWidth: "850px",
          padding: "0 1rem",
          fontFamily: "Arial, sans-serif",
          margin: "0 auto",
        }}
      >
        <br />

        <Link
          className="btn btn-outline-primary btn-sm"
          href="/blog"
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
          {blog.title}
        </h1>

        {/* Author, Date & Read Time */}
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
            {blog.author || "Admin"} /{" "}
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
              {blog.read_time} Minutes
            </span>
          </div>
        </div>

        {/* Category */}
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
          {category}
        </small>

        {/* Content */}
        <div
          style={{
            lineHeight: "1.8",
            fontSize: "1rem",
            color: "#1a1a1a",
          }}
          dangerouslySetInnerHTML={{ __html: optimizedContent }}
        ></div>

        <br />
      </div>
    </>
  );
}
