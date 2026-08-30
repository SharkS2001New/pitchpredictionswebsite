// pages/league/[country-name]/[football-prediction-for-league]/standings.js
import React from "react";
import { useRouter } from "next/router";
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import DisplayIndependentLeagueStandings from "../../../../components/shared/standings_by_league";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import { Adsense } from "@/components/shared/client-adsense";

function FootballPredictionsByLeagueStandings({
  initialTopLeaguesData,
  initialStandings,
  standingsLeagueName,
  leagueName,
  countryName,
  displayLeagueName,
  displayCountryName,
  leagueId,
  endpointStatus,
  error,
}) {
  const router = useRouter();
  const topLeaguesData = initialTopLeaguesData || [];
  const tableStandings = initialStandings || [];
  const league_url = `${countryName}/${leagueName}-${leagueId}`;

  const leagueHeader = topLeaguesData.length > 0 ? (
    <div className="sites-card mb-2">
      <LeaguesDetailsTop
        league_name={topLeaguesData[0].league_name}
        country_name={topLeaguesData[0].country_name}
        leagueId={topLeaguesData[0].league_id}
        country_logo={topLeaguesData[0].downloaded_country_flag}
        league_logo={topLeaguesData[0].downloaded_league_logo}
      />
      <div className="border-top"></div>
      <FiltersLeagueDetails
        url_filter={router.pathname.substring(1)}
        league_url={league_url}
        league_type={topLeaguesData[0]?.league_type || ""}
      />
    </div>
  ) : (
    <div className="sites-card mb-2">
      <LeaguesDetailsTop
        league_name={displayLeagueName}
        country_name={displayCountryName}
        leagueId={leagueId}
        country_logo=""
        league_logo=""
      />
      <div className="border-top"></div>
      <FiltersLeagueDetails
        url_filter={router.pathname.substring(1)}
        league_url={league_url}
        league_type=""
      />
    </div>
  );

  if (endpointStatus === "error" || error || tableStandings.length === 0) {
    return (
      <div className="desktop-container-resize">
        {leagueHeader}
        <div className="sites-card">
          <DataNotFoundPage props="No standings for this league, please try again later." />
          <br />
          <Adsense
            client="ca-pub-5665711413000284"
            slot="7856848919"
            style={{ display: "block" }}
            layout="display"
            format="auto"
          />
        </div>
      </div>
    );
  }

  const displayName =
    standingsLeagueName ||
    leagueName.charAt(0).toUpperCase() + leagueName.replace(/-/g, " ").slice(1);

  return (
    <div className="desktop-container-resize">
      {leagueHeader}
      <div className="sites-card">
        <DisplayIndependentLeagueStandings
          props={tableStandings}
          league_name={displayName}
        />
        <br />
      </div>
    </div>
  );
}

function removeLastIntegerPart(str) {
  const regex = /-\d+$/;
  const match = str.match(regex);
  if (match) {
    return str.slice(0, str.lastIndexOf(match[0]));
  }
  return str;
}

export async function getServerSideProps(context) {
  const countryParam = context.params?.["country-name"] || "";
  const leagueParam = context.params?.["football-prediction-for-league"] || "";

  if (!leagueParam.match(/-\d+$/)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const countryPrefix = "football-predictions-for-";
  let extractedCountry = countryParam;
  if (countryParam.startsWith(countryPrefix)) {
    extractedCountry = countryParam.substring(countryPrefix.length);
  }

  const leagueNameWithHyphens = removeLastIntegerPart(leagueParam);
  const leagueId = parseInt(leagueParam.match(/-(\d+)$/)[1], 10);

  const displayCountryName = extractedCountry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const displayLeagueName = leagueNameWithHyphens
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
  };

  let topLeaguesData = [];
  let tableStandings = [];
  let standingsLeagueName = "";

  try {
    try {
      const topUrl = `https://api.pitchpredictions.com/api/fetch_leagues_top_data?league_id=${leagueId}`;
      const topResponse = await fetch(topUrl, { headers });
      const topData = await topResponse.json();
      if (topData.status === true) {
        topLeaguesData = topData.data || [];
      }
    } catch (topError) {
      console.error("Error fetching leagues top data:", topError);
    }

    try {
      const standingsResponse = await fetch(
        "https://api.pitchpredictions.com/api/fetch_team_standings",
        {
          method: "POST",
          body: JSON.stringify({ league_id: leagueId }),
          headers,
        }
      );
      const standingsData = await standingsResponse.json();

      if (
        standingsData.status === true &&
        standingsData.data?.length > 0
      ) {
        standingsLeagueName = standingsData.data[0].league_name || "";
        tableStandings = standingsData.data[0].standings_data || [];
      }
    } catch (standingsError) {
      console.error("Error fetching league standings:", standingsError);
    }

    const hasStandings = tableStandings.length > 0;

    return {
      props: {
        initialTopLeaguesData: topLeaguesData,
        initialStandings: tableStandings,
        standingsLeagueName,
        leagueName: leagueNameWithHyphens,
        countryName: extractedCountry,
        displayLeagueName,
        displayCountryName,
        leagueId,
        endpointStatus: hasStandings ? "success" : "error",
        error: hasStandings ? null : "No standings found for this league",
      },
    };
  } catch (fetchError) {
    console.error("Error in getServerSideProps:", fetchError);

    return {
      props: {
        initialTopLeaguesData: [],
        initialStandings: [],
        standingsLeagueName: "",
        leagueName: leagueNameWithHyphens,
        countryName: extractedCountry,
        displayLeagueName,
        displayCountryName,
        leagueId,
        endpointStatus: "error",
        error: fetchError.message || "Failed to load league standings",
      },
    };
  }
}

export default FootballPredictionsByLeagueStandings;
