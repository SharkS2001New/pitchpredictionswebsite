import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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

  if (loading) return <p className="status-message">loading...</p>;
  if (error) return <p className="status-message error">error: {error}</p>;
  if (!blog) return <p className="status-message">blog not found</p>;

  const category =
    blog.category?.blogs_category_title
      ? blog.category.blogs_category_title.charAt(0).toUpperCase() +
        blog.category.blogs_category_title.slice(1).toLowerCase()
      : "articles";

  return (
    <div className="blogs-page">
      <Link href="/blog" className="back-link">
        ← back to blogs
      </Link>

      <h1 className="blog-title">{blog.title}</h1>

      <div className="blog-meta">
        {blog.author || "admin"} /{" "}
        {new Date(blog.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      <small className="blog-category">{category}</small>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
    </div>
  );
}
