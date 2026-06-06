import { useRouter } from "next/router";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import MatchOddsDisplay from "../../../components/matchdetails/match_odds_display";
import PreLoader from "../../../components/includes/loader";
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
      initialStandings: bundle.standings,
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchOddsPage({
  matchSlug,
  fixtureIdInteger,
  initialMatchDetails,
  initialHomeLast6,
  initialAwayLast6,
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
