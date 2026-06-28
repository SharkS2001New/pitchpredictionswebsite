import {
  getBlogPostCachePath,
  getBlogPostContentInfo,
  readBlogPostContentHtml,
  readBlogPostJsonCache,
  readBlogPostMetaCache,
  trimBlogPostMeta,
  writeBlogPostContentHtml,
} from "../../components/functions/blog_list_cache";
import { getBlogHtmlContent } from "./blog-utils";
import {
  hasCacheableData,
  removeCacheFileAtPath,
  writeCacheFileAtPath,
} from "../../components/functions/file_cache";

const API_HEADERS = {
  "Content-type": "application/json; charset=UTF-8",
  Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
};

function stripBlogContent(blogData) {
  if (!blogData || typeof blogData !== "object") return blogData;

  const { content: _content, ...rest } = blogData;
  return rest;
}

function writeBlogPostCaches(slug, blogData) {
  const { cachePath, metaCachePath } = getBlogPostCachePath(slug);
  const generatedAt = new Date().toISOString();
  const content = getBlogHtmlContent(blogData);

  writeCacheFileAtPath(cachePath, {
    generatedAt,
    data: stripBlogContent(blogData),
  });

  writeCacheFileAtPath(metaCachePath, {
    generatedAt,
    data: trimBlogPostMeta(blogData),
  });

  writeBlogPostContentHtml(slug, content);
}

function assembleBlogPost(slug, blogData, content) {
  if (!blogData) return null;

  return {
    ...blogData,
    content: content ?? "",
  };
}

async function fetchBlogPostUncached(slug) {
  if (!slug) return null;

  const cached = readBlogPostJsonCache(slug);
  const cachedContent = readBlogPostContentHtml(slug);

  if (cached?.isFresh && hasCacheableData(cached.cache?.data) && cachedContent) {
    return assembleBlogPost(slug, cached.cache.data, cachedContent);
  }

  const response = await fetch(
    `https://api.pitchpredictions.com/api/blog/${slug}`,
    {
      headers: API_HEADERS,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch blog (${response.status})`);
  }

  const payload = await response.json();
  const blogData = payload.data || payload;

  if (!hasCacheableData(blogData)) {
    const { cachePath, metaCachePath, contentCachePath } =
      getBlogPostCachePath(slug);
    removeCacheFileAtPath(cachePath);
    removeCacheFileAtPath(metaCachePath);
    removeCacheFileAtPath(contentCachePath);
    return null;
  }

  writeBlogPostCaches(slug, blogData);

  return blogData;
}

async function fetchBlogPostMetaUncached(slug) {
  if (!slug) return null;

  const metaCached = readBlogPostMetaCache(slug);

  if (metaCached?.isFresh && hasCacheableData(metaCached.cache?.data)) {
    return metaCached.cache.data;
  }

  const fullCached = readBlogPostJsonCache(slug);

  if (fullCached?.isFresh && hasCacheableData(fullCached.cache?.data)) {
    const meta = trimBlogPostMeta(fullCached.cache.data);
    const { metaCachePath } = getBlogPostCachePath(slug);
    writeCacheFileAtPath(metaCachePath, {
      generatedAt: fullCached.cache.generatedAt,
      data: meta,
    });
    return meta;
  }

  const blogData = await fetchBlogPostUncached(slug);
  return blogData ? trimBlogPostMeta(blogData) : null;
}

async function fetchBlogPostContentUncached(slug) {
  if (!slug) return null;

  const blogData = await fetchBlogPostUncached(slug);
  const content = getBlogHtmlContent(blogData);
  if (content) {
    return content;
  }

  return readBlogPostContentHtml(slug);
}

export const fetchBlogPost = fetchBlogPostUncached;
export const fetchBlogPostMeta = fetchBlogPostMetaUncached;
export const fetchBlogPostContent = fetchBlogPostContentUncached;

export async function ensureBlogPostContentCached(slug) {
  if (!slug) {
    return getBlogPostContentInfo(slug);
  }

  let info = getBlogPostContentInfo(slug);

  if (info.size > 0) {
    return info;
  }

  await fetchBlogPostUncached(slug);
  info = getBlogPostContentInfo(slug);

  return info;
}
