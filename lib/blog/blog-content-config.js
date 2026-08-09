/** Prefer static HTML / client load above this size to keep SSR and __NEXT_DATA__ small. */
export const LARGE_BLOG_CONTENT_BYTES = 48 * 1024;

/** Abort remote CMS fetches so a slow API cannot hang blog SSR indefinitely. */
export const BLOG_REMOTE_TIMEOUT_MS = 8000;

export const BLOG_HTML_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

export const BLOG_LIST_CACHE_CONTROL =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=3600";
