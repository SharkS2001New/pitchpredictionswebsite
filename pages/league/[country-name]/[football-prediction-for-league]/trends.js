// pages/league/[country-name]/[football-prediction-for-league]/trends.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import LeaguesAndCountriesPageTrends from "../../../../components/leaguesdetails/league-countries-pagestrends/leagues-countries-page-trends";
import FetchTrendsByLeague from "../../../../components/functions/FetchTrendsByLeague";
import PreLoader from "../../../../components/includes/loader";
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import FetchLeaguesTopData from "../../../../components/functions/FetchLeaguesTopData";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByLeagueTrends() {
  const router = useRouter();
  const [overallData, setOverallData] = useState([]);
  const [endpointStatus, setEndpointStatus] = useState('');
  const [topLeaguesData, setTopLeaguesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract and validate URL parameters
  const { query, isReady } = router;
  const leagueNameUrl = query['football-prediction-for-league'];
  const countryNameUrl = query['country-name'];

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
    if (!isReady || !leagueNameUrl || !countryNameUrl) {
      return { valid: false };
    }

    // Check if URL has valid league ID
    if (!leagueNameUrl.match(/-(\d+)$/)) {
      return { valid: false, redirect: true };
    }

    const leagueId = parseInt(leagueNameUrl.match(/-(\d+)$/)[1], 10);
    const leagueName = removeLastIntegerPart(leagueNameUrl);
    
    const prefix = "football-predictions-for-";
    const countryName = countryNameUrl.substring(prefix.length);

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
    if (isReady && leagueInfo.redirect) {
      router.push('/', undefined, { statusCode: 301 });
    }
  }, [isReady, leagueInfo.redirect, router]);

  // Fetch data when leagueId is available
  useEffect(() => {
    async function fetchData() {
      if (!leagueInfo.valid || !leagueInfo.leagueId) return;

      setLoading(true);
      try {
        // Fetch leagues top data
        const leaguesTopData = await FetchLeaguesTopData(leagueInfo.leagueId);
        if (leaguesTopData.status === true) {
          setEndpointStatus(leaguesTopData.message);
          setTopLeaguesData(leaguesTopData.data);
        }

        // Fetch trends by league
        const trendsByLeagueData = await FetchTrendsByLeague(leagueInfo.leagueId);
        if (trendsByLeagueData.status === true) {
          setOverallData(trendsByLeagueData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setEndpointStatus('error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [leagueInfo.valid, leagueInfo.leagueId]);

  // Form dynamic URL for filters
  const league_url = leagueInfo.valid 
    ? `${leagueInfo.countryName}/${leagueInfo.leagueName}-${leagueInfo.leagueId}`
    : '';

  // Show loading state
  if (loading || !isReady) {
    return <PreLoader />;
  }

  // Show error state with league header
  if (endpointStatus === 'error' || overallData.length === 0) {
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
            <DataNotFoundPage props="No trends found at the moment" />
            <br/>
            <div className="desktop-container-resize mb-1">
              <div className="col-sm-12 text-center bg-light pt-1">
                <Adsense
                  client="ca-pub-5665711413000284"
                  slot="7856848919"
                  style={{ display: "block" }}
                  layout="display"
                  format="auto"
                /> 
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // Render page with data
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
          <LeaguesAndCountriesPageTrends overall_data={overallData} />
        </div>
        
        <br/>
        <Adsense
          client="ca-pub-5665711413000284"
          slot="7856848919"
          style={{ display: "block" }}
          layout="display"
          format="auto"
        /> 
        <br/>
      </div>
    </React.Fragment>
  );
}

export default FootballPredictionsByLeagueTrends;