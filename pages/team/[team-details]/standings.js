// pages/team/[team-details]/standings.js (or wherever this component is)
import React, { useState } from "react";
import { useRouter } from "next/router";
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import SelectedMacthesPredDetails from "../../../components/shared/selected_matches_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import { Adsense } from "@ctrl/react-adsense";

// =====================================================
// ✅ SERVER SIDE
// =====================================================
export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params?.["team-details"] || "";
  
  // Extract team ID from slug (e.g., "everton-45" -> 45)
  const teamIdInteger = parseInt(slug.split("-").pop(), 10);

  // Validate team ID
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
      { headers, signal: AbortSignal.timeout(5000) }
    );

    if (!topRes.ok) {
      throw new Error(`API responded with status: ${topRes.status}`);
    }

    const initialTeamsTopData = await topRes.json();

    if (!initialTeamsTopData?.status || !initialTeamsTopData?.data?.length) {
      return { notFound: true };
    }

    const teamData = initialTeamsTopData.data[0];
    
    // 🚀 Fetch last 6 matches and standings in parallel
    const [last6Res, standingsRes] = await Promise.allSettled([
      // Last 6 matches
      fetch("https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides", {
        method: "POST",
        headers,
        body: JSON.stringify({
          team_id: teamIdInteger,
          fixture_date: teamData.unformated_date,
        }),
      }).then(res => res.json()),
      
      // Standings
      fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          league_id: teamData.league_id,
        }),
      }).then(res => res.json())
    ]);

    // Process last 6 matches
    let last6Data = [];
    if (last6Res.status === 'fulfilled' && last6Res.value?.status === true) {
      last6Data = last6Res.value.data || [];
    }

    // Process standings
    let standingsData = [];
    let standingsStatus = "error";
    if (standingsRes.status === 'fulfilled' && standingsRes.value?.status === true) {
      standingsData = standingsRes.value.data?.[0]?.standings_data || [];
      standingsStatus = "success";
    }

    return {
      props: {
        initialTeamsTopData,
        teamIdInteger,
        initialLast6Matches: last6Data,
        initialStandings: standingsData,
        standingsStatus,
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
  initialStandings = [],
  standingsStatus = "error"
}) {
  const router = useRouter();
  
  // SSR data - available immediately
  const [teams_top_data] = useState(initialTeamsTopData?.data || []);
  const [team_last6_matches] = useState(initialLast6Matches);
  const [table_standings] = useState(initialStandings);

  // If no team data from SSR, show not found
  if (!teams_top_data.length) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="Team details not found." />
      </div>
    );
  }

  const todays_date = new Date().toISOString().split("T")[0];
  const teamData = teams_top_data[0];

  // Determine match status
  const getMatchStatus = () => {
    if (teamData.unformated_date === todays_date) return "Today's Match";
    if (teamData.unformated_date > todays_date) return "Upcoming Match";
    if (teamData.unformated_date < todays_date) return "Recent Match";
    return "";
  };

  // Determine which team we're viewing
  const isHomeTeam = teamData.home_team_id === teamIdInteger;
  const teamName = isHomeTeam ? teamData.home_team_name : teamData.away_team_name;

  // Prepare predictions renderer
  const renderPredictions = <SelectedMacthesPredDetails props={teams_top_data} />;

  // Form dynamic URL
  const url_name = encodeURIComponent(
    teamName.replace(/\s+/g, '-').toLowerCase() + '-' + teamIdInteger
  );

  // Check data availability
  const hasStandings = table_standings.length > 0;
  const hasGeneralMatches = team_last6_matches.length > 0;
  const hasError = standingsStatus === "error" && !hasStandings;

  // Error state
  if (hasError) {
    return (
      <>
        <div className="sites-card mb-2">
          <TeamDetailsTop 
            props={teamData} 
            last_6_matches={team_last6_matches} 
            team_id={teamIdInteger}
          />
          <div className="row">
            <div className="text-center fw-bold">
              <h6><b>{getMatchStatus()}</b></h6>
            </div>
          </div>
          <RenderData renderPredictions={renderPredictions} />
          <FiltersTeamDetails 
            url_filter={router.pathname.substring(1)} 
            match_url={url_name} 
            league_type={teamData.league_type}
          />
        </div>
        <div className="sites-card">
          <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
          <br />
          <Adsense
            client="ca-pub-5665711413000284"
            slot="7856848919"
            style={{ display: "block" }}
            layout="display"
            format="auto"
          />
          <br />
        </div>
      </>
    );
  }

  // No standings data state
  if (!hasStandings) {
    return (
      <>
        <div className="sites-card mb-2">
          <TeamDetailsTop 
            props={teamData} 
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
          <RenderData renderPredictions={renderPredictions} />
          <FiltersTeamDetails 
            url_filter={router.pathname.substring(1)} 
            match_url={url_name} 
            league_type={teamData.league_type}
          />
        </div>
        <div className="sites-card">
          <DataNotFoundPage props="No standings data available for this team." />
          <br />
          <Adsense
            client="ca-pub-5665711413000284"
            slot="7856848919"
            style={{ display: "block" }}
            layout="display"
            format="auto"
          />
          <br />
        </div>
      </>
    );
  }

  // Success state
  return (
    <>
      {/* SSR Content - Always visible immediately */}
      <div className="sites-card mb-2">
        <TeamDetailsTop 
          props={teamData} 
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
        <RenderData renderPredictions={renderPredictions} />
        <FiltersTeamDetails 
          url_filter={router.pathname.substring(1)} 
          match_url={url_name} 
          league_type={teamData.league_type}
        />
      </div>

      {/* League Standings - Server rendered */}
      <div className="sites-card">
        <DisplayIndependentLeagueStandings 
          props={table_standings} 
          home_team_id={teamIdInteger} 
          league_name={teamData.league_name} 
        />
        
        {/* AdSense at the bottom */}
        <br />
        <Adsense
          client="ca-pub-5665711413000284"
          slot="7856848919"
          style={{ display: "block" }}
          layout="display"
          format="auto"
        />
        <br />
      </div>
    </>
  );
}

export default Teams;