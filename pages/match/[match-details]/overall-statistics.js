import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import MatchSummaryDisplay from "../../../components/matchdetails/match_summary_display";
import PreLoader from "../../../components/includes/loader";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  getAwayTeamId,
  getAwayTeamName,
  getHomeTeamId,
  getHomeTeamName,
  getLeagueName,
  getLeagueType,
  loadMatchPageContext,
} from "../../../components/functions/match_details_helpers";
import { serializeMatchBundleForClient } from "../../../components/functions/details_prefetch";

export async function getServerSideProps(context) {
  const loaded = await loadMatchPageContext(context, {
    tab: "overall-statistics",
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
        initialTrends: [],
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
      initialTrends: bundle.trends,
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchSummaryPage({
  matchSlug,
  fixtureIdInteger,
  loadError,
  initialMatchDetails,
  initialTrends,
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
  const leagueType = getLeagueType(matchDetailsData);
  const leagueName = getLeagueName(matchDetailsData);
  const showStandings = leagueType === "League";

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
        <MatchSummaryDisplay
          match={matchDetailsData}
          trends={initialTrends}
          trendsStatus={initialTrends.length > 0 ? "success" : "error"}
          standings={[]}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          leagueName={leagueName}
          leagueType={leagueType}
        />
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

export default MatchSummaryPage;
