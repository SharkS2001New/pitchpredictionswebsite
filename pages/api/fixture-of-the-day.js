// pages/api/fixture-of-the-day.js
import fs from 'fs';
import path from 'path';
import {
  hasCacheableData,
  removeCacheFileAtPath,
  writeCacheFileAtPath,
} from '../../components/functions/file_cache';

const UPSTREAM_HEADERS = {
  Origin: 'https://www.pitchpredictions.com',
  Authorization: `Bearer ${process.env.ACCESS_TOKEN || 'UJlhuDILIR1Lc2IEwZDIKOln9d'}`,
};

const UPSTREAM_TIMEOUT_MS = 15000;

async function fetchUpstreamJson(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: UPSTREAM_HEADERS,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const bodyText = await response.text();

    if (!contentType.includes('application/json')) {
      console.error(
        'fixture-of-the-day upstream non-JSON:',
        url,
        response.status,
        bodyText.slice(0, 120)
      );
      return null;
    }

    try {
      return JSON.parse(bodyText);
    } catch (parseError) {
      console.error('fixture-of-the-day upstream JSON parse failed:', url, parseError.message);
      return null;
    }
  } catch (error) {
    console.error('fixture-of-the-day upstream fetch failed:', url, error.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function readCacheFile(cachePath) {
  if (!fs.existsSync(cachePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch {
    removeCacheFileAtPath(cachePath);
    return null;
  }
}

function respondWithCache(res, cache, { stale = false } = {}) {
  return res.status(200).json({
    fromCache: true,
    stale,
    generatedAt: cache.generatedAt,
    data: cache.data,
    isPrimary: cache.isPrimary,
    status: cache.status,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const date = Array.isArray(req.query.date) ? req.query.date[0] : req.query.date;
  const refresh = req.query.refresh === 'true' || req.query.refresh === '1';

  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cacheFilename = `fixture-of-the-day-${date}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const existingCache = readCacheFile(cachePath);

    if (!refresh && existingCache && hasCacheableData(existingCache.data)) {
      const cacheTime = new Date(existingCache.generatedAt).getTime();
      const ageInHours = (Date.now() - cacheTime) / (1000 * 60 * 60);

      if (ageInHours <= 1) {
        return respondWithCache(res, existingCache);
      }
    } else if (existingCache && !hasCacheableData(existingCache.data)) {
      removeCacheFileAtPath(cachePath);
    }

    let responseData = null;
    let isPrimary = false;
    let status = 'No game available';

    const primaryData = await fetchUpstreamJson(
      `https://api.pitchpredictions.com/api/match_of_the_day?fixture_date=${encodeURIComponent(date)}`
    );

    if (primaryData?.status === true && primaryData.data?.length > 0) {
      responseData = primaryData.data[0];
      isPrimary = true;
      status = primaryData.message || 'success';
    } else {
      const alternativeData = await fetchUpstreamJson(
        `https://api.pitchpredictions.com/api/auto_featured_match_of_the_day?fixture_date=${encodeURIComponent(date)}`
      );

      if (alternativeData?.status === true && alternativeData.data?.length > 0) {
        responseData = alternativeData.data[0];
        isPrimary = false;
        status = alternativeData.message || 'success';
      }
    }

    const generatedAt = new Date().toISOString();

    if (hasCacheableData(responseData)) {
      const cacheData = {
        generatedAt,
        date,
        data: responseData,
        isPrimary,
        status,
      };

      writeCacheFileAtPath(cachePath, cacheData);
      cleanupOldCacheFiles(cacheDir);

      return res.status(200).json({
        fromCache: false,
        generatedAt,
        data: responseData,
        isPrimary,
        status,
      });
    }

    // Upstream empty or failed — serve stale cache instead of 500.
    if (existingCache && hasCacheableData(existingCache.data)) {
      return respondWithCache(res, existingCache, { stale: true });
    }

    removeCacheFileAtPath(cachePath);

    return res.status(200).json({
      fromCache: false,
      generatedAt,
      data: null,
      isPrimary: false,
      status,
    });
  } catch (error) {
    console.error('Error in fixture-of-the-day API:', error);

    const fallbackCache = readCacheFile(cachePath);
    if (fallbackCache && hasCacheableData(fallbackCache.data)) {
      return respondWithCache(res, fallbackCache, { stale: true });
    }

    return res.status(200).json({
      fromCache: false,
      generatedAt: new Date().toISOString(),
      data: null,
      isPrimary: false,
      status: 'error',
    });
  }
}

function cleanupOldCacheFiles(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;

    const files = fs.readdirSync(cacheDir);
    const now = Date.now();
    const maxAge = 30 * 60 * 1000;

    for (const file of files) {
      if (file.startsWith('fixture-of-the-day-') && file.endsWith('.json')) {
        const filePath = path.join(cacheDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}
