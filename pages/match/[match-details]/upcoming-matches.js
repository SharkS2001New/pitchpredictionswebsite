import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PreLoader from "../../../components/includes/loader";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import FetchUpcomingMatches from "../../../components/matchdetails/fetch_upcoming_matches";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";

import fetchLast6MatchesHome from "../../../components/matchdetails/functions/fetch_last_6_matches";
import fetchLast6MatchesAway from "../../../components/matchdetails/functions/fetch_last_6_matches_away";

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
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    return {
      props: {
        initialMatchDetails: data,
        fixtureIdInteger,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ initialMatchDetails, fixtureIdInteger }) {
  const router = useRouter();

  // ✅ SSR data
  const [game_details] = useState(initialMatchDetails.data || []);
  const [match_details_data] = useState(
    initialMatchDetails?.data[0] || null
  );

  // ✅ secondary state
  const [home_team_matches, setHomeTeamMatches] = useState([]);
  const [away_team_matches, setAwayTeamMatches] = useState([]);
  const [endpointStatus1, setEndPointStatus1] = useState("");
  const [endpointStatus2, setEndPointStatus2] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(true);

  /* ================= MOBILE DETECTION ================= */

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

    const loadSecondary = async () => {
      try {
        setIsLoadingSecondary(true);

        const [homeRes, awayRes] = await Promise.all([
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
        ]);

        setEndPointStatus1(homeRes?.message || "error");
        setEndPointStatus2(awayRes?.message || "error");

        if (homeRes?.status) {
          setHomeTeamMatches(homeRes.data || []);
        }

        if (awayRes?.status) {
          setAwayTeamMatches(awayRes.data || []);
        }
      } catch (err) {
        setEndPointStatus1("error");
        setEndPointStatus2("error");
      } finally {
        setIsLoadingSecondary(false);
      }
    };

    loadSecondary();
  }, [match_details_data]);

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

  /* ================= RENDER ================= */

  return (
    <>
      {/* ✅ SSR CONTENT */}
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
        ) : endpointStatus1 === "error" ? (
          <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
        ) : (
          <FetchUpcomingMatches
            home_team={match_details_data.home_team_name}
            away_team={match_details_data.away_team_name}
            home_team_id={match_details_data.home_team_id}
            away_team_id={match_details_data.away_team_id}
            fixture_date={match_details_data.unformated_date}
            isMobile={isMobile}
          />
        )}
      </div>
    </>
  );
}

export default MatchDetails;