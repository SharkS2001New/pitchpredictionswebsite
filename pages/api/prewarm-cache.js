import fs from "fs";
import path from "path";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";

function getTipsRoutes() {
  const tipsDir = path.join(process.cwd(), "pages", "tips");
  if (!fs.existsSync(tipsDir)) return [];

  return fs
    .readdirSync(tipsDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => `/tips/${file.replace(".js", "")}`);
}

function getCoreRoutes() {
  return [
    "/",
    "/football-predictions-today",
    "/football-predictions-today/double-chance-predictions",
    "/football-predictions-today/predictions-under-over",
    "/football-predictions-today/predictions-halftime-fulltime",
    "/football-predictions-today/predictions-both-to-score",
    "/1x2-betting-tips",
    "/top-football-tips-and-predictions/today",
    "/top-football-tips-and-predictions/today/double-chance-predictions",
    "/top-football-tips-and-predictions/today/predictions-under-over",
    "/top-football-tips-and-predictions/today/predictions-halftime-fulltime",
    "/top-football-tips-and-predictions/today/predictions-both-to-score",
  ];
}

async function warmRoute(baseUrl, route, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const joiner = route.includes("?") ? "&" : "?";
    const url = `${baseUrl}${route}${joiner}warm=${Date.now()}`;
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "x-cache-warm": "1" },
    });

    return {
      route,
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      route,
      ok: false,
      status: 0,
      error: error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getCachePolicyByRoute(route) {
  if (route.startsWith("/football-predictions-today")) {
    return {
      prefix: "todays-predictions-",
      ttlMs: 1 * 60 * 1000,
    };
  }

  if (
    route === "/" ||
    route === "/1x2-betting-tips" ||
    route.startsWith("/tips/") ||
    route.startsWith("/top-football-tips-and-predictions")
  ) {
    return {
      prefix: "top-football-predictions-",
      ttlMs: 1 * 60 * 1000,
    };
  }

  return null;
}

function getCacheStatusForRoute(route, nearExpiryMs) {
  const policy = getCachePolicyByRoute(route);
  if (!policy) {
    return { shouldWarm: true, reason: "no-cache-policy" };
  }

  const cacheDir = path.join(process.cwd(), "public", "cache");
  const today = getFormattedCurrentDate();
  const cacheFilename = `${policy.prefix}${today}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  if (!fs.existsSync(cachePath)) {
    return {
      shouldWarm: true,
      reason: "cache-missing",
      cachePath,
    };
  }

  try {
    const cacheRaw = fs.readFileSync(cachePath, "utf8");
    const cache = JSON.parse(cacheRaw);
    const generatedAt = new Date(cache.generatedAt).getTime();

    if (!Number.isFinite(generatedAt)) {
      return {
        shouldWarm: true,
        reason: "invalid-cache-timestamp",
        cachePath,
      };
    }

    const now = Date.now();
    const remainingMs = policy.ttlMs - (now - generatedAt);
    const shouldWarm = remainingMs <= nearExpiryMs;
    const reason = remainingMs <= 0 ? "cache-expired" : shouldWarm ? "cache-near-expiry" : "cache-fresh";

    return {
      shouldWarm,
      reason,
      remainingMs,
      cachePath,
    };
  } catch (error) {
    return {
      shouldWarm: true,
      reason: "cache-read-error",
      cachePath,
      error: error.message,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CACHE_WARM_KEY || "";
  const token = req.headers.authorization?.replace("Bearer ", "") || req.query.key || "";
  if (secret && token !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const baseUrl = process.env.CACHE_WARM_BASE_URL || "https://www.pitchpredictions.com";
  const only = req.query.only;
  const nearExpirySeconds = Number(req.query.near_expiry_seconds ?? 30);
  const nearExpiryMs = Number.isFinite(nearExpirySeconds) && nearExpirySeconds >= 0
    ? nearExpirySeconds * 1000
    : 30000;
  const forceWarm = req.query.force === "1";

  let routes = [...getCoreRoutes(), ...getTipsRoutes()];
  if (typeof only === "string" && only.trim().length > 0) {
    routes = routes.filter((route) => route.includes(only));
  }

  const results = [];
  let skipped = 0;

  for (const route of routes) {
    const cacheStatus = getCacheStatusForRoute(route, nearExpiryMs);
    if (!forceWarm && !cacheStatus.shouldWarm) {
      skipped += 1;
      results.push({
        route,
        ok: true,
        status: 304,
        skipped: true,
        reason: cacheStatus.reason,
        remainingMs: cacheStatus.remainingMs,
      });
      continue;
    }

    // Force a fresh rebuild when cache is near expiry/expired.
    if (cacheStatus.cachePath && fs.existsSync(cacheStatus.cachePath)) {
      try {
        fs.unlinkSync(cacheStatus.cachePath);
      } catch (unlinkError) {
        // If unlink fails, continue and let page-level logic decide.
      }
    }

    const result = await warmRoute(baseUrl, route);
    results.push({
      ...result,
      reason: cacheStatus.reason,
      remainingMs: cacheStatus.remainingMs,
    });
  }

  const warmed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  return res.status(200).json({
    baseUrl,
    nearExpirySeconds: nearExpiryMs / 1000,
    total: results.length,
    warmed,
    skipped,
    failed,
    results,
  });
}
