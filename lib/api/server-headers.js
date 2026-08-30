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

export function getServerApiHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=UTF-8",
    Origin: SITE_ORIGIN,
    Authorization: `Bearer ${getAccessToken()}`,
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
