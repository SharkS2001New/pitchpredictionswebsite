const SITE_ORIGIN = "https://www.pitchpredictions.com";

const NEXT_IMAGE_HOSTS = new Set([
  "www.pitchpredictions.com",
  "pitchpredictions.com",
  "api.pitchpredictions.com",
  "admin.pitchpredictions.com",
]);

export function normalizeImageSrc(src) {
  if (!src || typeof src !== "string") return null;

  const trimmed = src.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${SITE_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `${SITE_ORIGIN}/${trimmed.replace(/^\/+/, "")}`;
}

export function parseDimension(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function canUseNextImage(src) {
  if (!src || src.startsWith("data:")) {
    return false;
  }

  try {
    const { protocol, hostname } = new URL(src);
    if (protocol !== "http:" && protocol !== "https:") {
      return false;
    }

    const normalizedHost = hostname.replace(/^www\./, "");
    return (
      NEXT_IMAGE_HOSTS.has(normalizedHost) ||
      NEXT_IMAGE_HOSTS.has(`www.${normalizedHost}`) ||
      normalizedHost.endsWith(".pitchpredictions.com")
    );
  } catch {
    return false;
  }
}
