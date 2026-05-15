import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PreLoader from "../components/includes/loader";

export default function Blogs({ initialBlogs, initialPageInfo, error: initialError }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [pageInfo, setPageInfo] = useState(initialPageInfo || { currentPage: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // Fetch data when page changes in URL (client-side)
  useEffect(() => {
    if (!router.isReady) return;
    
    const page = parseInt(router.query.page) || 1;
    const category = router.query.category || 'ALL';
    
    // Skip if this is the initial load (data already from server)
    if (page === pageInfo.currentPage && blogs.length > 0 && !loading) {
      return;
    }
    
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const headers = {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
        };
        
        const response = await fetch(
          `https://api.pitchpredictions.com/api/blog?page=${page}&category=${category}`,
          { headers }
        );
        
        if (!response.ok) throw new Error('Failed to fetch blogs');
        
        const data = await response.json();
        
        setBlogs(data.data || []);
        setPageInfo({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0
        });
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
    
    router.push({
      pathname: '/blog',
      query: { ...router.query, page: newPage }
    }, undefined, { shallow: true });
  };

  if (error) {
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

  // Show loader only on initial load (first visit)
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
        {/* Show mini loader indicator when navigating between pages */}
        {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '20px 30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            fontWeight: 500
          }}>
            <div className="spinner-border spinner-border-sm text-primary" role="status">
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
                        {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      <p className="blog-excerpt">
                        {blog.excerpt ||
                          (blog.content
                            ?.replace(/<[^>]*>/g, "")
                            .substring(0, 120) + "...")}
                      </p>
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
                          <i className="bi bi-clock"></i> {blog.read_time || 5} Minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pageInfo.lastPage > 1 && (
              <div className="pagination-container">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                  disabled={pageInfo.currentPage === 1 || loading}
                >
                  ← Previous
                </button>
                
                {/* Show first page */}
                {pageInfo.currentPage > 3 && (
                  <>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                    >
                      1
                    </button>
                    {pageInfo.currentPage > 4 && <span className="page-dots">...</span>}
                  </>
                )}
                
                {/* Show pages around current */}
                {Array.from({ length: Math.min(5, pageInfo.lastPage) }, (_, i) => {
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
                      className={`page-btn ${pageInfo.currentPage === pageNum ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {/* Show last page */}
                {pageInfo.currentPage < pageInfo.lastPage - 2 && (
                  <>
                    {pageInfo.currentPage < pageInfo.lastPage - 3 && <span className="page-dots">...</span>}
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
                  disabled={pageInfo.currentPage === pageInfo.lastPage || loading}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        .page-transition-loader {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 8px 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  };

  const page = query.page || 1;
  const category = query.category || 'ALL';

  try {
    const response = await fetch(
      `https://api.pitchpredictions.com/api/blog?page=${page}&category=${category}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      props: {
        initialBlogs: data.data || [],
        initialPageInfo: {
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0
        },
        error: null
      }
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    
    return {
      props: {
        initialBlogs: [],
        initialPageInfo: {
          currentPage: 1,
          lastPage: 1,
          total: 0
        },
        error: error.message || "Failed to load blogs"
      }
    };
  }
}