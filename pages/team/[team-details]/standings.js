import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import TeamPageHeader from "../../../components/teamdetails/team-page-header";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  getLeagueType,
  loadTeamPageContext,
  resolveTeamFromFixture,
} from "../../../components/functions/match_details_helpers";
import { serializeTeamBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadTeamPageContext(context);
  if (loaded.notFound) return { notFound: true };
  if (loaded.redirect) return loaded;

  const { slug, teamIdInteger, bundle } = loaded;

  return {
    props: {
      teamSlug: slug,
      teamIdInteger,
      initialTeamsTopData: bundle.teamsTopData,
      initialLast6Matches: bundle.last6Matches,
      initialStandings: bundle.standings,
      teamBundleSnapshot: serializeTeamBundleForClient(bundle),
    },
  };
}

function TeamStandingsPage({
  teamSlug,
  teamIdInteger,
  initialTeamsTopData,
  initialLast6Matches,
  initialStandings,
  teamBundleSnapshot,
}) {
  const router = useRouter();
  const teamsTopData = initialTeamsTopData?.data?.[0] || null;

  if (!teamsTopData) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  const teamContext = resolveTeamFromFixture(teamsTopData, teamIdInteger);
  const leagueType = getLeagueType(teamsTopData);
  const showStandings = leagueType === "League";
  const hasStandings = initialStandings.length > 0;

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
          <span>STANDINGS</span>
        </div>
        {hasStandings ? (
          <DisplayIndependentLeagueStandings
            props={initialStandings}
            home_team_id={teamIdInteger}
            league_name={teamContext.leagueName}
          />
        ) : (
          <>
            <DataNotFoundPage props="No standings data available for this team." />
            <br />
          </>
        )}
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

export default TeamStandingsPage;
