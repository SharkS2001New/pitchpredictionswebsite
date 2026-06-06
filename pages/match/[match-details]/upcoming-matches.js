import { useRouter } from "next/router";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import FetchUpcomingMatches from "../../../components/matchdetails/fetch_upcoming_matches";
import PreLoader from "../../../components/includes/loader";
import {
  getAwayTeamId,
  getAwayTeamName,
  getFixtureDate,
  getHomeTeamId,
  getHomeTeamName,
  getLeagueType,
  loadMatchPageContext,
} from "../../../components/functions/match_details_helpers";
import { serializeMatchBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadMatchPageContext(context);
  if (loaded.redirect) return loaded;
  if (loaded.notFound) return { notFound: true };

  const { slug, fixtureIdInteger, bundle } = loaded;

  return {
    props: {
      matchSlug: slug,
      fixtureIdInteger,
      initialMatchDetails: bundle.matchData,
      initialHomeLast6: bundle.homeLast6,
      initialAwayLast6: bundle.awayLast6,
      initialUpcomingHome: bundle.upcomingHome,
      initialUpcomingAway: bundle.upcomingAway,
      initialStandings: bundle.standings,
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchUpcomingPage({
  matchSlug,
  fixtureIdInteger,
  initialMatchDetails,
  initialHomeLast6,
  initialAwayLast6,
  initialUpcomingHome,
  initialUpcomingAway,
  initialStandings,
  matchBundleSnapshot,
}) {
  const router = useRouter();
  const gameDetails = initialMatchDetails.data || [];
  const matchDetailsData = initialMatchDetails?.data?.[0] || null;

  if (!matchDetailsData) {
    return <PreLoader />;
  }

  const homeTeamName = getHomeTeamName(matchDetailsData);
  const awayTeamName = getAwayTeamName(matchDetailsData);
  const homeTeamId = getHomeTeamId(matchDetailsData);
  const awayTeamId = getAwayTeamId(matchDetailsData);
  const fixtureDate = getFixtureDate(matchDetailsData);
  const leagueType = getLeagueType(matchDetailsData);
  const showStandings =
    leagueType === "League" && initialStandings.length > 0;

  return (
    <>
      <MatchPageHeader
        gameDetails={gameDetails}
        homeTeamId={homeTeamId}
        awayTeamId={awayTeamId}
        homeTeamData={initialHomeLast6}
        awayTeamData={initialAwayLast6}
        matchSlug={matchSlug}
        fixtureIdInteger={fixtureIdInteger}
        urlFilter={router.pathname.substring(1)}
        showStandings={showStandings}
        bundleSnapshot={matchBundleSnapshot}
      />

      <div className="sites-card">
        <FetchUpcomingMatches
          home_team={homeTeamName}
          away_team={awayTeamName}
          home_team_id={homeTeamId}
          away_team_id={awayTeamId}
          fixture_date={fixtureDate}
          initialHomeMatches={initialUpcomingHome}
          initialAwayMatches={initialUpcomingAway}
          homeStatus={initialUpcomingHome.length > 0 ? "success" : "error"}
          awayStatus={initialUpcomingAway.length > 0 ? "success" : "error"}
        />
      </div>
    </>
  );
}

export default MatchUpcomingPage;
