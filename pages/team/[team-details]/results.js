import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import TeamMatchPredictions from "../../../components/teamdetails/team_match_predictions";
import GamesPlayedByTeam from "../../../components/teamdetails/games_played_by_team";
import TeamPageHeader from "../../../components/teamdetails/team-page-header";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  getLeagueType,
  loadTeamPageContext,
  resolveTeamFromFixture,
} from "../../../components/functions/match_details_helpers";
import { serializeTeamBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadTeamPageContext(context, { tab: "results" });
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
        initialHomeMatches: [],
        initialAwayMatches: [],
        initialLast6Leagues: [],
        initialHomeLeagues: [],
        initialAwayLeagues: [],
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
      initialHomeMatches: bundle.homeMatches,
      initialAwayMatches: bundle.awayMatches,
      initialLast6Leagues: bundle.last6Leagues,
      initialHomeLeagues: bundle.homeLeagues,
      initialAwayLeagues: bundle.awayLeagues,
      teamBundleSnapshot: serializeTeamBundleForClient(bundle),
    },
  };
}

function TeamResultsPage({
  teamSlug,
  teamIdInteger,
  loadError,
  initialTeamsTopData,
  initialLast6Matches,
  initialHomeMatches,
  initialAwayMatches,
  initialLast6Leagues,
  initialHomeLeagues,
  initialAwayLeagues,
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

  const todaysDate = new Date().toISOString().split("T")[0];
  const teamContext = resolveTeamFromFixture(teamsTopData, teamIdInteger);
  const teamName = teamContext.teamName;
  const fixtureDate = teamContext.fixtureDate || todaysDate;
  const leagueType = getLeagueType(teamsTopData);
  const showStandings = leagueType === "League";

  const getMatchStatus = () => {
    if (fixtureDate === todaysDate) return "Today's Match";
    if (fixtureDate > todaysDate) return "Upcoming Match";
    if (fixtureDate < todaysDate) return "Recent Match";
    return "";
  };

  const hasGeneralMatches = initialLast6Matches.length > 0;
  const hasHomeMatches = initialHomeMatches.length > 0;
  const hasAwayMatches = initialAwayMatches.length > 0;

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
        <div className="row">
          <div className="text-center fw-bold">
            <h2 className="sectionTitle">
              <b>{getMatchStatus()}</b>
            </h2>
          </div>
        </div>
        <TeamMatchPredictions gamesData={[teamsTopData]} />
      </div>

      <div className="sites-card mb-2">
        <div className="text-center fw-bold sectionTitle">
          <span>RESULTS</span>
        </div>
        {hasGeneralMatches && (
          <GamesPlayedByTeam
            props={initialLast6Matches}
            team_id={teamIdInteger}
            filter_date={fixtureDate}
            title={`Games Played By ${teamName || "Team"}`}
            team_name={teamName || ""}
            initialLeagues={initialLast6Leagues}
          />
        )}

        {hasHomeMatches && (
          <>
            <br />
            <GamesPlayedByTeam
              props={initialHomeMatches}
              team_id={teamIdInteger}
              filter_date={fixtureDate}
              title="Home Matches"
              team_name={teamName || ""}
              initialLeagues={initialHomeLeagues}
            />
          </>
        )}

        {hasHomeMatches && hasAwayMatches && (
          <>
            <br />
            <Adsense
              client="ca-pub-5665711413000284"
              slot="3850951453"
              style={{ display: "block" }}
              layout="display"
              format="auto"
            />
            <br />
          </>
        )}

        {hasAwayMatches && (
          <GamesPlayedByTeam
            props={initialAwayMatches}
            team_id={teamIdInteger}
            filter_date={fixtureDate}
            title="Away Matches"
            team_name={teamName || ""}
            initialLeagues={initialAwayLeagues}
          />
        )}

        {!hasGeneralMatches && !hasHomeMatches && !hasAwayMatches && (
          <>
            <DataNotFoundPage props="No match data available for this team." />
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

export default TeamResultsPage;
