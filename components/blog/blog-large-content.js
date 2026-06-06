"use client";

import { useEffect, useRef, useState } from "react";
import BlogContentSkeleton from "./blog-content-skeleton";

export default function BlogLargeContent({ slug, contentUrl }) {
  const containerRef = useRef(null);
  const fetchedSlugRef = useRef("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!slug || fetchedSlugRef.current === slug) {
      return undefined;
    }

    fetchedSlugRef.current = slug;
    setStatus("loading");

    const controller = new AbortController();

    const loadHtml = async () => {
      const sources = [
        contentUrl,
        `/api/blog-content/${encodeURIComponent(slug)}`,
      ].filter(Boolean);

      for (const source of sources) {
        try {
          const response = await fetch(source, {
            signal: controller.signal,
            cache: "no-store",
          });

          if (!response.ok) {
            continue;
          }

          const html = await response.text();
          if (controller.signal.aborted || !containerRef.current || !html) {
            return;
          }

          containerRef.current.innerHTML = html;
          setStatus("ready");
          return;
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
        }
      }

      if (!controller.signal.aborted) {
        setStatus("error");
      }
    };

    loadHtml();

    return () => {
      controller.abort();
    };
  }, [slug, contentUrl]);

  return (
    <div className="blog-article-body">
      {status !== "ready" ? <BlogContentSkeleton /> : null}
      {status === "error" ? (
        <p style={{ color: "#666", lineHeight: 1.8 }}>
          Unable to load this article right now. Please refresh and try again.
        </p>
      ) : null}
      <div
        ref={containerRef}
        className="blog-html-content"
        aria-busy={status !== "ready"}
        style={status === "ready" ? undefined : { display: "none" }}
      />
    </div>
  );
}
