// pages/team/[team-details]/results.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import SelectedMacthesPredDetails from "../../../components/shared/selected_matches_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import GamesPlayedByTeam from "../../../components/teamdetails/games_played_by_team";
import { Adsense } from "@ctrl/react-adsense";

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

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
  };

  try {
    // Fetch Top Team Data (required - blocks response)
    const topRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id=${teamIdInteger}`,
      { headers }
    );

    if (!topRes.ok) {
      throw new Error(`API responded with status: ${topRes.status}`);
    }

    const initialTeamsTopData = await topRes.json();

    if (!initialTeamsTopData?.status || !initialTeamsTopData?.data?.length) {
      return { notFound: true };
    }

    const teamData = initialTeamsTopData.data[0];
    
    // 🚀 Fetch ALL secondary data in parallel
    const [
      last6Res,
      homeMatchesRes,
      awayMatchesRes,
      last6LeaguesRes,
      homeLeaguesRes,
      awayLeaguesRes
    ] = await Promise.allSettled([
      // Last 6 matches (both sides)
      fetch("https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides", {
        method: "POST",
        headers,
        body: JSON.stringify({
          team_id: teamIdInteger,
          fixture_date: teamData.unformated_date,
        }),
      }).then(res => res.json()),
      
      // Home matches
      fetch("https://api.pitchpredictions.com/api/fetch_teams_matches_when_home", {
        method: "POST",
        headers,
        body: JSON.stringify({
          team_id: teamIdInteger,
          fixture_date: teamData.unformated_date,
        }),
      }).then(res => res.json()),
      
      // Away matches
      fetch("https://api.pitchpredictions.com/api/fetch_teams_matches_when_away", {
        method: "POST",
        headers,
        body: JSON.stringify({
          team_id: teamIdInteger,
          fixture_date: teamData.unformated_date,
        }),
      }).then(res => res.json()),
      
      // Last 6 matches leagues (for filtering)
      fetch("https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues", {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          home_team_id: teamIdInteger, 
          fixture_date: teamData.unformated_date 
        }),
      }).then(res => res.json()),
      
      // Home matches leagues (for filtering)
      fetch("https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues", {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          home_team_id: teamIdInteger, 
          fixture_date: teamData.unformated_date 
        }),
      }).then(res => res.json()),
      
      // Away matches leagues (for filtering)
      fetch("https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues", {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          home_team_id: teamIdInteger, 
          fixture_date: teamData.unformated_date 
        }),
      }).then(res => res.json())
    ]);

    // Process last 6 matches
    let last6Data = [];
    if (last6Res.status === 'fulfilled' && last6Res.value?.status === true) {
      last6Data = last6Res.value.data || [];
    }

    // Process home matches
    let homeMatchesData = [];
    if (homeMatchesRes.status === 'fulfilled' && homeMatchesRes.value?.status === true) {
      homeMatchesData = homeMatchesRes.value.data || [];
    }

    // Process away matches
    let awayMatchesData = [];
    if (awayMatchesRes.status === 'fulfilled' && awayMatchesRes.value?.status === true) {
      awayMatchesData = awayMatchesRes.value.data || [];
    }

    // Process last 6 leagues
    let last6LeaguesData = [];
    if (last6LeaguesRes.status === 'fulfilled' && last6LeaguesRes.value?.status === true) {
      last6LeaguesData = last6LeaguesRes.value.data || [];
    }

    // Process home leagues
    let homeLeaguesData = [];
    if (homeLeaguesRes.status === 'fulfilled' && homeLeaguesRes.value?.status === true) {
      homeLeaguesData = homeLeaguesRes.value.data || [];
    }

    // Process away leagues
    let awayLeaguesData = [];
    if (awayLeaguesRes.status === 'fulfilled' && awayLeaguesRes.value?.status === true) {
      awayLeaguesData = awayLeaguesRes.value.data || [];
    }

    return {
      props: {
        initialTeamsTopData,
        teamIdInteger,
        initialLast6Matches: last6Data,
        initialHomeMatches: homeMatchesData,
        initialAwayMatches: awayMatchesData,
        initialLast6Leagues: last6LeaguesData,
        initialHomeLeagues: homeLeaguesData,
        initialAwayLeagues: awayLeaguesData,
      },
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return { notFound: true };
  }
}

// =====================================================
// ✅ COMPONENT
// =====================================================

function Teams({ 
  initialTeamsTopData, 
  teamIdInteger,
  initialLast6Matches = [],
  initialHomeMatches = [],
  initialAwayMatches = [],
  initialLast6Leagues = [],
  initialHomeLeagues = [],
  initialAwayLeagues = []
}) {
  const router = useRouter();
  
  // SSR data - available immediately
  const [teams_top_data] = useState(initialTeamsTopData?.data?.[0] || null);
  
  // Data is already available from props - no loading state needed
  const [team_last6_matches] = useState(initialLast6Matches);
  const [team_last6_matches_when_home] = useState(initialHomeMatches);
  const [team_last6_matches_when_away] = useState(initialAwayMatches);
  const [team_last6_leagues] = useState(initialLast6Leagues);
  const [team_home_leagues] = useState(initialHomeLeagues);
  const [team_away_leagues] = useState(initialAwayLeagues);

  // If no team data from SSR, show not found
  if (!teams_top_data) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  const todays_date = new Date().toISOString().split("T")[0];
  
  // Determine match status
  const getMatchStatus = () => {
    if (teams_top_data.unformated_date === todays_date) return "Today's Match";
    if (teams_top_data.unformated_date > todays_date) return "Upcoming Match";
    if (teams_top_data.unformated_date < todays_date) return "Recent Match";
    return "";
  };

  // Determine which team we're viewing with safety checks
  const isHomeTeam = teams_top_data.home_team_id === teamIdInteger;
  let teamName = "";
  
  if (isHomeTeam) {
    teamName = teams_top_data.home_team_name || "";
  } else {
    teamName = teams_top_data.away_team_name || "";
  }

  // Prepare predictions data - wrap in array for SelectedMacthesPredDetails
  const predictionsData = [teams_top_data];
  
  // Render predictions using the component
  const renderPredictions = <SelectedMacthesPredDetails props={predictionsData} />;

  // Form dynamic URL with safety check
  let url_name = "";
  if (teamName) {
    url_name = encodeURIComponent(
      teamName.replace(/\s+/g, "-").toLowerCase() + "-" + teamIdInteger
    );
  } else {
    url_name = `team-${teamIdInteger}`;
  }

  // Check data availability
  const hasGeneralMatches = team_last6_matches.length > 0;
  const hasHomeMatches = team_last6_matches_when_home.length > 0;
  const hasAwayMatches = team_last6_matches_when_away.length > 0;

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
        
        {/* RenderData expects an array of components from SelectedMacthesPredDetails */}
        <RenderData renderPredictions={renderPredictions?.props ? [renderPredictions] : []} />
        
        <FiltersTeamDetails
          url_filter={router.pathname.substring(1)}
          match_url={url_name}
          league_type={teams_top_data.league_type || ""}
        />
      </div>

      {/* ===== GAMES PLAYED CONTENT - ALL SERVER RENDERED ===== */}
      <div className="sites-card">
        {/* All Matches (combined home/away) */}
        {hasGeneralMatches && (
          <GamesPlayedByTeam
            props={team_last6_matches}
            team_id={teamIdInteger}
            filter_date={teams_top_data.unformated_date}
            title={`Games Played By ${teamName || "Team"}`}
            team_name={teamName || ""}
            initialLeagues={team_last6_leagues}
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
              team_name={teamName || ""}
              initialLeagues={team_home_leagues}
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
              team_name={teamName || ""}
              initialLeagues={team_away_leagues}
            />
          </>
        )}

        {/* Show message if no data at all */}
        {!hasGeneralMatches && !hasHomeMatches && !hasAwayMatches && (
          <>
            <DataNotFoundPage props="No match data available for this team." />
            <br />
          </>
        )}

        {/* Bottom AdSense */}
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