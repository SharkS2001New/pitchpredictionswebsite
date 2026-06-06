import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import H2HFixturesData from "../../../components/matchdetails/h2h_fixtures";
import Last6Matches from "../../../components/matchdetails/last_6_matches";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
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
      initialH2HMatches: bundle.h2hMatches,
      initialH2HLeagues: bundle.h2hLeagues,
      initialHomeLast6: bundle.homeLast6,
      initialAwayLast6: bundle.awayLast6,
      initialHomeLast6Leagues: bundle.homeLast6Leagues,
      initialAwayLast6Leagues: bundle.awayLast6Leagues,
      initialStandings: bundle.standings,
      matchBundleSnapshot: serializeMatchBundleForClient(bundle),
    },
  };
}

function MatchHistoryPage({
  matchSlug,
  fixtureIdInteger,
  initialMatchDetails,
  initialH2HMatches,
  initialH2HLeagues,
  initialHomeLast6,
  initialAwayLast6,
  initialHomeLast6Leagues,
  initialAwayLast6Leagues,
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

      <H2HFixturesData
        home_team_id={homeTeamId}
        away_team_id={awayTeamId}
        fixture_date={fixtureDate}
        initialH2HMatches={initialH2HMatches}
        initialH2HLeagues={initialH2HLeagues}
      />

      {(initialHomeLast6.length > 0 || initialAwayLast6.length > 0) && (
        <div className="sites-card">
          <Last6Matches
            home_team={homeTeamName}
            away_team={awayTeamName}
            home_team_id={homeTeamId}
            away_team_id={awayTeamId}
            fixture_date={fixtureDate}
            home_team_data={initialHomeLast6}
            away_team_data={initialAwayLast6}
            initialHomeLeagues={initialHomeLast6Leagues}
            initialAwayLeagues={initialAwayLast6Leagues}
          />
        </div>
      )}
    </>
  );
}

export default MatchHistoryPage;
