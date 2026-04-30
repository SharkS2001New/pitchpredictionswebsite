import { useRouter } from "next/router";
import useSWR from "swr";
import PreLoader from "../components/includes/loader";

const fetcher = async (url) => {
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function Blogs() {
  const router = useRouter();
  const page = router.query.page || 1;
  const category = router.query.category || 'ALL';
  
  const { data, error, isLoading, isValidating } = useSWR(
    `https://api.pitchpredictions.com/api/blog?page=${page}&category=${category}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
      dedupingInterval: 60000,
    }
  );

  const handlePageChange = (newPage) => {
    if (newPage === parseInt(page)) return;
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
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="blogs-page">
        <div className="container">
          <PreLoader />
        </div>
      </div>
    );
  }

  const blogs = data?.data || [];
  const pageInfo = {
    currentPage: data?.current_page || 1,
    lastPage: data?.last_page || 1,
    total: data?.total || 0
  };

  return (
    <div className="blogs-page">
      <div className="container">
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
                  disabled={pageInfo.currentPage === 1 || isLoading}
                >
                  ← Previous
                </button>
                
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
                      disabled={isLoading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                  disabled={pageInfo.currentPage === pageInfo.lastPage || isLoading}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}