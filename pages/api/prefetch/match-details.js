import {
  fetchMatchDetailsBundleCached,
} from "../../../components/functions/match_details_helpers";
import { serializeMatchBundleForClient } from "../../../components/functions/details_prefetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fixtureId = parseInt(req.query.fixtureId, 10);
  if (!fixtureId || Number.isNaN(fixtureId)) {
    return res.status(400).json({ error: "Invalid fixtureId" });
  }

  const sectionsParam = String(req.query.sections || "all");
  const sections = sectionsParam.split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const bundle = await fetchMatchDetailsBundleCached(fixtureId, { sections });
    if (!bundle) {
      // True missing fixture — not a transient API failure.
      return res.status(404).json({ error: "Match not found" });
    }

    res.setHeader("Cache-Control", "private, max-age=30");
    return res.status(200).json({
      bundle: serializeMatchBundleForClient(bundle),
    });
  } catch (error) {
    console.error("Prefetch match details error:", error);
    // Transient failure — 503, not 404.
    return res.status(503).json({ error: "Failed to prefetch match details" });
  }
}
