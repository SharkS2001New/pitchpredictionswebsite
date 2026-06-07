import fs from "fs";
import path from "path";
import {
  hasCacheableData,
  removeCacheFileAtPath,
  writeCacheFileAtPath,
} from "./file_cache";

export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — blog list pages only
const API_BASE = "https://api.pitchpredictions.com/api/blog";
const BLOG_JSON_CACHE_DIR = path.join(process.cwd(), "pages", "blogscache");
const BLOG_HTML_CACHE_DIR = path.join(process.cwd(), "public", "blogscache");
const LEGACY_BLOG_CACHE_DIR = path.join(process.cwd(), "public", "cache");

function ensureBlogJsonCacheDir() {
  if (!fs.existsSync(BLOG_JSON_CACHE_DIR)) {
    fs.mkdirSync(BLOG_JSON_CACHE_DIR, { recursive: true });
  }
}

function ensureBlogHtmlCacheDir() {
  if (!fs.existsSync(BLOG_HTML_CACHE_DIR)) {
    fs.mkdirSync(BLOG_HTML_CACHE_DIR, { recursive: true });
  }
}

function getLegacyBlogPostPaths(slug) {
  const safeSlug = String(slug || "").replace(/[^a-zA-Z0-9_-]/g, "_");

  return {
    cachePath: path.join(LEGACY_BLOG_CACHE_DIR, `blog-post-${safeSlug}.json`),
    metaCachePath: path.join(
      LEGACY_BLOG_CACHE_DIR,
      `blog-post-${safeSlug}-meta.json`
    ),
    contentCachePath: path.join(
      LEGACY_BLOG_CACHE_DIR,
      `blog-post-${safeSlug}.html`
    ),
  };
}

function getLegacyBlogListCachePath(page, category) {
  const safeCategory = String(category || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");

  return path.join(
    LEGACY_BLOG_CACHE_DIR,
    `blog-list-page-${page}-category-${safeCategory}.json`
  );
}

function trimBlogListItem(blog) {
  if (!blog || typeof blog !== "object") return blog;

  return {
    id: blog.id,
    title: blog.title,
    excerpt: blog.excerpt,
    slug: blog.slug,
    read_time: blog.read_time,
    published_at: blog.published_at,
    created_at: blog.created_at,
    category: blog.category ? { name: blog.category.name } : null,
    user: blog.user ? { name: blog.user.name } : null,
  };
}

export function trimBlogListPayload(payload) {
  if (!payload) {
    return { data: [], current_page: 1, last_page: 1, total: 0 };
  }

  return {
    data: (payload.data || []).map(trimBlogListItem),
    current_page: payload.current_page || 1,
    last_page: payload.last_page || 1,
    total: payload.total || 0,
  };
}

export function trimBlogPostMeta(blog) {
  if (!blog || typeof blog !== "object") return null;

  return {
    id: blog.id ?? null,
    title: blog.title ?? null,
    excerpt: blog.excerpt ?? null,
    slug: blog.slug ?? null,
    read_time: blog.read_time ?? null,
    published_at: blog.published_at ?? null,
    created_at: blog.created_at ?? null,
    updated_at: blog.updated_at ?? null,
    meta_description: blog.meta_description ?? null,
    image: blog.image || blog.featured_image || blog.og_image || null,
    author: blog.author || blog.user?.name || null,
    category: blog.category
      ? {
          name: blog.category.name ?? null,
          blogs_category_title: blog.category.blogs_category_title ?? null,
        }
      : null,
    user: blog.user ? { name: blog.user.name ?? null } : null,
  };
}

export function getBlogPostCachePath(slug) {
  const safeSlug = String(slug || "").replace(/[^a-zA-Z0-9_-]/g, "_");

  return {
    cacheDir: BLOG_JSON_CACHE_DIR,
    safeSlug,
    cachePath: path.join(BLOG_JSON_CACHE_DIR, `blog-post-${safeSlug}.json`),
    metaCachePath: path.join(
      BLOG_JSON_CACHE_DIR,
      `blog-post-${safeSlug}-meta.json`
    ),
    contentCachePath: path.join(
      BLOG_HTML_CACHE_DIR,
      `blog-post-${safeSlug}.html`
    ),
    publicContentUrl: `/blogscache/blog-post-${safeSlug}.html`,
  };
}

function getBlogPostSlugVariants(slug) {
  const raw = String(slug || "").trim();
  const safeSlug = raw.replace(/[^a-zA-Z0-9_-]/g, "_");

  return [...new Set([raw, safeSlug].filter(Boolean))];
}

function listBlogPostCacheFiles(slug) {
  const variants = getBlogPostSlugVariants(slug);
  const dirs = [BLOG_JSON_CACHE_DIR, BLOG_HTML_CACHE_DIR, LEGACY_BLOG_CACHE_DIR];
  const files = new Set();

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;

    for (const name of fs.readdirSync(dir)) {
      if (!name.startsWith("blog-post-")) continue;

      for (const variant of variants) {
        if (name.startsWith(`blog-post-${variant}`)) {
          files.add(path.join(dir, name));
          break;
        }
      }
    }
  }

  return [...files];
}

