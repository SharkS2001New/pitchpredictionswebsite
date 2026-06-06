import fs from "fs";
import path from "path";

export const CACHE_DIR = path.join(process.cwd(), "public", "cache");

const CACHE_DATA_KEYS = ["data", "gamesData", "initialData"];

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
    }
  } catch (error) {
    console.error("Error removing cache file:", error);
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
  return cachePath;
}

export function writeCacheFile(filename, data, options) {
  return writeCacheFileAtPath(getCacheFilePath(filename), data, options);
}
