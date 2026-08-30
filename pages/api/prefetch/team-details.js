import {
  fetchTeamDetailsBundleCached,
} from "../../../components/functions/match_details_helpers";
import { serializeTeamBundleForClient } from "../../../components/functions/details_prefetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const teamId = parseInt(req.query.teamId, 10);
  if (!teamId || Number.isNaN(teamId)) {
    return res.status(400).json({ error: "Invalid teamId" });
  }

  const sectionsParam = String(req.query.sections || "all");
  const sections = sectionsParam.split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const bundle = await fetchTeamDetailsBundleCached(teamId, { sections });
    if (!bundle) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.setHeader("Cache-Control", "private, max-age=30");
    return res.status(200).json({
      bundle: serializeTeamBundleForClient(bundle),
    });
  } catch (error) {
    console.error("Prefetch team details error:", error);
    return res.status(503).json({ error: "Failed to prefetch team details" });
  }
}
