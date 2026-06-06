import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Adsense } from "@ctrl/react-adsense";
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import TeamMatchPredictions from "../../../components/teamdetails/team_match_predictions";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import GamesPlayedByTeam from "../../../components/teamdetails/games_played_by_team";
import FetchUpcomingMatchesByTeam from "../../../components/teamdetails/upcoming_matches_by_team";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import {
  fetchTeamDetailsBundle,
  getLeagueType,
  parseTeamIdFromSlug,
  resolveTeamFromFixture,
} from "../../../components/functions/match_details_helpers";

const VALID_TABS = ["results", "standings", "upcoming", "players"];

export async function getServerSideProps(context) {
  const slug = context.params?.["team-details"] || "";
  const teamIdInteger = parseTeamIdFromSlug(slug);

  if (!teamIdInteger) {
    return { notFound: true };
  }

  const initialTab = VALID_TABS.includes(context.query.tab)
    ? context.query.tab
    : "results";

  try {
    const bundle = await fetchTeamDetailsBundle(teamIdInteger);

    if (!bundle) {
      return { notFound: true };
    }

    return {
      props: {
        initialTeamsTopData: bundle.teamsTopData,
        teamIdInteger,
        initialTab,
        initialLast6Matches: bundle.last6Matches,
        initialHomeMatches: bundle.homeMatches,
        initialAwayMatches: bundle.awayMatches,
        initialLast6Leagues: bundle.last6Leagues,
        initialHomeLeagues: bundle.homeLeagues,
        initialAwayLeagues: bundle.awayLeagues,
        initialStandings: bundle.standings,
        initialFixturesWithPredictions: bundle.upcomingFixtures,
      },
    };
  } catch (error) {
    console.error("SSR fetch error:", error);
    return { notFound: true };
  }
}

function TeamDetails({
  initialTeamsTopData,
  teamIdInteger,
  initialTab,
  initialLast6Matches,
  initialHomeMatches,
  initialAwayMatches,
  initialLast6Leagues,
  initialHomeLeagues,
  initialAwayLeagues,
  initialStandings,
  initialFixturesWithPredictions,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [teams_top_data] = useState(initialTeamsTopData?.data?.[0] || null);
  const [team_last6_matches] = useState(initialLast6Matches);
  const [team_last6_matches_when_home] = useState(initialHomeMatches);
  const [team_last6_matches_when_away] = useState(initialAwayMatches);
  const [team_last6_leagues] = useState(initialLast6Leagues);
  const [team_home_leagues] = useState(initialHomeLeagues);
  const [team_away_leagues] = useState(initialAwayLeagues);
  const [table_standings] = useState(initialStandings);

  useEffect(() => {
    if (!router.isReady) return;

    const tabFromQuery = router.query.tab;
    if (VALID_TABS.includes(tabFromQuery) && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    } else if (!tabFromQuery && activeTab !== "results") {
      setActiveTab("results");
    }
  }, [router.isReady, router.query.tab, activeTab]);

  if (!teams_top_data) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  const todays_date = new Date().toISOString().split("T")[0];
  const teamContext = resolveTeamFromFixture(teams_top_data, teamIdInteger);
  const teamName = teamContext.teamName;
  const fixtureDate = teamContext.fixtureDate || todays_date;
  const leagueType = getLeagueType(teams_top_data);
  const showStandings = leagueType === "League";

  const getMatchStatus = () => {
    if (fixtureDate === todays_date) return "Today's Match";
    if (fixtureDate > todays_date) return "Upcoming Match";
    if (fixtureDate < todays_date) return "Recent Match";
    return "";
  };

  const hasGeneralMatches = team_last6_matches.length > 0;
  const hasHomeMatches = team_last6_matches_when_home.length > 0;
  const hasAwayMatches = team_last6_matches_when_away.length > 0;
  const hasStandings = table_standings.length > 0;
  const hasUpcomingMatches = initialFixturesWithPredictions.length > 0;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    const query = { ...router.query };
    if (tab === "results") {
      delete query.tab;
    } else {
      query.tab = tab;
    }
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return (
    <>
      <div className="sites-card mb-2">
        <TeamDetailsTop
          props={teams_top_data}
          last_6_matches={team_last6_matches}
          team_id={teamIdInteger}
        />
        <div className="border-top"></div>
        <FiltersTeamDetails
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showStandings={showStandings}
        />
      </div>

      {activeTab === "results" && (
        <>
          <div className="sites-card mb-2">
            <div className="row">
              <div className="text-center fw-bold">
                <h2 className="sectionTitle">
                  <b>{getMatchStatus()}</b>
                </h2>
              </div>
            </div>
            <TeamMatchPredictions gamesData={[teams_top_data]} />
          </div>

          <div className="sites-card mb-2">
            <div className="text-center fw-bold sectionTitle">
              <span>RESULTS</span>
            </div>
          {hasGeneralMatches && (
            <GamesPlayedByTeam
              props={team_last6_matches}
              team_id={teamIdInteger}
              filter_date={fixtureDate}
              title={`Games Played By ${teamName || "Team"}`}
              team_name={teamName || ""}
              initialLeagues={team_last6_leagues}
            />
          )}

          {hasHomeMatches && (
            <>
              <br />
              <GamesPlayedByTeam
                props={team_last6_matches_when_home}
                team_id={teamIdInteger}
                filter_date={fixtureDate}
                title="Home Matches"
                team_name={teamName || ""}
                initialLeagues={team_home_leagues}
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
              props={team_last6_matches_when_away}
              team_id={teamIdInteger}
              filter_date={fixtureDate}
              title="Away Matches"
              team_name={teamName || ""}
              initialLeagues={team_away_leagues}
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
      )}

      {activeTab === "standings" && (
        <div className="sites-card mb-2">
          <div className="text-center fw-bold sectionTitle">
            <span>STANDINGS</span>
          </div>
          {hasStandings ? (
            <DisplayIndependentLeagueStandings
              props={table_standings}
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
      )}

      {activeTab === "upcoming" && (
        <div className="sites-card mb-2">
          {hasUpcomingMatches ? (
            <FetchUpcomingMatchesByTeam
              initialFixturesWithPredictions={initialFixturesWithPredictions}
              status="success"
              showHeader
            />
          ) : (
            <>
              <div className="text-center fw-bold sectionTitle">
                <span>UPCOMING MATCHES</span>
              </div>
              <DataNotFoundPage props="No upcoming matches data available." />
            </>
          )}
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

      {activeTab === "players" && (
        <div className="sites-card mb-2">
          <div className="text-center fw-bold sectionTitle">
            <span>PLAYERS</span>
          </div>
          <DataNotFoundPage props="Players data is coming soon." />
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
    </>
  );
}

export default TeamDetails;
