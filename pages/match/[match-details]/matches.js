import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Adsense } from "@ctrl/react-adsense";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import H2HFixturesData from "../../../components/matchdetails/h2h_fixtures";
import Last6Matches from "../../../components/matchdetails/last_6_matches";
import FetchUpcomingMatches from "../../../components/matchdetails/fetch_upcoming_matches";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import PreLoader from "../../../components/includes/loader";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import MatchSummaryDisplay from "../../../components/matchdetails/match_summary_display";
import MatchOddsDisplay from "../../../components/matchdetails/match_odds_display";
import {
  fetchMatchDetailsBundle,
  getAwayTeamName,
  getHomeTeamName,
  getLeagueName,
  getLeagueType,
  parseFixtureIdFromSlug,
} from "../../../components/functions/match_details_helpers";

const VALID_TABS = ["summary", "odds", "matches", "standings", "upcoming"];

export async function getServerSideProps(context) {
  const slug = context.params?.["match-details"] || context.query?.["match-details"];
  const fixtureIdInteger = parseFixtureIdFromSlug(slug);

  if (!fixtureIdInteger) {
    return { redirect: { destination: "/", permanent: false } };
  }

  try {
    const bundle = await fetchMatchDetailsBundle(fixtureIdInteger);

    if (!bundle) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const initialTab = VALID_TABS.includes(context.query.tab)
      ? context.query.tab
      : "summary";

    return {
      props: {
        initialMatchDetails: bundle.matchData,
        fixtureIdInteger,
        initialTab,
        initialH2HMatches: bundle.h2hMatches,
        initialH2HLeagues: bundle.h2hLeagues,
        initialHomeLast6: bundle.homeLast6,
        initialAwayLast6: bundle.awayLast6,
        initialHomeLast6Leagues: bundle.homeLast6Leagues,
        initialAwayLast6Leagues: bundle.awayLast6Leagues,
        initialUpcomingHome: bundle.upcomingHome,
        initialUpcomingAway: bundle.upcomingAway,
        initialStandings: bundle.standings,
        initialTrends: bundle.trends,
      },
    };
  } catch (error) {
    console.error("Error fetching match data:", error);
    return { redirect: { destination: "/", permanent: false } };
  }
}

function MatchDetails({
  initialMatchDetails,
  fixtureIdInteger,
  initialTab,
  initialH2HMatches,
  initialH2HLeagues,
  initialHomeLast6,
  initialAwayLast6,
  initialHomeLast6Leagues,
  initialAwayLast6Leagues,
  initialUpcomingHome,
  initialUpcomingAway,
  initialStandings,
  initialTrends = [],
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(initialMatchDetails?.data[0] || null);

  useEffect(() => {
    if (!router.isReady) return;

    const tabFromQuery = router.query.tab;
    if (VALID_TABS.includes(tabFromQuery) && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [router.isReady, router.query.tab, activeTab]);

  if (!match_details_data) {
    return <PreLoader />;
  }

  const homeTeamName = getHomeTeamName(match_details_data);
  const awayTeamName = getAwayTeamName(match_details_data);
  const homeTeamId =
    match_details_data.home_team?.id ?? match_details_data.home_team_id;
  const awayTeamId =
    match_details_data.away_team?.id ?? match_details_data.away_team_id;
  const fixtureDate =
    match_details_data.match?.unformatted_date ??
    match_details_data.unformated_date ??
    match_details_data.match?.datetime?.slice(0, 10) ??
    null;
  const leagueType = getLeagueType(match_details_data);
  const leagueName = getLeagueName(match_details_data);
  const showStandings =
    leagueType === "League" && initialStandings.length > 0;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div className="sites-card mb-2">
        <MatchDetailsTop
          props={game_details}
          home_team_id={homeTeamId}
          away_team_id={awayTeamId}
          home_team_data={initialHomeLast6}
          away_team_data={initialAwayLast6}
        />
        <div className="border-top"></div>
        <FiltersMatchDetails
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showStandings={showStandings}
        />
      </div>

      {activeTab === "matches" && (
        <>
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
      )}

      {activeTab === "odds" && (
        <div className="sites-card">
          <MatchOddsDisplay
            match={match_details_data}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        </div>
      )}

      {activeTab === "summary" && (
        <div className="sites-card">
          <MatchSummaryDisplay
            match={match_details_data}
            trends={initialTrends}
            trendsStatus={initialTrends.length > 0 ? "success" : "error"}
            standings={initialStandings}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
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
      )}

      {activeTab === "standings" && (
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
      )}

      {activeTab === "upcoming" && (
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
      )}
    </>
  );
}

export default MatchDetails;
