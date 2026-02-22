import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PreLoader from "../../../components/includes/loader";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import { Adsense } from "@ctrl/react-adsense";

import fetchLast6MatchesHome from "../../../components/matchdetails/functions/fetch_last_6_matches";
import fetchLast6MatchesAway from "../../../components/matchdetails/functions/fetch_last_6_matches_away";

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

  try {
    const res = await fetch(
      `https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=${fixtureIdInteger}`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
        },
      }
    );

    const data = await res.json();

    if (!data || data.length === 0) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return {
      props: {
        initialMatchDetails: data,
        fixtureIdInteger,
      },
    };
  } catch (e) {
    return { redirect: { destination: "/", permanent: false } };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ initialMatchDetails, fixtureIdInteger }) {
  const router = useRouter();

  // ✅ SSR DATA
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(
    initialMatchDetails?.data[0] || null
  );

  // ✅ CLIENT STATES
  const [home_team_matches, setHomeTeamMatches] = useState([]);
  const [away_team_matches, setAwayTeamMatches] = useState([]);
  const [tableStandings, setTableStandings] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(true);
  const [standingsStatus, setStandingsStatus] = useState("");

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
  };

  /* ================= MOBILE ================= */

  useEffect(() => {
    const detectWindowSize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    detectWindowSize();
    window.addEventListener("resize", detectWindowSize);

    return () =>
      window.removeEventListener("resize", detectWindowSize);
  }, []);

  /* ================= SECONDARY FETCH ================= */

  useEffect(() => {
    if (!match_details_data?.home_team_id) return;

    const homeUrl =
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team";

    const awayUrl =
      "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team";

    const loadAll = async () => {
      try {
        setIsLoadingSecondary(true);

        const [homeRes, awayRes, standingsRes] = await Promise.all([
          fetchLast6MatchesHome(
            homeUrl,
            match_details_data.home_team_id,
            match_details_data.unformated_date
          ),
          fetchLast6MatchesAway(
            awayUrl,
            match_details_data.away_team_id,
            match_details_data.unformated_date
          ),
          fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
            method: "POST",
            headers,
            body: JSON.stringify({
              league_id: match_details_data.league_id,
            }),
          }).then((r) => r.json()),
        ]);

        if (homeRes?.status) setHomeTeamMatches(homeRes.data || []);
        if (awayRes?.status) setAwayTeamMatches(awayRes.data || []);

        if (standingsRes?.status) {
          setTableStandings(
            standingsRes.data?.[0]?.standings_data || []
          );
          setStandingsStatus("success");
        } else {
          setStandingsStatus("error");
        }
      } catch (err) {
        setStandingsStatus("error");
      } finally {
        setIsLoadingSecondary(false);
      }
    };

    loadAll();
  }, [match_details_data]);

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

  /* ================= RENDER ================= */

  return (
    <>
      {/* ✅ SSR TOP */}
      <div className="sites-card mb-2">
        <MatchDetailsTop
          props={game_details}
          home_team_id={match_details_data.home_team_id}
          away_team_id={match_details_data.away_team_id}
          home_team_data={home_team_matches}
          away_team_data={away_team_matches}
        />
        <div className="border-top"></div>

        <FiltersMatchDetails
          url_filter={router.pathname.substring(1)}
          match_url={url_name}
          league_type={match_details_data.league_type}
        />
      </div>

      {/* ✅ CLIENT CONTENT */}
      <div className="sites-card">
        {isLoadingSecondary ? (
          <PreLoader />
        ) : standingsStatus === "error" ? (
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
            props={tableStandings}
            league_name={match_details_data.league_name}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
            isMobile={isMobile}
          />
        )}
      </div>
    </>
  );
}

export default MatchDetails;