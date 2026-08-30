import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import TeamPageHeader from "../../../components/teamdetails/team-page-header";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  getLeagueType,
  loadTeamPageContext,
} from "../../../components/functions/match_details_helpers";
import { serializeTeamBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadTeamPageContext(context, { tab: "players" });
  if (loaded.notFound) return { notFound: true };
  if (loaded.redirect) return loaded;
  if (loaded.softError) {
    return {
      props: {
        teamSlug: loaded.slug,
        teamIdInteger: loaded.teamIdInteger,
        loadError: loaded.message || "Failed to load team",
        initialTeamsTopData: { data: [] },
        initialLast6Matches: [],
        teamBundleSnapshot: null,
      },
    };
  }

  const { slug, teamIdInteger, bundle } = loaded;

  return {
    props: {
      teamSlug: slug,
      teamIdInteger,
      loadError: null,
      initialTeamsTopData: bundle.teamsTopData,
      initialLast6Matches: bundle.last6Matches,
      teamBundleSnapshot: serializeTeamBundleForClient(bundle),
    },
  };
}

function TeamPlayersPage({
  teamSlug,
  teamIdInteger,
  loadError,
  initialTeamsTopData,
  initialLast6Matches,
  teamBundleSnapshot,
}) {
  const router = useRouter();
  const teamsTopData = initialTeamsTopData?.data?.[0] || null;

  if (loadError) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details are temporarily unavailable. Please try again shortly." />
      </div>
    );
  }

  if (!teamsTopData) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  const leagueType = getLeagueType(teamsTopData);
  const showStandings = leagueType === "League";

  return (
    <>
      <TeamPageHeader
        teamsTopData={teamsTopData}
        teamIdInteger={teamIdInteger}
        last6Matches={initialLast6Matches}
        teamSlug={teamSlug}
        urlFilter={router.pathname.substring(1)}
        showStandings={showStandings}
        bundleSnapshot={teamBundleSnapshot}
      />

      <div className="sites-card mb-2">
        <div className="text-center fw-bold sectionTitle">
          <span>PLAYERS</span>
        </div>
        <DataNotFoundPage props="Players data is coming soon." />
        <br />
        <Adsense
          client="ca-pub-5665711413000284"
          slot="7856848919"
          style={{ display: "block" }}
          layout="display"
          format="auto"
        />
      </div>
    </>
  );
}

export default TeamPlayersPage;
