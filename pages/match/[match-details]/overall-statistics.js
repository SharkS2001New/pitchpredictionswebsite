// pages/match/[match-details]/index.js
import React, { useState } from "react";
import PreLoader from "../../../components/includes/loader";
import { useRouter } from "next/router";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import FixturesTrends from "../../../components/matchdetails/trends/match-details-trends";
import { Adsense } from "@ctrl/react-adsense";

/* ================= SSR ================= */
export async function getServerSideProps(context) {
  try {
    const { params } = context;
    const current_url = params?.["match-details"] || "";

    const parts = current_url.split("-");
    const fixtureIdInteger = parseInt(parts[parts.length - 1], 10) || 0;

    if (!fixtureIdInteger) {
      return { notFound: true };
    }

    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
    };

    // Fetch main match details
    const matchRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`,
      { headers }
    );

    if (!matchRes.ok) {
      throw new Error(`Match API responded with status: ${matchRes.status}`);
    }

    const matchData = await matchRes.json();

    if (!matchData || matchData.length === 0 || !matchData.data?.[0]) {
      return { notFound: true };
    }

    const matchDetails = matchData.data[0];
    
    // Fetch all secondary data in parallel
    const [homeLast6Res, awayLast6Res, trendsRes] = await Promise.allSettled([
      // Home team last 6 matches
      fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.home_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // Away team last 6 matches
      fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          away_team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
     // Trends data - using GET with query parameter (matching your function)
      fetch(`https://api.pitchpredictions.com/api/fetch_trends_data_by_fixture_id?fixture_id=${fixtureIdInteger}`, {
        method: 'GET', // Changed from POST to GET
        headers, // No body needed for GET requests
      })
    ]);

    // Process home last 6 matches
    let homeLast6Data = [];
    let homeStatus = "error";
    if (homeLast6Res.status === 'fulfilled' && homeLast6Res.value.ok) {
      const homeData = await homeLast6Res.value.json();
      if (homeData.status === true) {
        homeLast6Data = homeData.data || [];
        homeStatus = "success";
      }
    }

    // Process away last 6 matches
    let awayLast6Data = [];
    let awayStatus = "error";
    if (awayLast6Res.status === 'fulfilled' && awayLast6Res.value.ok) {
      const awayData = await awayLast6Res.value.json();
      if (awayData.status === true) {
        awayLast6Data = awayData.data || [];
        awayStatus = "success";
      }
    }

    // Process trends data
    let trendsData = [];
    let trendsStatus = "error";
    if (trendsRes.status === 'fulfilled' && trendsRes.value.ok) {
      const trends = await trendsRes.value.json();
      if (trends.status === true) {
        trendsData = trends.data || [];
        trendsStatus = "success";
      }
    }

    return {
      props: {
        initialGameDetails: matchData,
        fixtureIdInteger,
        initialHomeLast6: homeLast6Data,
        initialAwayLast6: awayLast6Data,
        homeStatus,
        awayStatus,
        initialTrends: trendsData,
        trendsStatus,
      },
    };
  } catch (error) {
    console.error('Error fetching match data:', error);
    return { notFound: true };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ 
  initialGameDetails, 
  fixtureIdInteger,
  initialHomeLast6 = [],
  initialAwayLast6 = [],
  homeStatus = "error",
  awayStatus = "error",
  initialTrends = [],
  trendsStatus = "error"
}) {
  const router = useRouter();

  // ✅ from SSR
  const [game_details] = useState(initialGameDetails.data || []);
  const [match_details_data] = useState(initialGameDetails?.data[0] || {});

  // Determine overall status
  const hasLast6Data = initialHomeLast6.length > 0 || initialAwayLast6.length > 0;
  const hasTrends = initialTrends.length > 0;
  const isLoading = homeStatus === "" || awayStatus === "";
  const hasError = homeStatus === "error" && awayStatus === "error";

  /* ================= URL ================= */
  const url_name = encodeURIComponent(
    `${match_details_data.home_team_name
      ?.replace(/\s+/g, "-")
      .toLowerCase()}-vs-${match_details_data.away_team_name
      ?.replace(/\s+/g, "-")
      .toLowerCase()}-${fixtureIdInteger}`
  );

  /* ================= LOADING ================= */
  if (!match_details_data || Object.keys(match_details_data).length === 0) {
    return <PreLoader />;
  }

  /* ================= ERROR ================= */
  if (hasError) {
    return (
      <>
        <div className="sites-card">
          <MatchDetailsTop
            props={game_details}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
            home_team_data={initialHomeLast6}
            away_team_data={initialAwayLast6}
          />
          <div className="border-top"></div>
          <FiltersMatchDetails
            url_filter={router.pathname.substring(1)}
            match_url={url_name}
            league_type={match_details_data.league_type}
          />
        </div>

        <br />

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

  /* ================= SUCCESS ================= */
  return (
    <>
      <div className="sites-card">
        <MatchDetailsTop
          props={game_details}
          home_team_id={match_details_data.home_team_id}
          away_team_id={match_details_data.away_team_id}
          home_team_data={initialHomeLast6}
          away_team_data={initialAwayLast6}
        />
        <div className="border-top"></div>

        <FiltersMatchDetails
          url_filter={router.pathname.substring(1)}
          match_url={url_name}
          league_type={match_details_data.league_type}
        />
      </div>

      <br />

      <div className="container sites-card">
        <FixturesTrends
          overallData={initialTrends}
          endpointStatus={trendsStatus}
          url={router.pathname.substring(1)}
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

export default MatchDetails;