import { useRouter } from "next/router";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import FetchUpcomingMatches from "../../../components/matchdetails/fetch_upcoming_matches";
import PreLoader from "../../../components/includes/loader";
import DataNotFoundPage from "../../../components/includes/datanotfound";
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
  const loaded = await loadMatchPageContext(context, {
    tab: "upcoming-matches",
  });
  if (loaded.redirect) return loaded;
  if (loaded.notFound) return { notFound: true };
  if (loaded.softError) {
    return {
      props: {
        matchSlug: loaded.slug,
        fixtureIdInteger: loaded.fixtureIdInteger,
        loadError: loaded.message || "Failed to load match",
        initialMatchDetails: { data: [] },
        initialUpcomingHome: [],
        initialUpcomingAway: [],
        matchBundleSnapshot: null,
      },
    };
  }

  const { slug, fixtureIdInteger, bundle } = loaded;

  return {
    props: {
      matchSlug: slug,
      fixtureIdInteger,
      loadError: null,
      initialMatchDetails: bundle.matchData,
      initialUpcomingHome: bundle.upcomingHome,
      initialUpcomingAway: bundle.upcomingAway,
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchUpcomingPage({
  matchSlug,
  fixtureIdInteger,
  loadError,
  initialMatchDetails,
  initialUpcomingHome,
  initialUpcomingAway,
  matchBundleSnapshot,
}) {
  const router = useRouter();
  const gameDetails = initialMatchDetails?.data || [];
  const matchDetailsData = initialMatchDetails?.data?.[0] || null;

  if (loadError) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Match details are temporarily unavailable. Please try again shortly." />
      </div>
    );
  }

  if (!matchDetailsData) {
    return <PreLoader />;
  }

  const homeTeamName = getHomeTeamName(matchDetailsData);
  const awayTeamName = getAwayTeamName(matchDetailsData);
  const homeTeamId = getHomeTeamId(matchDetailsData);
  const awayTeamId = getAwayTeamId(matchDetailsData);
  const fixtureDate = getFixtureDate(matchDetailsData);
  const showStandings = getLeagueType(matchDetailsData) === "League";

  return (
    <>
      <MatchPageHeader
        gameDetails={gameDetails}
        homeTeamId={homeTeamId}
        awayTeamId={awayTeamId}
        homeTeamData={[]}
        awayTeamData={[]}
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
