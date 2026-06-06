import fs from "fs";
import path from "path";

export const CACHE_DIR = path.join(process.cwd(), "public", "cache");

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

export function writeCacheFile(filename, data) {
  const cachePath = getCacheFilePath(filename);
  const tempPath = `${cachePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
  fs.renameSync(tempPath, cachePath);
  return cachePath;
}