export function clearBlogPostCache(slug) {
  if (!slug) {
    return { slug: "", removed: [], notFound: [], failed: [], removedFiles: [] };
  }

  const { safeSlug } = getBlogPostCachePath(slug);
  const files = listBlogPostCacheFiles(slug);
  const removed = [];
  const notFound = [];
  const failed = [];
  const removedFiles = [];

  if (files.length === 0) {
    return {
      slug: safeSlug,
      removed: [],
      notFound: ["json", "meta", "html", "legacyJson", "legacyMeta", "legacyHtml"],
      failed: [],
      removedFiles: [],
    };
  }

  for (const file of files) {
    const basename = path.basename(file);
    const deleted = removeCacheFileAtPath(file);

    if (deleted) {
      removedFiles.push(basename);
      if (basename.endsWith("-meta.json")) {
        removed.push("meta");
      } else if (basename.endsWith(".json")) {
        removed.push("json");
      } else if (basename.endsWith(".html")) {
        removed.push("html");
      } else {
        removed.push(basename);
      }
    } else if (fs.existsSync(file)) {
      failed.push(basename);
    } else {
      notFound.push(basename);
    }
  }

  return {
    slug: safeSlug,
    removed: [...new Set(removed)],
    notFound: [...new Set(notFound)],
    failed: [...new Set(failed)],
    removedFiles,
  };
}

export function readBlogPostCache(cachePath) {
  if (!fs.existsSync(cachePath)) return null;

  try {
    const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    // Blog posts stay cached until explicitly cleared via /api/clear-blog-cache/[slug]
    return { cache, isFresh: true };
  } catch {
    return null;
  }
}

function migrateBlogPostCacheFile(slug, type) {
  const paths = getBlogPostCachePath(slug);
  const legacy = getLegacyBlogPostPaths(slug);
  const targetPath = type === "meta" ? paths.metaCachePath : paths.cachePath;
  const legacyPath = type === "meta" ? legacy.metaCachePath : legacy.cachePath;
  const cached = readBlogPostCache(legacyPath);

  if (!cached) return null;

  ensureBlogJsonCacheDir();
  writeCacheFileAtPath(targetPath, cached.cache);
  return readBlogPostCache(targetPath);
}

export function readBlogPostJsonCache(slug) {
  const { cachePath } = getBlogPostCachePath(slug);
  return readBlogPostCache(cachePath) || migrateBlogPostCacheFile(slug, "data");
}

export function readBlogPostMetaCache(slug) {
  const { metaCachePath } = getBlogPostCachePath(slug);
  return (
    readBlogPostCache(metaCachePath) || migrateBlogPostCacheFile(slug, "meta")
  );
}

function stripBlogContent(blogData) {
  if (!blogData || typeof blogData !== "object") return blogData;

  const { content: _content, ...rest } = blogData;
  return rest;
}

