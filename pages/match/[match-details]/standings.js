import { useRouter } from "next/router";
import { Adsense } from "@/components/shared/client-adsense";
import MatchPageHeader from "../../../components/matchdetails/match-page-header";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import PreLoader from "../../../components/includes/loader";
import {
  getAwayTeamId,
  getHomeTeamId,
  getLeagueName,
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

function MatchStandingsPage({
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

  const homeTeamId = getHomeTeamId(matchDetailsData);
  const awayTeamId = getAwayTeamId(matchDetailsData);
  const leagueType = getLeagueType(matchDetailsData);
  const leagueName = getLeagueName(matchDetailsData);
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
        {initialStandings.length === 0 ? (
          <>
            <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
            <br />
            <Adsense
              client="ca-pub-5665711413000284"
              slot="7856848919"
              style={{ display: "block" }}
              layout="display"
              format="auto"
            />
          </>
        ) : (
          <DisplayIndependentLeagueStandings
            props={initialStandings}
            league_name={leagueName}
            home_team_id={homeTeamId}
            away_team_id={awayTeamId}
          />
        )}
      </div>
    </>
  );
}

export default MatchStandingsPage;
