import fs from "fs";
import path from "path";

export const CACHE_DIR = path.join(process.cwd(), "public", "cache");
export const CACHE_CLEAR_KEY_LENGTH = 24;

const CACHE_DATA_KEYS = ["data", "gamesData", "initialData"];
const DEFAULT_STALE_CACHE_MS = 2 * 60 * 60 * 1000; // 2 hours

function isBlogCacheFile(file) {
  return (
    file === "blog-posts.json" ||
    file.startsWith("blog-post-") ||
    file.startsWith("blog-list-page-")
  );
}

export function getCacheClearKey() {
  const secret = (
    process.env.CACHE_CLEAR_KEY ||
    process.env.BLOG_CACHE_CLEAR_KEY ||
    ""
  ).trim();

  if (secret.length !== CACHE_CLEAR_KEY_LENGTH) {
    return null;
  }

  return secret;
}

export function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCacheFilePath(filename) {
  ensureCacheDir();
  const safeName = path.basename(String(filename).replace(/[/\\]/g, "-"));
  return path.join(CACHE_DIR, safeName);
}

export function getCacheGeneratedAtMs(cachePath) {
  try {
    if (!cachePath || !fs.existsSync(cachePath)) return null;

    const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    const generatedAt = new Date(cache?.generatedAt).getTime();

    return Number.isFinite(generatedAt) ? generatedAt : null;
  } catch {
    return null;
  }
}

export function readJsonCache(cachePath, maxAgeMs) {
  const generatedAt = getCacheGeneratedAtMs(cachePath);

  if (generatedAt == null) {
    removeCacheFileAtPath(cachePath);
    return null;
  }

  if (Date.now() - generatedAt > maxAgeMs) {
    removeCacheFileAtPath(cachePath);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  } catch {
    removeCacheFileAtPath(cachePath);
    return null;
  }
}

export function clearPredictionJsonCaches({
  prefix = null,
  cacheDir = CACHE_DIR,
  includeBlog = false,
} = {}) {
  const removed = [];
  const failed = [];

  if (!fs.existsSync(cacheDir)) {
    return { removed, failed, count: 0, cleared: true };
  }

  for (const file of fs.readdirSync(cacheDir)) {
    if (!file.endsWith(".json")) continue;
    if (!includeBlog && isBlogCacheFile(file)) continue;
    if (prefix && !file.startsWith(prefix)) continue;

    const filePath = path.join(cacheDir, file);
    if (removeCacheFileAtPath(filePath)) {
      removed.push(file);
      continue;
    }

    if (fs.existsSync(filePath)) {
      failed.push(file);
    }
  }

  return {
    removed,
    failed,
    count: removed.length,
    cleared: failed.length === 0,
  };
}

export function purgeStaleJsonCaches(
  maxAgeMs = DEFAULT_STALE_CACHE_MS,
  cacheDir = CACHE_DIR
) {
  const removed = [];

  if (!fs.existsSync(cacheDir)) {
    return { removed, count: 0 };
  }

  for (const file of fs.readdirSync(cacheDir)) {
    if (!file.endsWith(".json")) continue;
    if (isBlogCacheFile(file)) continue;

    const filePath = path.join(cacheDir, file);
    const generatedAt = getCacheGeneratedAtMs(filePath);
    const isStale =
      generatedAt == null || Date.now() - generatedAt > maxAgeMs;

    if (isStale && removeCacheFileAtPath(filePath)) {
      removed.push(file);
    }
  }

  return { removed, count: removed.length };
}

export function hasCacheableData(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    const nested = getCachePayload(value);
    if (nested !== value) return hasCacheableData(nested);
    return Object.keys(value).length > 0;
  }
  return Boolean(value);
}

export function getCachePayload(cacheData) {
  if (!cacheData || typeof cacheData !== "object") return cacheData;

  for (const key of CACHE_DATA_KEYS) {
    if (key in cacheData) {
      return cacheData[key];
    }
  }

  if (cacheData.payload && typeof cacheData.payload === "object") {
    if ("data" in cacheData.payload) {
      return cacheData.payload.data;
    }
    return cacheData.payload;
  }

  return cacheData;
}

export function removeCacheFileAtPath(cachePath) {
  try {
    if (cachePath && fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return !fs.existsSync(cachePath);
    }
    return false;
  } catch (error) {
    console.error("Error removing cache file:", error);
    return false;
  }
}

export function removeCacheFile(filename) {
  removeCacheFileAtPath(getCacheFilePath(filename));
}

export function writeCacheFileAtPath(cachePath, data, { dataKey } = {}) {
  const payload =
    dataKey && data && typeof data === "object" && dataKey in data
      ? data[dataKey]
      : getCachePayload(data);

  if (!hasCacheableData(payload)) {
    removeCacheFileAtPath(cachePath);
    return null;
  }

  ensureCacheDir();
  const tempPath = `${cachePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
  fs.renameSync(tempPath, cachePath);
  purgeStaleJsonCaches();
  return cachePath;
}

export function writeCacheFile(filename, data, options) {
  return writeCacheFileAtPath(getCacheFilePath(filename), data, options);
}
