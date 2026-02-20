import { useState } from "react";

export default function Blogs({ initialBlogs, error }) {
  const [blogs] = useState(initialBlogs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Handle error state
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
              {currentBlogs.map((blog) => (
                <div key={blog.id} className="col-12 col-lg-6">
                  <div className="blog-card">
                    <div className="blog-content">
                      <small className="blog-category mb-3">
                        {blog.category?.blogs_category_title
                          ? blog.category.blogs_category_title.charAt(0).toUpperCase() + 
                            blog.category.blogs_category_title.slice(1).toLowerCase()
                          : "Articles"}
                      </small>

                      <a href={`/blog/${blog.slug}`} className="blog-title">
                        {blog.title}
                      </a>

                      <div className="blog-meta mt-3">
                        {blog.user?.name || "Admin"} &nbsp;/&nbsp;
                        {new Date(blog.published_at).toLocaleDateString("en-US", {
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
                          <i className="bi bi-clock"></i> {blog.read_time} Minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  };

  try {
    const response = await fetch("https://api.pitchpredictions.com/api/blog", {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        initialBlogs: data.data || [],
        error: null
      }
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    
    return {
      props: {
        initialBlogs: [],
        error: error.message || "Failed to load blogs"
      }
    };
  }
}