export function writeBlogPostContentHtml(slug, html) {
  const { contentCachePath } = getBlogPostCachePath(slug);

  if (!html) {
    removeCacheFileAtPath(contentCachePath);
    return;
  }

  ensureBlogHtmlCacheDir();

  const tempPath = `${contentCachePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, html, "utf8");
  fs.renameSync(tempPath, contentCachePath);
}

export function readBlogPostContentHtml(slug) {
  const { cachePath, metaCachePath, contentCachePath } =
    getBlogPostCachePath(slug);
  const legacy = getLegacyBlogPostPaths(slug);
  const metaCached =
    readBlogPostCache(metaCachePath) || readBlogPostCache(legacy.metaCachePath);
  const fullCached =
    readBlogPostCache(cachePath) || readBlogPostCache(legacy.cachePath);

  const resolvedContentPath = fs.existsSync(contentCachePath)
    ? contentCachePath
    : legacy.contentCachePath;

  if (fs.existsSync(resolvedContentPath)) {
    const isFresh = Boolean(metaCached?.isFresh || fullCached?.isFresh);

    if (isFresh) {
      try {
        const html = fs.readFileSync(resolvedContentPath, "utf8");
        if (
          resolvedContentPath !== contentCachePath &&
          html &&
          !fs.existsSync(contentCachePath)
        ) {
          writeBlogPostContentHtml(slug, html);
        }
        return html;
      } catch {
        return null;
      }
    }
  }

  const legacyContent = fullCached?.cache?.data?.content;
  if (typeof legacyContent === "string" && legacyContent.length > 0) {
    const generatedAt =
      fullCached.cache.generatedAt || new Date().toISOString();

    writeBlogPostContentHtml(slug, legacyContent);
    writeCacheFileAtPath(cachePath, {
      generatedAt,
      data: stripBlogContent(fullCached.cache.data),
    });

    return legacyContent;
  }

  return null;
}

export function getBlogPostContentInfo(slug) {
  const { contentCachePath, publicContentUrl } = getBlogPostCachePath(slug);
  const legacyContentPath = getLegacyBlogPostPaths(slug).contentCachePath;
  const resolvedContentPath = fs.existsSync(contentCachePath)
    ? contentCachePath
    : legacyContentPath;

  if (!fs.existsSync(resolvedContentPath)) {
    return { size: 0, publicUrl: publicContentUrl };
  }

  try {
    return {
      size: fs.statSync(resolvedContentPath).size,
      publicUrl: publicContentUrl,
    };
  } catch {
    return { size: 0, publicUrl: publicContentUrl };
  }
}

export function getCachePath(page, category) {
  ensureBlogJsonCacheDir();
  const safeCategory = String(category || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");
  return {
    cacheDir: BLOG_JSON_CACHE_DIR,
    cachePath: path.join(
      BLOG_JSON_CACHE_DIR,
      `blog-list-page-${page}-category-${safeCategory}.json`
    ),
    legacyCachePath: getLegacyBlogListCachePath(page, category),
  };
}

export function readCache(cachePath) {
  if (!fs.existsSync(cachePath)) return null;

  try {
    const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    const ageMs = Date.now() - new Date(cache.generatedAt).getTime();
    return { cache, isFresh: ageMs <= CACHE_TTL_MS };
  } catch (error) {
    return null;
  }
}

function blogListPayloadHasBloat(payload) {
  return (payload?.data || []).some(
    (item) =>
      item &&
      typeof item === "object" &&
      ("content" in item || "blogs_category_id" in item || "user_id" in item)
  );
}

export function readTrimmedBlogListCache(cachePath, legacyCachePath) {
  const cached =
    readCache(cachePath) ||
    (legacyCachePath ? readCache(legacyCachePath) : null);
  if (!cached) return null;

  const trimmedPayload = trimBlogListPayload(cached.cache.payload);
  const targetPath = fs.existsSync(cachePath)
    ? cachePath
    : legacyCachePath || cachePath;

  if (blogListPayloadHasBloat(cached.cache.payload)) {
    writeCacheFileAtPath(targetPath, {
      generatedAt: cached.cache.generatedAt,
      payload: trimmedPayload,
    });
  } else if (legacyCachePath && targetPath === legacyCachePath) {
    ensureBlogJsonCacheDir();
    writeCacheFileAtPath(cachePath, {
      generatedAt: cached.cache.generatedAt,
      payload: trimmedPayload,
    });
  }

  return {
    ...cached,
    payload: trimmedPayload,
  };
}

export function writeCache(cacheDir, cachePath, payload) {
  if (!hasCacheableData(payload?.data)) {
    removeCacheFileAtPath(cachePath);
    return null;
  }

  ensureBlogJsonCacheDir();

  const cacheData = {
    generatedAt: new Date().toISOString(),
    payload,
  };

  writeCacheFileAtPath(cachePath, cacheData);

  return cacheData;
}

export async function fetchBlogList(page, category) {
  const response = await fetch(`${API_BASE}?page=${page}&category=${category}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs (${response.status})`);
  }

  const data = await response.json();

  return trimBlogListPayload(data);
}

/** Clears blog list + homepage snippet caches (not individual post files). */
export function clearBlogListCaches() {
  const removedFiles = [];
  const failed = [];
  const dirs = [BLOG_JSON_CACHE_DIR, LEGACY_BLOG_CACHE_DIR];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      const isListCache = file.startsWith("blog-list-page-");
      const isHomeSnippet = file === "blog-posts.json";

      if (!isListCache && !isHomeSnippet) continue;

      const filePath = path.join(dir, file);
      if (removeCacheFileAtPath(filePath)) {
        removedFiles.push(file);
      } else if (fs.existsSync(filePath)) {
        failed.push(file);
      }
    }
  }

  return { removedFiles, failed };
}
