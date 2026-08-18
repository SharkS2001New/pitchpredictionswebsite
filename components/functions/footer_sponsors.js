import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  slugifyId as slugifyIdBase,
  normalizeRelTags,
  normalizeGraceDays,
  normalizeSponsorLink,
  normalizeSponsorDocument,
  isSponsorVisible,
  filterVisibleSponsors,
  toPublicSponsorLinks,
  getEmbeddedVisibleSponsors,
} from "./footer_sponsors_core";

export {
  normalizeRelTags,
  normalizeGraceDays,
  normalizeSponsorLink,
  normalizeSponsorDocument,
  isSponsorVisible,
  filterVisibleSponsors,
  toPublicSponsorLinks,
  getEmbeddedVisibleSponsors,
};

export const FOOTER_SPONSORS_RELATIVE_PATH = path.join(
  "public",
  "site-content",
  "footer-sponsors.json"
);

function filePath() {
  return path.join(process.cwd(), FOOTER_SPONSORS_RELATIVE_PATH);
}

function emptyDocument() {
  return {
    updated_at: new Date().toISOString(),
    links: [],
  };
}

export function slugifyId(label, url) {
  const base = slugifyIdBase(label, url);
  if (base !== "link") return base;
  return `link-${crypto.randomBytes(3).toString("hex")}`;
}

let memoryCache = { mtimeMs: null, document: null };

export function readSponsorDocument({ bypassCache = false } = {}) {
  const target = filePath();
  try {
    if (!fs.existsSync(target)) {
      memoryCache = { mtimeMs: null, document: null };
      return emptyDocument();
    }
    const mtimeMs = fs.statSync(target).mtimeMs;
    if (
      !bypassCache &&
      memoryCache.document &&
      memoryCache.mtimeMs === mtimeMs
    ) {
      return memoryCache.document;
    }
    const parsed = JSON.parse(fs.readFileSync(target, "utf8"));
    const document = normalizeSponsorDocument(parsed);
    memoryCache = { mtimeMs, document };
    return document;
  } catch {
    return emptyDocument();
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
  try {
    memoryCache = { mtimeMs: fs.statSync(target).mtimeMs, document };
  } catch {
    memoryCache = { mtimeMs: null, document };
  }
  return document;
}

export function getVisibleSponsors(now = new Date()) {
  const document = readSponsorDocument();
  return filterVisibleSponsors(document.links, now);
}
