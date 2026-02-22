import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import SelectedMacthesPredDetails from "../../../components/shared/selected_matches_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import fetchTeamsMatchesWhenHome from "../../../components/teamdetails/functions/fetch_teams_matches_when_home";
import fetchTeamsMatchesWhenAway from "../../../components/teamdetails/functions/fetch_teams_matches_when_away";
import GamesPlayedByTeam from "../../../components/teamdetails/games_played_by_team";
import { Adsense } from "@ctrl/react-adsense";

function Teams({ initialTeamsTopData, initialLast6Matches, teamIdInteger }) {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  
  // SSR data - available immediately
  const [teams_top_data, setTeamsTopData] = useState(
    initialTeamsTopData?.data?.[0] || null
  );
  
  const [team_last6_matches, setTeamLast6Matches] = useState(
    initialLast6Matches?.data || []
  );
  
  // Secondary data - will load later
  const [team_last6_matches_when_home, setTeamLast6MatchesHome] = useState([]);
  const [team_last6_matches_when_away, setTeamLast6MatchesAway] = useState([]);
  
  const [endpointStatus1, setEndPointStatus1] = useState("");
  const [endpointStatus2, setEndPointStatus2] = useState("");
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(true);

  // If no team data from SSR, show not found
  if (!teams_top_data) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  // client-side fetch for home/away matches (runs after page loads)
  useEffect(() => {
    const fetchSecondaryData = async () => {
      setIsLoadingSecondary(true);
      
      try {
        const [homeRes, awayRes] = await Promise.all([
          fetchTeamsMatchesWhenHome(teamIdInteger, teams_top_data.unformated_date),
          fetchTeamsMatchesWhenAway(teamIdInteger, teams_top_data.unformated_date)
        ]);

        // Process home matches
        if (homeRes?.status === true) {
          setEndPointStatus1("success");
          setTeamLast6MatchesHome(homeRes.data || []);
        } else {
          setEndPointStatus1(homeRes?.message === "No data found" ? "no_data" : "error");
          setTeamLast6MatchesHome([]);
        }

        // Process away matches
        if (awayRes?.status === true) {
          setEndPointStatus2("success");
          setTeamLast6MatchesAway(awayRes.data || []);
        } else {
          setEndPointStatus2(awayRes?.message === "No data found" ? "no_data" : "error");
          setTeamLast6MatchesAway([]);
        }
      } catch (error) {
        console.error('Error fetching secondary data:', error);
        setEndPointStatus1("error");
        setEndPointStatus2("error");
      } finally {
        setIsLoadingSecondary(false);
      }
    };

    // Initial mobile detection
    setIsMobile(window.innerWidth < 760);
    
    fetchSecondaryData();
  }, [teamIdInteger, teams_top_data]); // Only runs once on mount and if these deps change

  // detect mobile screen on resize
  useEffect(() => {
    const detectWindowSize = () => {
      setIsMobile(window.innerWidth < 760);
    };
    
    window.addEventListener("resize", detectWindowSize);
    return () => window.removeEventListener("resize", detectWindowSize);
  }, []);

  const todays_date = new Date().toISOString().split("T")[0];
  
  // Determine match status
  const getMatchStatus = () => {
    if (teams_top_data.unformated_date === todays_date) return "Today's Match";
    if (teams_top_data.unformated_date > todays_date) return "Upcoming Match";
    if (teams_top_data.unformated_date < todays_date) return "Recent Match";
    return "";
  };

  // Determine which team we're viewing
  const isHomeTeam = teams_top_data.home_team_id === teamIdInteger;
  const teamName = isHomeTeam ? teams_top_data.home_team_name : teams_top_data.away_team_name;

  // Prepare predictions renderer
  const renderPredictions = <SelectedMacthesPredDetails props={[teams_top_data]} />;

  // Form dynamic URL
  const url_name = encodeURIComponent(
    teamName.replace(/\s+/g, "-").toLowerCase() + "-" + teamIdInteger
  );

  // Check data availability for secondary content
  const hasGeneralMatches = team_last6_matches.length > 0;
  const hasHomeMatches = team_last6_matches_when_home.length > 0;
  const hasAwayMatches = team_last6_matches_when_away.length > 0;
  const hasError = endpointStatus1 === "error" || endpointStatus2 === "error";

  return (
    <>
      {/* ===== SSR CONTENT - LOADS IMMEDIATELY ===== */}
      <div className="sites-card mb-2">
        <TeamDetailsTop
          props={teams_top_data}
          last_6_matches={team_last6_matches}
          team_id={teamIdInteger}
        />
        <div className="row">
          <div className="text-center fw-bold">
            <h2 className="sectionTitle">
              <b>{getMatchStatus()}</b>
            </h2>
          </div>
        </div>
        <RenderData renderPredictions={renderPredictions} isMobile={isMobile} />
        <FiltersTeamDetails
          url_filter={router.pathname.substring(1)}
          match_url={url_name}
          league_type={teams_top_data.league_type}
        />
      </div>

      {/* ===== CLIENT-SIDE CONTENT - LOADS AFTER ===== */}
      <div className="sites-card">
        {/* Show loading skeleton while fetching secondary data */}
        {isLoadingSecondary ? (
          <PreLoader/>
        ) : (
          <>
            {/* All Matches (combined home/away) */}
            {hasGeneralMatches && (
              <GamesPlayedByTeam
                props={team_last6_matches}
                team_id={teamIdInteger}
                filter_date={teams_top_data.unformated_date}
                title={`Games Played By ${teamName}`}
                team_name={teamName}
              />
            )}

            {/* Home Matches */}
            {hasHomeMatches && (
              <>
                <br />
                <GamesPlayedByTeam
                  props={team_last6_matches_when_home}
                  team_id={teamIdInteger}
                  filter_date={teams_top_data.unformated_date}
                  title="Home Matches"
                  team_name={teamName}
                />
              </>
            )}

            {/* AdSense between home and away */}
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

            {/* Away Matches */}
            {hasAwayMatches && (
              <>
                <GamesPlayedByTeam
                  props={team_last6_matches_when_away}
                  team_id={teamIdInteger}
                  filter_date={teams_top_data.unformated_date}
                  title="Away Matches"
                  team_name={teamName}
                />
              </>
            )}

            {/* Show error/no data message if applicable */}
            {hasError && (
              <>
                <DataNotFoundPage props="Unable to load some match data. Please try again later." />
                <br />
              </>
            )}

            {/* Show message if no data at all */}
            {!isLoadingSecondary && 
             !hasGeneralMatches && 
             !hasHomeMatches && 
             !hasAwayMatches && 
             !hasError && (
              <>
                <DataNotFoundPage props="No match data available for this team." />
                <br />
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom AdSense */}
      <div className="sites-card">
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

export default Teams;

// =====================================================
// ✅ SERVER SIDE
// =====================================================

export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params?.["team-details"] || "";
  
  // Extract team ID
  const teamIdInteger = parseInt(slug.split("-").pop(), 10);

  if (isNaN(teamIdInteger) || teamIdInteger <= 0) {
    return { notFound: true };
  }

  try {
    // Fetch Top Team Data
    const topRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id=${teamIdInteger}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
        },
      }
    );

    if (!topRes.ok) {
      throw new Error(`API responded with status: ${topRes.status}`);
    }

    const initialTeamsTopData = await topRes.json();

    if (!initialTeamsTopData?.status || !initialTeamsTopData?.data?.length) {
      return { notFound: true };
    }

    // Fetch last 6 matches
    const matchesRes = await fetch(
      "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
        },
        body: JSON.stringify({
          team_id: teamIdInteger,
          fixture_date: initialTeamsTopData.data[0].unformated_date,
        }),
      }
    );

    let initialLast6Matches = { data: [] };
    
    if (matchesRes.ok) {
      initialLast6Matches = await matchesRes.json();
    }

    return {
      props: {
        initialTeamsTopData,
        initialLast6Matches: initialLast6Matches || { data: [] },
        teamIdInteger,
      },
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return { notFound: true };
  }
}