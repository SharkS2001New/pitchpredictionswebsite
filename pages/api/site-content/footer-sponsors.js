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
  res.setHeader(
    "Cache-Control",
    "public, max-age=45, s-maxage=45, stale-while-revalidate=30"
  );
}

function setNoStoreHeaders(res) {
  res.setHeader("Cache-Control", "no-store");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const wantAll =
      String(req.query.all || "") === "1" ||
      String(req.query.all || "").toLowerCase() === "true";

    if (wantAll) {
      if (!resolveBlogCacheClearKey()) {
        return res.status(503).json({
          error: `BLOG_CACHE_CLEAR_KEY must be set to exactly ${BLOG_CACHE_CLEAR_KEY_LENGTH} characters`,
        });
      }
      if (!isBlogCacheClearAuthorized(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      setNoStoreHeaders(res);
      const document = readSponsorDocument({ bypassCache: true });
      return res.status(200).json({
        success: true,
        data: document,
      });
    }

    const document = readSponsorDocument();
    const links = filterVisibleSponsors(document.links);
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
        error: `BLOG_CACHE_CLEAR_KEY must be set to exactly ${BLOG_CACHE_CLEAR_KEY_LENGTH} characters`,
      });
    }
    if (!isBlogCacheClearAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
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
