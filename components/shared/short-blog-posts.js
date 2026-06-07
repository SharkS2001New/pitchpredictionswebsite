"use client";

import { useEffect, useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const normalized = String(dateString).trim().replace(" ", "T");
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getPostDate(post) {
  return post.published_at || post.created_at || post.post_date || post.date;
}

export default function ShortBlogPosts({ posts: initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      return;
    }

    let cancelled = false;

    const loadPosts = () => {
      fetch("/api/blog-list?page=1&category=ALL")
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (!cancelled && data?.data?.length) {
            setPosts(data.data);
            return;
          }

          if (!cancelled) {
            return fetch("/api/blog-posts")
              .then((response) => (response.ok ? response.json() : null))
              .then((fallback) => {
                if (!cancelled && fallback?.data?.length) {
                  setPosts(fallback.data);
                }
              });
          }
        })
        .catch(() => {});
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadPosts, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(loadPosts, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [initialPosts]);

  if (!posts.length) {
    return null;
  }

  return (
    <div className="container-wide" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <h2 className="sectionTitle text-center" style={{ marginBottom: "10px" }}>
        Latest News - Blog
      </h2>
      <div className="row" style={{ marginBottom: 0 }}>
        {posts.map((post, index) => {
          const itemKey = post.ID || post.id || post.slug || `post-${index}`;

          return (
            <div key={itemKey} className="col-md-6 col-12">
              <div className="post-item p-3 m-1">
                <span className="h6 post-title linkTxt3 mb-3">
                  <a
                    href={
                      post.post_link ||
                      (post.slug ? `/blog/${post.slug}` : "#")
                    }
                  >
                    {post.title || "Untitled"}
                  </a>
                </span>
                <p className="post-date">{formatDate(getPostDate(post))}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
