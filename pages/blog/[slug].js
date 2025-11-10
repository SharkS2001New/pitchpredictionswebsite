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

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>Error: {error}</p>;
  if (!blog) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Blog not found</p>;

  const category =
    blog.category?.blogs_category_title
      ? blog.category.blogs_category_title.charAt(0).toUpperCase() +
        blog.category.blogs_category_title.slice(1).toLowerCase()
      : "Articles";

  return (
    <div className="blogs-page" style={{ maxWidth: "850px", padding: "0 1rem", fontFamily: "Arial, sans-serif" }}>
        <br/>
        <Link className="btn btn-outline-primary btn-sm" href="/blog" style={{ display: "inline-block", marginBottom: "1rem", textDecoration: "none" }}>
          ← Back to Blogs
        </Link>

        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", lineHeight: "1.3" }}>{blog.title}</h1>

        <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#666",
              fontSize: "0.9rem",
              marginBottom: "2rem"
          }}>
              <div>
                  {blog.author || "Admin"} / {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                  })}
              </div>
              <div>
                  <span style={{ color: "#bb2200", fontWeight: "bold", fontSize: "0.8rem" }}>
                      Read Time:&nbsp; <i className="bi bi-clock"></i>&nbsp;{blog.read_time} Minutes
                  </span>
              </div>
          </div>


        <small className="blog-category" style={{ display: "block", marginBottom: "1rem", fontSize: "0.9rem", textTransform: "capitalize" }}>
            {category}
        </small>

        <div style={{ lineHeight: "1.8", fontSize: "1rem", color: "#1a1a1a" }} dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        <br/>
    </div>
  );
}
