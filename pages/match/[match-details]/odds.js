import { useRouter } from "next/router";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import MatchOddsDisplay from "../../../components/matchdetails/match_odds_display";
import PreLoader from "../../../components/includes/loader";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  getAwayTeamId,
  getAwayTeamName,
  getHomeTeamId,
  getHomeTeamName,
  getLeagueType,
  loadMatchPageContext,
} from "../../../components/functions/match_details_helpers";
import { serializeMatchBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadMatchPageContext(context, { tab: "odds" });
  if (loaded.redirect) return loaded;
  if (loaded.notFound) return { notFound: true };
  if (loaded.softError) {
    return {
      props: {
        matchSlug: loaded.slug,
        fixtureIdInteger: loaded.fixtureIdInteger,
        loadError: loaded.message || "Failed to load match",
        initialMatchDetails: { data: [] },
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
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchOddsPage({
  matchSlug,
  fixtureIdInteger,
  loadError,
  initialMatchDetails,
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
        <MatchOddsDisplay
          match={matchDetailsData}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
        />
      </div>
    </>
  );
}

export default MatchOddsPage;
