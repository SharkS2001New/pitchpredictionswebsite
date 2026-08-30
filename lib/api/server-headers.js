/**
 * Headers for Pitch Predictions API (Node SSR, pages/api, shared helpers).
 * Backend EnsureApiAllowedOrigin requires Origin + ACCESS_TOKEN for non-browser clients.
 */
export const API_BASE = "https://api.pitchpredictions.com/api";
export const SITE_ORIGIN = "https://www.pitchpredictions.com";

/** Prefer env; fallback matches backend ACCESS_TOKEN so SSR works after deploy. */
export function getAccessToken() {
  return (
    process.env.ACCESS_TOKEN ||
    process.env.PITCH_ACCESS_TOKEN ||
    "UJlhuDILIR1Lc2IEwZDIKOln9d"
  );
}

/** Commercial jackpot key — MUST match backend JACKPOT_API_KEY (not ACCESS_TOKEN). */
export function getJackpotApiKey() {
  return (
    process.env.JACKPOT_API_KEY ||
    "jp_shared_8KxQm2NvR9pLwT4yHcF6uA1eZbD3sG7j"
  );
}

export function getServerApiHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=UTF-8",
    Origin: SITE_ORIGIN,
    Authorization: `Bearer ${getAccessToken()}`,
    ...extra,
  };
}

/**
 * Headers for jackpot routes (fetch_jackpot_*, /api/jackpot/*).
 * ACCESS_TOKEN / PARTNER_ACCESS_TOKEN are rejected on these paths.
 */
export function getJackpotServerHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=UTF-8",
    Origin: SITE_ORIGIN,
    "X-Jackpot-Client": "server",
    "X-Jackpot-Key": getJackpotApiKey(),
    "X-Jackpot-Site": SITE_ORIGIN,
    ...extra,
  };
}

/** Merge into an existing headers object (keeps caller extras). */
export function withServerApiHeaders(headers = {}) {
  return {
    ...getServerApiHeaders(),
    ...headers,
    Origin: SITE_ORIGIN,
    Authorization: `Bearer ${getAccessToken()}`,
  };
}
