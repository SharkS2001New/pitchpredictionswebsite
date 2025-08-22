import React,{useState,useEffect, useMemo} from "react";
import { useRouter } from 'next/router';
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import LeaguesAndCountriesPageTrends from "../../../../components/leaguesdetails/league-countries-pagestrends/leagues-countries-page-trends";
import FetchTrendsByLeague from "../../../../components/functions/FetchTrendsByLeague";
import PreLoader from "../../../../components/includes/loader";
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import FetchLeaguesTopData from "../../../../components/functions/FetchLeaguesTopData";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByLeague() {
  const router = useRouter(); // Fetch page data
  const [isMobile, setIsMobile] = useState(false);
  const [overallData, setOverallData] = useState([]);
  const [endpointStatus, setEndpointStatus] = useState('');
  const [endpointStatus1, setEndpointStatus1] = useState('');
  const [topLeaguesData, setTopLeaguesData] = useState([]);

  const { query } = router;
  const leagueNameUrl = query['football-prediction-for-league'];
  let league_name = '';
  let country_name = '';
  let leagueId = '';

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
    if (!router.isReady) {
      return;
    }

    if (leagueNameUrl && leagueNameUrl.match(/-(\d+)$/)) {
      league_name = removeLastIntegerPart(leagueNameUrl); // Get league name from URL
      // Country name
      const query_link = query['country-name'];
      const prefix = 'football-predictions-for-';
      country_name = query_link.substring(prefix.length);

      leagueId = parseInt(leagueNameUrl.match(/-(\d+)$/)[1]); // Get league id from the URL
    } else {
      router.push('/', undefined, {
        statusCode: 301,
      });
    }
  }, [router.isReady, leagueNameUrl, query]);

  useEffect(() => {
    function detectWindowSize() {
      window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);
    }

    if (router.isReady) {
      window.onresize = detectWindowSize;
    }

    return () => {
      window.onresize = null;
    };
  }, [router.isReady]);

  useEffect(() => {
    async function fetchData() {
      try {
        const leaguesTopData = await FetchLeaguesTopData(leagueId);
        if (leaguesTopData.status === true) {
          setEndpointStatus(leaguesTopData.message);
          setTopLeaguesData(leaguesTopData.data);
        } else {
          setEndpointStatus(leaguesTopData.message);
        }

        const trendsByLeagueData = await FetchTrendsByLeague(leagueId);

        if (trendsByLeagueData.status === true) {
          setEndpointStatus1(trendsByLeagueData.message);
          setOverallData(trendsByLeagueData.data);
        } else {
          setEndpointStatus1(trendsByLeagueData.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if (leagueId) {
      fetchData();
    }
  }, [router.isReady]);

  let league_url = "";
 
  // form the dynamic url 
  league_url = country_name+'/'+league_name+'-'+leagueId;
  if (endpointStatus1 === '') {
    return <PreLoader />;
  } else if (endpointStatus1 === 'error') {
    if (topLeaguesData.length > 0) {
      return (
        <React.Fragment>
          {/* Data is displayed in tabs */}
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
              <FiltersLeagueDetails url_filter={router.pathname.substring(1)} league_url={league_url} />
            </div>
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
  } else if (overallData.length > 0) {
    return (
      <React.Fragment>
        {/* Data is displayed in tabs */}
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
            <FiltersLeagueDetails url_filter={router.pathname.substring(1)} league_url={league_url} league_type={topLeaguesData[0].league_type}/>
          </div>
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

  return null;
}

export default FootballPredictionsByLeague;
