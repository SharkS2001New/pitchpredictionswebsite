import fs from "fs";
import path from "path";

export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const API_BASE = "https://api.pitchpredictions.com/api/blog";

export function getCachePath(page, category) {
  const cacheDir = path.join(process.cwd(), "public", "cache");
  const safeCategory = String(category || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");
  return {
    cacheDir,
    cachePath: path.join(cacheDir, `blog-list-page-${page}-category-${safeCategory}.json`),
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

export function writeCache(cacheDir, cachePath, payload) {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cacheData = {
    generatedAt: new Date().toISOString(),
    payload,
  };

  const tempPath = `${cachePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
  fs.renameSync(tempPath, cachePath);

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

  return {
    data: data.data || [],
    current_page: data.current_page || 1,
    last_page: data.last_page || 1,
    total: data.total || 0,
  };
}
