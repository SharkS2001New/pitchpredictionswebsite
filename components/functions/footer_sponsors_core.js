function parseDateOnly(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function todaySiteDateString(now = new Date()) {
  // Africa/Nairobi is UTC+3 year-round (no DST). Avoid Intl timeZone —
  // Alpine Node images often lack ICU data and return non-ISO dates that
  // break string comparisons and hide every sponsor link.
  const nairobiMs = now.getTime() + 3 * 60 * 60 * 1000;
  return new Date(nairobiMs).toISOString().slice(0, 10);
}

function compareDateStrings(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function addDaysToDateString(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function slugifyId(label, url) {
  const base = String(label || url || "link")
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "link";
}

export function normalizeRelTags(raw) {
  const allowed = new Set(["sponsored", "nofollow", "noopener", "noreferrer"]);
  let tags = [];
  if (typeof raw === "string") {
    tags = raw.split(/[\s,]+/);
  } else if (Array.isArray(raw)) {
    tags = raw;
  }
  const out = [];
  for (const tag of tags) {
    const t = String(tag || "")
      .trim()
      .toLowerCase();
    if (t && allowed.has(t) && !out.includes(t)) out.push(t);
  }
  if (!out.includes("noopener")) out.push("noopener");
  if (!out.includes("noreferrer")) out.push("noreferrer");
  return out;
}

export function normalizeGraceDays(raw) {
  if (raw === null || raw === undefined || raw === "") return 4;
  const days = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(days) || days < 0) return 4;
  if (days > 365) return 365;
  return days;
}

export function normalizeSponsorLink(raw, index = 0) {
  const label = String(raw?.label || "").trim();
  const url = String(raw?.url || "").trim();
  const id =
    String(raw?.id || "").trim() || `${slugifyId(label, url)}-${index + 1}`;

  return {
    id,
    label,
    url,
    starts_at: parseDateOnly(raw?.starts_at),
    expires_at: parseDateOnly(raw?.expires_at),
    notes: String(raw?.notes || "").trim(),
    active: raw?.active === false ? false : true,
    rel: normalizeRelTags(raw?.rel ?? raw?.rel_tags),
    grace_days: normalizeGraceDays(raw?.grace_days),
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
  const today = todaySiteDateString(now);
  if (link.starts_at && compareDateStrings(today, link.starts_at) < 0) return false;
  if (link.expires_at && compareDateStrings(today, link.expires_at) > 0) {
    const graceDays = normalizeGraceDays(link.grace_days);
    const graceEnd = addDaysToDateString(link.expires_at, graceDays);
    if (compareDateStrings(today, graceEnd) > 0) return false;
  }
  return Boolean(link.label && link.url);
}

export function filterVisibleSponsors(links, now = new Date()) {
  return (Array.isArray(links) ? links : []).filter((link) =>
    isSponsorVisible(link, now)
  );
}

export function toPublicSponsorLinks(links, now = new Date()) {
  return filterVisibleSponsors(links, now).map((link) => ({
    id: link.id,
    label: link.label,
    url: link.url,
    rel: Array.isArray(link.rel) && link.rel.length
      ? link.rel
      : ["noopener", "noreferrer"],
  }));
}

export function getEmbeddedVisibleSponsors(rawDocument, now = new Date()) {
  const document = normalizeSponsorDocument(rawDocument);
  return toPublicSponsorLinks(document.links, now);
}
