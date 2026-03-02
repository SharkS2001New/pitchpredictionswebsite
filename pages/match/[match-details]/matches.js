// pages/match/[match-details]/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import H2HFixturesData from "../../../components/matchdetails/h2h_fixtures";
import Last6Matches from "../../../components/matchdetails/last_6_matches";
import PreLoader from "../../../components/includes/loader";
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

  // ❗ invalid id → redirect
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
    // Fetch main match data first (required)
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
    
    // Fetch ALL secondary data in parallel
    const [
      h2hMatchesRes,
      h2hLeaguesRes,
      homeLast6Res,
      awayLast6Res,
      homeLast6LeaguesRes,
      awayLast6LeaguesRes
    ] = await Promise.allSettled([
      // H2H matches
      fetch("https://api.pitchpredictions.com/api/fetch_h2h_fixtures", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.home_team_id,
          away_team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // H2H leagues
      fetch("https://api.pitchpredictions.com/api/fetch_h2h_league", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.home_team_id,
          away_team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
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
      
      // Home team last 6 matches leagues (for filtering)
      fetch("https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.home_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      }),
      
      // Away team last 6 matches leagues (for filtering)
      fetch("https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          home_team_id: matchDetails.away_team_id,
          fixture_date: matchDetails.unformated_date
        }),
      })
    ]);

    // Process H2H matches
    let h2hMatchesData = [];
    if (h2hMatchesRes.status === 'fulfilled' && h2hMatchesRes.value.ok) {
      const h2hData = await h2hMatchesRes.value.json();
      if (h2hData.status === true) {
        h2hMatchesData = h2hData.data || [];
      }
    }

    // Process H2H leagues
    let h2hLeaguesData = [];
    if (h2hLeaguesRes.status === 'fulfilled' && h2hLeaguesRes.value.ok) {
      const leaguesData = await h2hLeaguesRes.value.json();
      if (leaguesData.status === true) {
        h2hLeaguesData = leaguesData.data || [];
      }
    }

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

    // Process home last 6 leagues
    let homeLast6LeaguesData = [];
    if (homeLast6LeaguesRes.status === 'fulfilled' && homeLast6LeaguesRes.value.ok) {
      const leaguesData = await homeLast6LeaguesRes.value.json();
      if (leaguesData.status === true) {
        homeLast6LeaguesData = leaguesData.data || [];
      }
    }

    // Process away last 6 leagues
    let awayLast6LeaguesData = [];
    if (awayLast6LeaguesRes.status === 'fulfilled' && awayLast6LeaguesRes.value.ok) {
      const leaguesData = await awayLast6LeaguesRes.value.json();
      if (leaguesData.status === true) {
        awayLast6LeaguesData = leaguesData.data || [];
      }
    }

    return {
      props: {
        initialMatchDetails: matchData,
        fixtureIdInteger,
        initialH2HMatches: h2hMatchesData,
        initialH2HLeagues: h2hLeaguesData,
        initialHomeLast6: homeLast6Data,
        initialAwayLast6: awayLast6Data,
        initialHomeLast6Leagues: homeLast6LeaguesData,
        initialAwayLast6Leagues: awayLast6LeaguesData,
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
  initialH2HMatches,
  initialH2HLeagues,
  initialHomeLast6,
  initialAwayLast6,
  initialHomeLast6Leagues,
  initialAwayLast6Leagues
}) {
  const router = useRouter();

  // ✅ SSR data
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(initialMatchDetails?.data[0] || null);

  /* ================= LOADING ================= */
  if (!match_details_data) {
    return <PreLoader />;
  }

  /* ================= RENDER ================= */
  const url_name = encodeURIComponent(
    match_details_data.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' +
    match_details_data.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' +
    fixtureIdInteger
  );

  return (
    <>
      {/* ✅ SSR CONTENT */}
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

      {/* ✅ H2H CONTENT - Server rendered with initial data */}
      <div className="sites-card">
        <H2HFixturesData
          home_team_id={match_details_data.home_team_id}
          away_team_id={match_details_data.away_team_id}
          fixture_date={match_details_data.unformated_date}
          initialH2HMatches={initialH2HMatches}
          initialH2HLeagues={initialH2HLeagues}
        />
      </div>

      {/* ✅ Last 6 Matches - Server rendered with initial data */}
      {(initialHomeLast6.length > 0 || initialAwayLast6.length > 0) && (
        <div className="sites-card">
          <Last6Matches
            home_team={match_details_data.home_team_name}
            away_team={match_details_data.away_team_name}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
            fixture_date={match_details_data.unformated_date}
            home_team_data={initialHomeLast6}
            away_team_data={initialAwayLast6}
            initialHomeLeagues={initialHomeLast6Leagues}
            initialAwayLeagues={initialAwayLast6Leagues}
          />
        </div>
      )}
    </>
  );
}

export default MatchDetails;