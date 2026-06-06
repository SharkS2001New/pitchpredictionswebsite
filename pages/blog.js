import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import PreLoader from "../components/includes/loader";

function getPageCacheKey(page, category) {
  return `${category}:${page}`;
}

function toPageInfo(data) {
  return {
    currentPage: data.current_page || 1,
    lastPage: data.last_page || 1,
    total: data.total || 0,
  };
}

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
  const pageCacheRef = useRef(new Map());
  const prefetchingRef = useRef(new Set());

  useEffect(() => {
    const key = getPageCacheKey(initialPage || 1, initialCategory || "ALL");
    pageCacheRef.current.set(key, {
      blogs: initialBlogs || [],
      pageInfo:
        initialPageInfo || { currentPage: 1, lastPage: 1, total: 0 },
    });
  }, [initialBlogs, initialPageInfo, initialPage, initialCategory]);

  const fetchBlogPage = useCallback(async (page, category) => {
    const response = await fetch(
      `/api/blog-list?page=${page}&category=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    return response.json();
  }, []);

  const storePageInCache = useCallback((page, category, data) => {
    const key = getPageCacheKey(page, category);
    const nextPageInfo = toPageInfo(data);

    pageCacheRef.current.set(key, {
      blogs: data.data || [],
      pageInfo: nextPageInfo,
    });

    return nextPageInfo;
  }, []);

  const prefetchBlogPage = useCallback(
    (page, category, lastPage) => {
      if (page < 1 || page > lastPage) return;

      const key = getPageCacheKey(page, category);
      if (pageCacheRef.current.has(key) || prefetchingRef.current.has(key)) {
        return;
      }

      prefetchingRef.current.add(key);

      fetchBlogPage(page, category)
        .then((data) => {
          storePageInCache(page, category, data);
        })
        .catch(() => {})
        .finally(() => {
          prefetchingRef.current.delete(key);
        });
    },
    [fetchBlogPage, storePageInCache]
  );

  const prefetchAdjacentPages = useCallback(
    (page, category, lastPage) => {
      prefetchBlogPage(page - 1, category, lastPage);
      prefetchBlogPage(page + 1, category, lastPage);
    },
    [prefetchBlogPage]
  );

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

    const cacheKey = getPageCacheKey(page, category);
    const cachedPage = pageCacheRef.current.get(cacheKey);

    if (cachedPage) {
      setBlogs(cachedPage.blogs);
      setPageInfo(cachedPage.pageInfo);
      setError(null);
      loadedQueryRef.current = { page, category };
      prefetchAdjacentPages(
        page,
        category,
        cachedPage.pageInfo.lastPage
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let cancelled = false;

    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBlogPage(page, category);
        if (cancelled) return;

        setBlogs(data.data || []);
        const nextPageInfo = storePageInCache(page, category, data);
        setPageInfo(nextPageInfo);
        loadedQueryRef.current = { page, category };
        prefetchAdjacentPages(page, category, nextPageInfo.lastPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching page:", err);
        setError(err.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPageData();

    return () => {
      cancelled = true;
    };
  }, [
    router.query.page,
    router.query.category,
    router.isReady,
    fetchBlogPage,
    storePageInCache,
    prefetchAdjacentPages,
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    prefetchAdjacentPages(
      pageInfo.currentPage,
      router.query.category || "ALL",
      pageInfo.lastPage
    );
  }, [
    router.isReady,
    router.query.category,
    pageInfo.currentPage,
    pageInfo.lastPage,
    prefetchAdjacentPages,
  ]);

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
        {!blogs || blogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs available.</p>
          </div>
        ) : (
          <>
            <div
              className="row g-4 blog-list-grid"
              style={{
                opacity: loading ? 0.55 : 1,
                transition: "opacity 0.15s ease",
              }}
              aria-busy={loading}
            >
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
                {loading && (
                  <span className="pagination-loading-indicator">
                    <span
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </span>
                )}

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
                        onMouseEnter={() =>
                          prefetchBlogPage(
                            pageNum,
                            router.query.category || "ALL",
                            pageInfo.lastPage
                          )
                        }
                        onFocus={() =>
                          prefetchBlogPage(
                            pageNum,
                            router.query.category || "ALL",
                            pageInfo.lastPage
                          )
                        }
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
                      onMouseEnter={() =>
                        prefetchBlogPage(
                          pageInfo.lastPage,
                          router.query.category || "ALL",
                          pageInfo.lastPage
                        )
                      }
                      onFocus={() =>
                        prefetchBlogPage(
                          pageInfo.lastPage,
                          router.query.category || "ALL",
                          pageInfo.lastPage
                        )
                      }
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
      </div>

      <style jsx>{`
        .page-dots {
          padding: 8px 4px;
          color: #666;
        }
        .pagination-loading-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-right: 12px;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { fetchBlogList, getCachePath, readTrimmedBlogListCache, writeCache } =
    await import("../components/functions/blog_list_cache");

  const page = parseInt(query.page, 10) || 1;
  const category = query.category || "ALL";
  const { cacheDir, cachePath, legacyCachePath } = getCachePath(page, category);

  try {
    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);

    if (cached?.isFresh) {
      return {
        props: {
          initialBlogs: cached.payload.data || [],
          initialPageInfo: {
            currentPage: cached.payload.current_page || 1,
            lastPage: cached.payload.last_page || 1,
            total: cached.payload.total || 0,
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

    const cached = readTrimmedBlogListCache(cachePath, legacyCachePath);
    if (cached?.payload) {
      return {
        props: {
          initialBlogs: cached.payload.data || [],
          initialPageInfo: {
            currentPage: cached.payload.current_page || 1,
            lastPage: cached.payload.last_page || 1,
            total: cached.payload.total || 0,
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
