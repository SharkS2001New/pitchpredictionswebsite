// pages/match/[match-details]/index.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import PreLoader from "../../../components/includes/loader";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import FetchUpcomingMatches from "../../../components/matchdetails/fetch_upcoming_matches";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";

/* ================= SERVER SIDE ================= */

export async function getServerSideProps(context) {
  const { params, query } = context;
  const slug = params?.["match-details"] || query["match-details"];

  let fixtureIdInteger = 0;

  if (slug) {
    const mainPart = slug.split("/")[0];
    const matches = mainPart.match(/-(\d+)$/);

    if (matches?.[1]) {
      fixtureIdInteger = parseInt(matches[1], 10);
    }
  }

  if (!fixtureIdInteger) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
  };

  try {
    // Fetch main match data
    const matchRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`,
      { headers }
    );

    if (!matchRes.ok) {
      throw new Error(`Match API responded with status: ${matchRes.status}`);
    }

    const matchData = await matchRes.json();

    if (!matchData || matchData.length === 0 || !matchData.data?.[0]) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    const matchDetails = matchData.data[0];
    
    // Fetch upcoming matches in parallel
    const [upcomingHomeRes, upcomingAwayRes] = await Promise.allSettled([
      // Upcoming home team matches
      fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.home_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // Upcoming away team matches
      fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          away_team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      })
    ]);

    // Process upcoming home matches
    let upcomingHomeData = [];
    let upcomingHomeStatus = "error";
    if (upcomingHomeRes.status === 'fulfilled' && upcomingHomeRes.value.ok) {
      const homeData = await upcomingHomeRes.value.json();
      if (homeData.status === true) {
        upcomingHomeData = homeData.data || [];
        upcomingHomeStatus = "success";
      }
    }

    // Process upcoming away matches
    let upcomingAwayData = [];
    let upcomingAwayStatus = "error";
    if (upcomingAwayRes.status === 'fulfilled' && upcomingAwayRes.value.ok) {
      const awayData = await upcomingAwayRes.value.json();
      if (awayData.status === true) {
        upcomingAwayData = awayData.data || [];
        upcomingAwayStatus = "success";
      }
    }

    return {
      props: {
        initialMatchDetails: matchData,
        fixtureIdInteger,
        initialUpcomingHome: upcomingHomeData,
        initialUpcomingAway: upcomingAwayData,
        upcomingHomeStatus,
        upcomingAwayStatus,
      },
    };
  } catch (error) {
    console.error('Error fetching match data:', error);
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ 
  initialMatchDetails, 
  fixtureIdInteger,
  initialUpcomingHome,
  initialUpcomingAway,
  upcomingHomeStatus,
  upcomingAwayStatus
}) {
  const router = useRouter();

  // ✅ SSR data
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(initialMatchDetails?.data[0] || null);

  /* ================= LOADING ================= */
  if (!match_details_data) {
    return <PreLoader />;
  }

  /* ================= URL ================= */
  const url_name = encodeURIComponent(
    match_details_data.home_team_name
      .replace(/\s+/g, "-")
      .toLowerCase() +
      "-vs-" +
      match_details_data.away_team_name
        .replace(/\s+/g, "-")
        .toLowerCase() +
      "-" +
      fixtureIdInteger
  );

  // Determine overall status
  const hasData = initialUpcomingHome.length > 0 || initialUpcomingAway.length > 0;
  const hasError = upcomingHomeStatus === "error" && upcomingAwayStatus === "error";

  /* ================= RENDER ================= */
  return (
    <>
      {/* ✅ SSR CONTENT */}
      <div className="sites-card mb-2">
        <MatchDetailsTop
          props={game_details}
          home_team_id={match_details_data.home_team_id}
          away_team_id={match_details_data.away_team_id}
          home_team_data={[]} // These would need to be fetched separately
          away_team_data={[]}
        />

        <div className="border-top"></div>

        <FiltersMatchDetails
          url_filter={router.pathname.substring(1)}
          match_url={url_name}
          league_type={match_details_data.league_type}
        />
      </div>

      {/* ✅ UPCOMING MATCHES CONTENT */}
      <div className="sites-card">
        {!hasData && hasError ? (
          <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
        ) : (
          <FetchUpcomingMatches
            home_team={match_details_data.home_team_name}
            away_team={match_details_data.away_team_name}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
            fixture_date={match_details_data.unformated_date}
            initialHomeMatches={initialUpcomingHome}
            initialAwayMatches={initialUpcomingAway}
            homeStatus={upcomingHomeStatus}
            awayStatus={upcomingAwayStatus}
          />
        )}
      </div>
    </>
  );
}

export default MatchDetails;