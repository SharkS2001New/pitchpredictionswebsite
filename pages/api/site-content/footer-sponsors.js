import {
  filterVisibleSponsors,
  readSponsorDocument,
  writeSponsorDocument,
} from "../../../components/functions/footer_sponsors";
import {
  BLOG_CACHE_CLEAR_KEY_LENGTH,
  isBlogCacheClearAuthorized,
  resolveBlogCacheClearKey,
} from "../../../components/functions/blog_cache_clear_auth";

function setPublicCacheHeaders(res) {
  // Short cache only — keeps sites fast under traffic while admin updates
  // still appear within ~10–15 seconds (PUT stays no-store).
  res.setHeader(
    "Cache-Control",
    "public, max-age=10, s-maxage=10, stale-while-revalidate=30"
  );
}

function setNoStoreHeaders(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

function publicSponsorPayload(link) {
  return {
    id: link.id,
    label: link.label,
    url: link.url,
    rel: Array.isArray(link.rel) ? link.rel : ["noopener", "noreferrer"],
  };
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const wantAll =
      String(req.query.all || "") === "1" ||
      String(req.query.all || "").toLowerCase() === "true";

    if (wantAll) {
      setNoStoreHeaders(res);
      const document = readSponsorDocument();
      return res.status(200).json({
        success: true,
        data: document,
      });
    }

    const document = readSponsorDocument();
    const links = filterVisibleSponsors(document.links).map(publicSponsorPayload);
    setPublicCacheHeaders(res);
    return res.status(200).json({
      success: true,
      updated_at: document.updated_at,
      links,
    });
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (!resolveBlogCacheClearKey()) {
      return res.status(503).json({
        error: `BLOG_CACHE_CLEAR_KEY must be set to exactly ${BLOG_CACHE_CLEAR_KEY_LENGTH} characters on this host before footer links can be saved.`,
      });
    }
    if (!isBlogCacheClearAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body || "{}");
      } catch {
        return res.status(422).json({
          success: false,
          error: "Invalid JSON body.",
        });
      }
    }
    body = body || {};
    const incoming = body.data && typeof body.data === "object" ? body.data : body;

    if (!Array.isArray(incoming.links)) {
      return res.status(422).json({
        success: false,
        error: "Body must include a links array.",
      });
    }

    try {
      const saved = writeSponsorDocument(incoming);
      setNoStoreHeaders(res);
      return res.status(200).json({
        success: true,
        message: "Footer sponsor links saved.",
        data: saved,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err?.message || "Failed to write footer-sponsors.json",
      });
    }
  }

  res.setHeader("Allow", "GET, PUT, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
