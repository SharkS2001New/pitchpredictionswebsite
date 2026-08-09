import { BLOG_REMOTE_TIMEOUT_MS } from "./blog-content-config";

export async function fetchWithTimeout(url, options = {}, timeoutMs = BLOG_REMOTE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
