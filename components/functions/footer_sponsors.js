import fs from "fs";
import path from "path";
import crypto from "crypto";

export const FOOTER_SPONSORS_RELATIVE_PATH = path.join(
  "public",
  "site-content",
  "footer-sponsors.json"
);

export const FOOTER_SPONSORS_CACHE_TTL_MS = 45 * 1000;

let memoryCache = {
  loadedAt: 0,
  document: null,
};

function filePath() {
  return path.join(process.cwd(), FOOTER_SPONSORS_RELATIVE_PATH);
}

function emptyDocument() {
  return {
    updated_at: new Date().toISOString(),
    links: [],
  };
}

function parseDateOnly(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  // Treat YYYY-MM-DD as UTC end/start of day for stable comparisons
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function todayUtcDateString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function slugifyId(label, url) {
  const base = String(label || url || "link")
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || `link-${crypto.randomBytes(3).toString("hex")}`;
}

export function normalizeSponsorLink(raw, index = 0) {
  const label = String(raw?.label || "").trim();
  const url = String(raw?.url || "").trim();
  const id =
    String(raw?.id || "").trim() ||
    `${slugifyId(label, url)}-${index + 1}`;

  return {
    id,
    label,
    url,
    starts_at: parseDateOnly(raw?.starts_at),
    expires_at: parseDateOnly(raw?.expires_at),
    notes: String(raw?.notes || "").trim(),
    active: raw?.active === false ? false : true,
  };
}

export function normalizeSponsorDocument(raw) {
  const links = Array.isArray(raw?.links) ? raw.links : [];
  return {
    updated_at:
      String(raw?.updated_at || "").trim() || new Date().toISOString(),
    links: links
      .map((link, index) => normalizeSponsorLink(link, index))
      .filter((link) => link.label && link.url),
  };
}

export function isSponsorVisible(link, now = new Date()) {
  if (!link || link.active === false) return false;
  const today = todayUtcDateString(now);
  if (link.starts_at && today < link.starts_at) return false;
  if (link.expires_at && today > link.expires_at) return false;
  return Boolean(link.label && link.url);
}

export function filterVisibleSponsors(links, now = new Date()) {
  return (Array.isArray(links) ? links : []).filter((link) =>
    isSponsorVisible(link, now)
  );
}

export function readSponsorDocument({ bypassCache = false } = {}) {
  const now = Date.now();
  if (
    !bypassCache &&
    memoryCache.document &&
    now - memoryCache.loadedAt < FOOTER_SPONSORS_CACHE_TTL_MS
  ) {
    return memoryCache.document;
  }

  const target = filePath();
  try {
    if (!fs.existsSync(target)) {
      const empty = emptyDocument();
      memoryCache = { loadedAt: now, document: empty };
      return empty;
    }
    const parsed = JSON.parse(fs.readFileSync(target, "utf8"));
    const document = normalizeSponsorDocument(parsed);
    memoryCache = { loadedAt: now, document };
    return document;
  } catch {
    const empty = emptyDocument();
    memoryCache = { loadedAt: now, document: empty };
    return empty;
  }
}

export function writeSponsorDocument(raw) {
  const document = normalizeSponsorDocument(raw);
  document.updated_at = new Date().toISOString();

  const target = filePath();
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  memoryCache = { loadedAt: Date.now(), document };
  return document;
}

export function getVisibleSponsors(now = new Date()) {
  const document = readSponsorDocument();
  return filterVisibleSponsors(document.links, now);
}
