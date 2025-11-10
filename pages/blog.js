import { useEffect, useState } from "react";
import Link from "next/link";
import PreLoader from "../components/includes/loader";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    fetch("https://api.pitchpredictions.com/api/blog", {
      headers: { Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2" },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className="blogs-page">
      <div className="container">
        {loading ? (
          <PreLoader/>
        ) : blogs.length === 0 ? (
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
                            ? blog.category.blogs_category_title.charAt(0).toUpperCase() + blog.category.blogs_category_title.slice(1).toLowerCase()
                            : "Articles"}
                        </small>


                      <Link href={`/blog/${blog.slug}`} className="blog-title">
                        {blog.title}
                      </Link>

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
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="read-more-btn"
                      rel="bookmark">
                      <span className="kenta-button-icon">
                        <i className="fas fa-arrow-right"></i>
                      </span>
                      <span className="kenta-button-text">
                        Read More <i className="bi bi-arrow-right"></i>
                      </span>
                    </Link>

                    <div className="blog-social">
                      <span><i className="bi bi-clock"></i> {blog.read_time} Minutes</span>
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
