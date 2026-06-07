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

async function fetchHomepagePosts() {
  const listResponse = await fetch("/api/blog-list?page=1&category=ALL");
  if (listResponse.ok) {
    const listData = await listResponse.json();
    if (listData?.data?.length) {
      return listData.data;
    }
  }

  const postsResponse = await fetch("/api/blog-posts");
  if (postsResponse.ok) {
    const postsData = await postsResponse.json();
    if (postsData?.data?.length) {
      return postsData.data;
    }
  }

  return [];
}

export default function ShortBlogPosts() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = () => {
      fetchHomepagePosts()
        .then((data) => {
          if (!cancelled) {
            setPosts(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPosts([]);
          }
        });
    };

    if ("requestIdleCallback" in window) {
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
  }, []);

  if (!posts?.length) {
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
