import React, { useEffect, useState } from "react";
import PreLoader from "../../../components/includes/loader";
import { useRouter } from "next/router";
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import fetchLast6MatchesHome from "../../../components/matchdetails/functions/fetch_last_6_matches";
import fetchLast6MatchesAway from "../../../components/matchdetails/functions/fetch_last_6_matches_away";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import getTeamsStatsByFixture from "../../../components/functions/FetchTrendsByFixtures";
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

    const url =
      "https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id=" +
      fixtureIdInteger;

    const res = await fetch(url, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        initialGameDetails: data,
        fixtureIdInteger,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}

/* ================= COMPONENT ================= */

function MatchDetails({ initialGameDetails, fixtureIdInteger }) {
  const router = useRouter();

  /* ---------- state ---------- */

  const [isMobile, setIsMobile] = useState(false);
  const [endpointStatus, setEndPointStatus] = useState("");
  const [endpointStatus1, setEndPointStatus1] = useState("");
  const [endpointStatus2, setEndPointStatus2] = useState("");
  const [overallData, setOverallData] = useState([]);

  // ✅ from SSR
  const [game_details] = useState(initialGameDetails.data || []);
  const [match_details_data] = useState(
    initialGameDetails?.data[0] || {}
  );

  const [home_team_matches, setHomeTeamMatches] = useState([]);
  const [away_team_matches, setAwayTeamMatches] = useState([]);

  const home_team_matches_url =
    "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team";

  const away_team_matches_url =
    "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team";

  /* ================= EFFECTS ================= */

  // ✅ mobile detection (safe)
  useEffect(() => {
    const detectWindowSize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    detectWindowSize();
    window.addEventListener("resize", detectWindowSize);

    return () => window.removeEventListener("resize", detectWindowSize);
  }, []);

  // ✅ fetch secondary data ONLY
  useEffect(() => {
    if (!router.isReady || !match_details_data?.home_team_id) return;

    // home matches
    fetchLast6MatchesHome(
      home_team_matches_url,
      match_details_data.home_team_id,
      match_details_data.unformated_date
    ).then((data1) => {
      if (data1?.status === true) {
        setEndPointStatus1(data1.message);
        setHomeTeamMatches(data1.data || []);
      } else {
        setEndPointStatus1(data1?.message || "error");
      }
    });

    // away matches
    fetchLast6MatchesAway(
      away_team_matches_url,
      match_details_data.away_team_id,
      match_details_data.unformated_date
    ).then((data1) => {
      if (data1?.status === true) {
        setEndPointStatus2(data1.message);
        setAwayTeamMatches(data1.data || []);
      } else {
        setEndPointStatus2(data1?.message || "error");
      }
    });

    // trends
    getTeamsStatsByFixture(fixtureIdInteger).then((data) => {
      if (data?.status === true) {
        setOverallData(data.data || []);
        setEndPointStatus(data.message);
      } else {
        setEndPointStatus(data?.message || "error");
      }
    });
  }, [router.isReady, fixtureIdInteger, match_details_data]);

  /* ================= SEO ================= */

  const url_name =
    endpointStatus1 === "success" && endpointStatus2 === "success"
      ? encodeURIComponent(
          `${match_details_data.home_team_name
            ?.replace(/\s+/g, "-")
            .toLowerCase()}-vs-${match_details_data.away_team_name
            ?.replace(/\s+/g, "-")
            .toLowerCase()}-${fixtureIdInteger}`
        )
      : "";

  /* ================= LOADING ================= */

  if (endpointStatus1 === "" || endpointStatus2 === "") {
    return <PreLoader />;
  }

  /* ================= ERROR ================= */

  if (endpointStatus1 === "error" || endpointStatus2 === "error") {
    return (
      <>
        <div className="sites-card">
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

  if (game_details.length > 0) {
    return (
      <>
        {home_team_matches.length > 0 &&
          away_team_matches.length > 0 && (
            <>
              <div className="sites-card">
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

              <br />

              <div className="container sites-card">
                <FixturesTrends
                  overallData={overallData}
                  endpointStatus={endpointStatus}
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
          )}
      </>
    );
  }

  return <PreLoader />;
}

export default MatchDetails;