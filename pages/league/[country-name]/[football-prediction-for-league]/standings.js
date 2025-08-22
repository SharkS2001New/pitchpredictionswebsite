import React, { useState, useEffect } from "react";
import PreLoader from "../../../../components/includes/loader";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import DisplayIndependentLeagueStandings from "../../../../components/shared/standings_by_league";
import FetchLeaguesTopData from "../../../../components/functions/FetchLeaguesTopData";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByLeague() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [tableStandings, setTableStandings] = useState([]);
  const [endpointStatus, setEndpointStatus] = useState("");
  const [endpointStatus1, setEndpointStatus1] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [topLeaguesData, setTopLeaguesData] = useState([]);

  let league_name = "";
  let country_name = "";
  let leagueId = "";

  const headers = {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
  }

  // Function to form league name
  const removeLastIntegerPart = (str) => {
    const regex = /-\d+$/;
    const match = str.match(regex);
    if (match) {
      const integerPart = match[0];
      return str.slice(0, str.lastIndexOf(integerPart));
    } else {
      return str;
    }
  };

  if(router.isReady){
    let league_name_url = router.query["football-prediction-for-league"];  
   

    //if url has no id, redirect to homepage
    if(league_name_url.match(/-(\d+)$/)){
        league_name = removeLastIntegerPart(league_name_url); //get league name from url
        //country name
        const query_link = router.query["country-name"];
        const prefix = "football-predictions-for-";
        country_name = query_link.substring(prefix.length);

        leagueId = parseInt(league_name_url.match(/-(\d+)$/)[1]);//get league id from the url
    }else{
        router.push('/', undefined, { 
            statusCode: 301
        })
    } 
}

  useEffect(() => {
    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        //Determine screen size on mobile or desktop
        window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);
    }

    if (!router.isReady) return;

    const league_name_url = router.query["football-prediction-for-league"];

    if (league_name_url.match(/-(\d+)$/)) {
      league_name = removeLastIntegerPart(league_name_url);
      const query_link = router.query["country-name"];
      const prefix = "football-predictions-for-";
      country_name = query_link.substring(prefix.length);
      leagueId = parseInt(league_name_url.match(/-(\d+)$/)[1]);
    } else {
      router.push('/', undefined, { statusCode: 301 });
    }
  }, [router.isReady]);

  //Calculate the width on windows change detection
  function detectWindowSize() {
      window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
  }

  if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
      window.onresize = detectWindowSize;
  }

  useEffect(() => {
    if (!router.isReady || endpointStatus !== "") return;

    FetchLeaguesTopData(leagueId).then(data => {
      if (data.status === true) {
        const h2h_data = data.data;
        setEndpointStatus(data.message);
        setTopLeaguesData(h2h_data);
      } else {
        setEndpointStatus(data.message);
      }
    });

    fetchTableStandings().then(data => {
      if (data.status === true) {
        const h2h_data = data.data;
        setEndpointStatus1(data.message);
        setLeagueName(h2h_data[0].league_name);
        setTableStandings(h2h_data[0].standings_data);
      } else {
        setEndpointStatus1(data.message);
      }
    });
  }, [router.isReady, endpointStatus]);

  async function fetchTableStandings() {
    const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
      method: 'POST',
      body: JSON.stringify({ league_id: leagueId }),
      headers: headers,
    });
    return response1.json();
  }


  if (!router.isReady || endpointStatus1 === "" || endpointStatus === "") {
    return <PreLoader />;
  } else if (endpointStatus1 === "error") {
    if (topLeaguesData.length > 0) {
      // const new_country_name = country_name.charAt(0).toUpperCase() + country_name.slice(1);
      // const new_league_name = league_name.charAt(0).toUpperCase() + league_name.replace(/-/g, ' ').slice(1);
      const league_url = `${country_name}/${league_name}-${leagueId}`;

      return (
        <React.Fragment>
          <div className="sites-card mb-2">
            <LeaguesDetailsTop league_name={topLeaguesData[0].league_name} country_name={topLeaguesData[0].country_name} leagueId={topLeaguesData[0].league_id} country_logo={topLeaguesData[0].downloaded_country_flag} league_logo= {topLeaguesData[0].downloaded_league_logo} />
            <div className="border-top"></div>
            <FiltersLeagueDetails url_filter={router.pathname.substring(1)} league_url={league_url} league_type={topLeaguesData[0].league_type}/>
          </div>
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
        </React.Fragment>
      );
    }
  } else if (endpointStatus1 === "success") {
    if (topLeaguesData.length > 0 && tableStandings.length > 0) {
      // const new_country_name = country_name.charAt(0).toUpperCase() + country_name.slice(1);
      const new_league_name = league_name.charAt(0).toUpperCase() + league_name.replace(/-/g, ' ').slice(1);
      const league_url = `${country_name}/${league_name}-${leagueId}`;

      return (
        <React.Fragment>
          <div className="desktop-container-resize">
            <div className="sites-card mb-2">
              <LeaguesDetailsTop league_name={topLeaguesData[0].league_name} country_name={topLeaguesData[0].country_name} leagueId={topLeaguesData[0].league_id} country_logo={topLeaguesData[0].downloaded_country_flag} league_logo= {topLeaguesData[0].downloaded_league_logo} />
              <div className="border-top"></div>
              <FiltersLeagueDetails url_filter={router.pathname.substring(1)} league_url={league_url} league_type={topLeaguesData[0].league_type} />
            </div>
            <div className="sites-card">
              <DisplayIndependentLeagueStandings props={tableStandings} league_name={new_league_name} isMobile = {isMobile} />
              <br />
            </div>
          </div>
        </React.Fragment>
      );
    }else {
      return <PreLoader/>
    }
  }
}

export default FootballPredictionsByLeague;
