// pages/match/[match-details]/index.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import PreLoader from "../../../components/includes/loader";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import { Adsense } from "@ctrl/react-adsense";

/* ================= SSR ================= */

export async function getServerSideProps(context) {
  const { params, query } = context;
  const slug = params?.["match-details"] || query["match-details"];

  let fixtureIdInteger = 0;

  if (slug) {
    const mainPart = slug.split("/")[0];
    const matches = mainPart.match(/-(\d+)$/);
    if (matches?.[1]) fixtureIdInteger = parseInt(matches[1], 10);
  }

  if (!fixtureIdInteger) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
  };

  try {
    // Fetch main match data first
    const matchRes = await fetch(
      `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`,
      { headers }
    );

    if (!matchRes.ok) {
      throw new Error(`Match API responded with status: ${matchRes.status}`);
    }

    const matchData = await matchRes.json();

    if (!matchData || matchData.length === 0 || !matchData.data?.[0]) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const matchDetails = matchData.data[0];
    
    // Fetch all secondary data in parallel
    const [homeLast6Res, awayLast6Res, standingsRes] = await Promise.allSettled([
      // Home team last 6 matches
      fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          team_id: matchDetails.home_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // Away team last 6 matches
      fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // Team standings
      fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          league_id: matchDetails.league_id,
        }),
      })
    ]);

    // Process home last 6 matches
    let homeLast6Data = [];
    if (homeLast6Res.status === 'fulfilled' && homeLast6Res.value.ok) {
      const homeData = await homeLast6Res.value.json();
      if (homeData.status === true) {
        homeLast6Data = homeData.data || [];
      }
    }

    // Process away last 6 matches
    let awayLast6Data = [];
    if (awayLast6Res.status === 'fulfilled' && awayLast6Res.value.ok) {
      const awayData = await awayLast6Res.value.json();
      if (awayData.status === true) {
        awayLast6Data = awayData.data || [];
      }
    }

    // Process standings
    let standingsData = [];
    let standingsStatus = "error";
    if (standingsRes.status === 'fulfilled' && standingsRes.value.ok) {
      const standingData = await standingsRes.value.json();
      if (standingData.status === true) {
        standingsData = standingData.data?.[0]?.standings_data || [];
        standingsStatus = "success";
      }
    }

    return {
      props: {
        initialMatchDetails: matchData,
        fixtureIdInteger,
        initialHomeLast6: homeLast6Data,
        initialAwayLast6: awayLast6Data,
        initialStandings: standingsData,
        standingsStatus,
      },
    };
  } catch (e) {
    console.error('Error fetching match data:', e);
    return { redirect: { destination: "/", permanent: false } };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ 
  initialMatchDetails, 
  fixtureIdInteger,
  initialHomeLast6 = [],
  initialAwayLast6 = [],
  initialStandings = [],
  standingsStatus = "error"
}) {
  const router = useRouter();

  // ✅ SSR DATA
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(initialMatchDetails?.data[0] || null);

  /* ================= LOADING ================= */
  if (!match_details_data) return <PreLoader />;

  /* ================= URL ================= */
  const url_name = encodeURIComponent(
    `${match_details_data.home_team_name
      .replace(/\s+/g, "-")
      .toLowerCase()}-vs-${match_details_data.away_team_name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${fixtureIdInteger}`
  );

  // Check if we have any data to display
  const hasStandings = initialStandings.length > 0;

  /* ================= RENDER ================= */
  return (
    <>
      {/* ✅ SSR TOP */}
      <div className="sites-card mb-2">
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

      {/* ✅ STANDINGS CONTENT */}
      <div className="sites-card">
        {standingsStatus === "error" || !hasStandings ? (
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
            league_name={match_details_data.league_name}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
          />
        )}
      </div>
    </>
  );
}

export default MatchDetails;