import { useEffect, useRef } from "react";

/** SSR: empty div only. Blog mounts client-side via createRoot. */
export default function HomepageBlogSlot() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let root;

    const mountBlog = async () => {
      const [{ createRoot }, { default: ShortBlogPosts }] = await Promise.all([
        import("react-dom/client"),
        import("./short-blog-posts"),
      ]);

      if (cancelled || !containerRef.current) return;

      root = createRoot(containerRef.current);
      root.render(<ShortBlogPosts />);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(mountBlog, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
        queueMicrotask(() => root?.unmount());
      };
    }

    const timeoutId = window.setTimeout(mountBlog, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      queueMicrotask(() => root?.unmount());
    };
  }, []);

  return <div ref={containerRef} />;
}
