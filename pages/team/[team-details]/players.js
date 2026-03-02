import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import SelectedMacthesPredDetails from "../../../components/shared/selected_matches_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import fetchTeamsLast6Matches from "../../../components/teamdetails/functions/fetch_last_6_matches";
import { Adsense } from "@ctrl/react-adsense";

// =====================================================
// ✅ SERVER SIDE - ONLY FETCHES TEAM TOP DATA
// =====================================================
export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params?.["team-details"] || "";
  
  // Extract team ID from slug (e.g., "everton-45" -> 45)
  const teamIdInteger = parseInt(slug.split("-").pop(), 10);

  // Validate team ID
  if (isNaN(teamIdInteger) || teamIdInteger <= 0) {
    return {
      notFound: true,
    };
  }

  try {
    // 🔥 ONLY FETCH TOP TEAM DATA - last 6 matches stay client-side
    const topRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id=${teamIdInteger}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!topRes.ok) {
      throw new Error(`API responded with status: ${topRes.status}`);
    }

    const initialTeamsTopData = await topRes.json();

    // Validate top data
    if (!initialTeamsTopData?.status || !initialTeamsTopData?.data?.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialTeamsTopData,
        teamIdInteger,
      },
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return {
      notFound: true,
    };
  }
}

// =====================================================
// ✅ COMPONENT
// =====================================================
function Teams({ initialTeamsTopData, teamIdInteger }) {
  const router = useRouter();
  
  // SSR data - available immediately
  const [teams_top_data, setTeamsTopData] = useState(
    initialTeamsTopData?.data || []
  );
  
  // Client-side data - will load later
  const [team_last6_matches, setTeamLast6Matches] = useState([]);
  const [endpointStatus1, setEndPointStatus1] = useState("");
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(true);

  const team_matches_url = "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides";

  // client-side fetch for last 6 matches
  useEffect(() => {
    if (!teams_top_data.length) return;

    const fetchLast6Matches = async () => {
      setIsLoadingSecondary(true);
      
      try {
        const response = await fetchTeamsLast6Matches(
          team_matches_url, 
          teamIdInteger, 
          teams_top_data[0].unformated_date
        );
        
        if (response?.status === true) {
          setTeamLast6Matches(response.data || []);
          setEndPointStatus1("success");
        } else {
          setEndPointStatus1(response?.message === "No data found" ? "no_data" : "error");
          setTeamLast6Matches([]);
        }
      } catch (error) {
        console.error('Error fetching last 6 matches:', error);
        setEndPointStatus1("error");
      } finally {
        setIsLoadingSecondary(false);
      }
    };
    
    fetchLast6Matches();
  }, [teamIdInteger, teams_top_data]);

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
  const hasGeneralMatches = team_last6_matches.length > 0;
  const hasError = endpointStatus1 === "error";
  const hasNoData = endpointStatus1 === "no_data";

  // Show loading state while fetching secondary data
  if (isLoadingSecondary) {
    return (
      <>        
        {/* SSR Content - shows immediately */}
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
        
        {/* Loading indicator for secondary data */}
        <div className="sites-card">
          <PreLoader />
        </div>
      </>
    );
  }

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
        </div>
      </>
    );
  }

  // No data state
  if (hasNoData) {
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
          <DataNotFoundPage props="No recent matches data available for this team." />
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

      {/* Players Data Section - Coming Soon */}
      <div className="sites-card">
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
    </>
  );
}

export default Teams;