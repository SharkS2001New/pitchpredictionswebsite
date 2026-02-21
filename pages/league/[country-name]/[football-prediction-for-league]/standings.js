// pages/league/[country-name]/[football-prediction-for-league]/standings.js
import React, { useState, useEffect } from "react";
import PreLoader from "../../../../components/includes/loader";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import DisplayIndependentLeagueStandings from "../../../../components/shared/standings_by_league";
import FetchLeaguesTopData from "../../../../components/functions/FetchLeaguesTopData";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByLeagueStandings() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [tableStandings, setTableStandings] = useState([]);
  const [endpointStatus, setEndpointStatus] = useState("");
  const [endpointStatus1, setEndpointStatus1] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [topLeaguesData, setTopLeaguesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  };

  // Helper function to remove last integer part
  const removeLastIntegerPart = (str) => {
    const regex = /-\d+$/;
    const match = str.match(regex);
    if (match) {
      const integerPart = match[0];
      return str.slice(0, str.lastIndexOf(integerPart));
    }
    return str;
  };

  // Parse URL parameters
  const getLeagueInfo = () => {
    if (!router.isReady) return { valid: false };

    const league_name_url = router.query["football-prediction-for-league"];
    
    // If URL has no ID, redirect to homepage
    if (!league_name_url || !league_name_url.match(/-(\d+)$/)) {
      return { valid: false, redirect: true };
    }

    const leagueId = parseInt(league_name_url.match(/-(\d+)$/)[1], 10);
    const leagueName = removeLastIntegerPart(league_name_url);
    
    const query_link = router.query["country-name"];
    const prefix = "football-predictions-for-";
    const countryName = query_link.substring(prefix.length);

    return {
      valid: true,
      leagueId,
      leagueName,
      countryName,
      displayLeagueName: leagueName.replace(/-/g, ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      displayCountryName: countryName.replace(/-/g, ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    };
  };

  const leagueInfo = getLeagueInfo();

  // Handle redirect if invalid URL
  useEffect(() => {
    if (router.isReady && leagueInfo.redirect) {
      router.push('/', undefined, { statusCode: 301 });
    }
  }, [router.isReady, leagueInfo.redirect, router]);

  // Window resize detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectWindowSize = () => {
      setIsMobile(window.innerWidth < 760);
    };

    detectWindowSize();
    window.addEventListener('resize', detectWindowSize);

    return () => window.removeEventListener('resize', detectWindowSize);
  }, []);

  // Fetch standings data
  useEffect(() => {
    async function fetchData() {
      if (!router.isReady || !leagueInfo.valid) return;

      setLoading(true);
      try {
        // Fetch leagues top data
        const leaguesTopData = await FetchLeaguesTopData(leagueInfo.leagueId);
        if (leaguesTopData.status === true) {
          setEndpointStatus(leaguesTopData.message);
          setTopLeaguesData(leaguesTopData.data);
        } else {
          setEndpointStatus(leaguesTopData.message);
        }

        // Fetch table standings
        const standingsData = await fetchTableStandings(leagueInfo.leagueId);
        if (standingsData.status === true) {
          setEndpointStatus1(standingsData.message);
          if (standingsData.data && standingsData.data.length > 0) {
            setLeagueName(standingsData.data[0].league_name);
            setTableStandings(standingsData.data[0].standings_data);
          }
        } else {
          setEndpointStatus1(standingsData.message);
        }
      } catch (error) {
        console.error('Error fetching standings data:', error);
        setEndpointStatus1('error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router.isReady, leagueInfo.valid, leagueInfo.leagueId]);

  async function fetchTableStandings(leagueId) {
    const response = await fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
      method: 'POST',
      body: JSON.stringify({ league_id: leagueId }),
      headers: headers,
    });
    return response.json();
  }

  // Form dynamic URL for filters
  const league_url = leagueInfo.valid 
    ? `${leagueInfo.countryName}/${leagueInfo.leagueName}-${leagueInfo.leagueId}`
    : '';

  // Show loading state
  if (loading || !router.isReady) {
    return <PreLoader />;
  }

  // Show error state with league header
  if (endpointStatus1 === "error" || tableStandings.length === 0) {
    return (
      <React.Fragment>
        <div className="desktop-container-resize">
          {topLeaguesData.length > 0 && (
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
                league_type={topLeaguesData[0]?.league_type || ''}
              />
            </div>
          )}
          
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
      </React.Fragment>
    );
  }

  // Render page with data
  if (topLeaguesData.length > 0 && tableStandings.length > 0) {
    const new_league_name = leagueInfo.leagueName.charAt(0).toUpperCase() + 
      leagueInfo.leagueName.replace(/-/g, ' ').slice(1);

    return (
      <React.Fragment>
        <div className="desktop-container-resize">
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
              league_type={topLeaguesData[0]?.league_type || ''} 
            />
          </div>
          
          <div className="sites-card">
            <DisplayIndependentLeagueStandings 
              props={tableStandings} 
              league_name={new_league_name} 
              isMobile={isMobile} 
            />
            <br />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <PreLoader />;
}

export default FootballPredictionsByLeagueStandings;