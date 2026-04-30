import { useRouter } from "next/router";
import Head from "next/head";
import PreLoader from "../../components/includes/loader";

export default function BlogPage({ blog, error, slug: propSlug }) {
  const router = useRouter();
  const { slug } = router.query;

  // Handle loading state (only for client-side navigation)
  if (router.isFallback) {
    return <PreLoader />;
  }

  // ❌ Show error
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <a href="/blog" className="btn btn-outline-primary btn-sm">
          ← Back to Blogs
        </a>
      </div>
    );
  }

  // 🚫 Blog not found
  if (!blog) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Blog not found</p>
        <a href="/blog" className="btn btn-outline-primary btn-sm">
          ← Back to Blogs
        </a>
      </div>
    );
  }

  // 🏷️ Format category
  const category =
    blog.category?.blogs_category_title
      ? blog.category.blogs_category_title.charAt(0).toUpperCase() +
        blog.category.blogs_category_title.slice(1).toLowerCase()
      : "Articles";

  // 🖼️ Optimize images: add lazy loading + async decoding
  const optimizedContent = blog.content?.replace(
    /<img /g,
    '<img loading="lazy" decoding="async" style="max-width:100%;height:auto;" '
  ) || '';

  // 🧠 Meta title & description
  const metaTitle = `${blog.title} | Pitch Predictions`;
  const metaDescription =
    blog.meta_description ||
    (blog.content
      ? blog.content.replace(/<[^>]+>/g, "").slice(0, 160) + "..."
      : "Read the latest football analysis and predictions from Pitch Predictions.");

  // Canonical URL
  const canonicalUrl = `https://www.pitchpredictions.com/blog/${slug || propSlug}`;

  return (
    <>
      <Head>
        {/* 🔹 Basic SEO Meta Tags */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* 🔹 Open Graph / Facebook */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {blog.image && (
          <meta property="og:image" content={blog.image} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Pitch Predictions" />

        {/* 🔹 Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.image && (
          <meta name="twitter:image" content={blog.image} />
        )}
        <meta name="twitter:site" content="@pitchpredictions" />

        {/* 🔹 Article Meta */}
        <meta property="article:published_time" content={blog.created_at} />
        {blog.updated_at && (
          <meta property="article:modified_time" content={blog.updated_at} />
        )}
        <meta property="article:author" content={blog.author || "Admin"} />
        {blog.category?.blogs_category_title && (
          <meta property="article:section" content={blog.category.blogs_category_title} />
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

        <a
          className="btn btn-outline-primary btn-sm"
          href="/blog"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            textDecoration: "none",
          }}
        >
          ← Back to Blogs
        </a>

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
            {blog.author || blog.user?.name || "Admin"} /{" "}
            {new Date(blog.created_at || blog.published_at).toLocaleDateString("en-US", {
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
              {blog.read_time || 5} Minutes
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

        {/* Featured Image */}
        {blog.image && (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <img 
              src={blog.image} 
              alt={blog.title}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
              loading="lazy"
            />
          </div>
        )}

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

export async function getServerSideProps(context) {
  const { slug } = context.params;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  };

  try {
    const response = await fetch(`https://api.pitchpredictions.com/api/blog/${slug}`, {
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          notFound: true,
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        blog: data.data || data, // Handle both response formats
        error: null,
        slug: slug
      },
    };
  } catch (error) {
    console.error("Error fetching blog:", error);

    return {
      props: {
        blog: null,
        error: error.message || "Failed to load blog",
        slug: slug
      },
    };
  }
}