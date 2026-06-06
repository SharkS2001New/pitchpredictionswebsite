import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import PreLoader from "../components/includes/loader";
import PredictionGuidesLinks from "../components/seo-content/shared/prediction-guides-links";

export default function Blogs({
  initialBlogs,
  initialPageInfo,
  initialPage,
  initialCategory,
  error: initialError,
}) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo || { currentPage: 1, lastPage: 1, total: 0 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const loadedQueryRef = useRef({
    page: initialPage || 1,
    category: initialCategory || "ALL",
  });

  useEffect(() => {
    if (!router.isReady) return;

    const page = parseInt(router.query.page, 10) || 1;
    const category = router.query.category || "ALL";

    if (
      page === loadedQueryRef.current.page &&
      category === loadedQueryRef.current.category
    ) {
      return;
    }

    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/blog-list?page=${page}&category=${encodeURIComponent(category)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();

        setBlogs(data.data || []);
        setPageInfo({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
        });
        loadedQueryRef.current = { page, category };
      } catch (err) {
        console.error("Error fetching page:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [router.query.page, router.query.category, router.isReady]);

  const handlePageChange = (newPage) => {
    if (newPage === pageInfo.currentPage || loading) return;

    router.push(
      {
        pathname: "/blog",
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }
    );
  };

  if (error && blogs.length === 0) {
    return (
      <div className="blogs-page">
        <div className="container">
          <div className="no-blogs">
            <p>Error loading blogs. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary mt-3"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && blogs.length === 0) {
    return (
      <div className="blogs-page">
        <div className="container">
          <PreLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="container">
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px 30px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading page {pageInfo.currentPage}...</span>
            </div>
          </div>
        )}
        {!blogs || blogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs available.</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="col-12 col-lg-6">
                  <div className="blog-card">
                    <div className="blog-content">
                      <small className="blog-category mb-3">
                        {blog.category?.name
                          ? blog.category.name.charAt(0).toUpperCase() +
                            blog.category.name.slice(1).toLowerCase()
                          : "Articles"}
                      </small>

                      <a href={`/blog/${blog.slug}`} className="blog-title">
                        {blog.title}
                      </a>

                      <div className="blog-meta mt-3">
                        {blog.user?.name || "Admin"} &nbsp;/&nbsp;
                        {new Date(
                          blog.published_at || blog.created_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <p className="blog-excerpt">{blog.excerpt}</p>
                    </div>

                    <div className="blog-footer">
                      <a
                        href={`/blog/${blog.slug}`}
                        className="read-more-btn"
                        rel="bookmark"
                      >
                        <span className="kenta-button-icon">
                          <i className="fas fa-arrow-right"></i>
                        </span>
                        <span className="kenta-button-text">
                          Read More <i className="bi bi-arrow-right"></i>
                        </span>
                      </a>

                      <div className="blog-social">
                        <span>
                          <i className="bi bi-clock"></i>{" "}
                          {blog.read_time || 5} Minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pageInfo.lastPage > 1 && (
              <div className="pagination-container">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                  disabled={pageInfo.currentPage === 1 || loading}
                >
                  ← Previous
                </button>

                {pageInfo.currentPage > 3 && (
                  <>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                    >
                      1
                    </button>
                    {pageInfo.currentPage > 4 && (
                      <span className="page-dots">...</span>
                    )}
                  </>
                )}

                {Array.from(
                  { length: Math.min(5, pageInfo.lastPage) },
                  (_, i) => {
                    let pageNum;
                    if (pageInfo.lastPage <= 5) {
                      pageNum = i + 1;
                    } else if (pageInfo.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pageInfo.currentPage >= pageInfo.lastPage - 2) {
                      pageNum = pageInfo.lastPage - 4 + i;
                    } else {
                      pageNum = pageInfo.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${
                          pageInfo.currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                {pageInfo.currentPage < pageInfo.lastPage - 2 && (
                  <>
                    {pageInfo.currentPage < pageInfo.lastPage - 3 && (
                      <span className="page-dots">...</span>
                    )}
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(pageInfo.lastPage)}
                      disabled={loading}
                    >
                      {pageInfo.lastPage}
                    </button>
                  </>
                )}

                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                  disabled={
                    pageInfo.currentPage === pageInfo.lastPage || loading
                  }
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
        <br />
        <div className="container-wide">
          <PredictionGuidesLinks title="Football Prediction Guides" />
        </div>
      </div>

      <style jsx>{`
        .page-transition-loader {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 8px 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .page-dots {
          padding: 8px 4px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { fetchBlogList, getCachePath, readCache, writeCache } = await import(
    "../components/functions/blog_list_cache"
  );

  const page = parseInt(query.page, 10) || 1;
  const category = query.category || "ALL";
  const { cacheDir, cachePath } = getCachePath(page, category);

  try {
    const cached = readCache(cachePath);

    if (cached?.isFresh) {
      const payload = cached.cache.payload;
      return {
        props: {
          initialBlogs: payload.data || [],
          initialPageInfo: {
            currentPage: payload.current_page || 1,
            lastPage: payload.last_page || 1,
            total: payload.total || 0,
          },
          initialPage: page,
          initialCategory: category,
          error: null,
        },
      };
    }

    const payload = await fetchBlogList(page, category);
    writeCache(cacheDir, cachePath, payload);

    return {
      props: {
        initialBlogs: payload.data || [],
        initialPageInfo: {
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        },
        initialPage: page,
        initialCategory: category,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);

    const cached = readCache(cachePath);
    if (cached?.cache?.payload) {
      const payload = cached.cache.payload;
      return {
        props: {
          initialBlogs: payload.data || [],
          initialPageInfo: {
            currentPage: payload.current_page || 1,
            lastPage: payload.last_page || 1,
            total: payload.total || 0,
          },
          initialPage: page,
          initialCategory: category,
          error: null,
        },
      };
    }

    return {
      props: {
        initialBlogs: [],
        initialPageInfo: {
          currentPage: 1,
          lastPage: 1,
          total: 0,
        },
        initialPage: page,
        initialCategory: category,
        error: error.message || "Failed to load blogs",
      },
    };
  }
}
