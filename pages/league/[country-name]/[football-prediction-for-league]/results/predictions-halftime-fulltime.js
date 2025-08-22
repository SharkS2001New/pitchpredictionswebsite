import React,{useState,useEffect} from "react";
import PreLoader from "../../../../../components/includes/loader";
import RenderData from "../../../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../../../components/shared/pages_match_predictions_details";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../../../../components/includes/datanotfound";
import LeaguesDetailsTop from "../../../../../components/leaguesdetails/leagues_top_details";
import FiltersLeagueDetails from "../../../../../components/leaguesdetails/filters-league-details";
import FetchLeaguesTopData from "../../../../../components/functions/FetchLeaguesTopData";
import FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 from "../../../../../components/leaguesdetails/results/filter-pred1x2-ov-un-dc-ht-ft";

function FootballPredictionsByLeague(){
    const router = useRouter(); //fetch page a data    
    const [isMobile, setIsMobile] = useState(false);
    const [endpointStatus,setEndPointStatus] = useState("");
    const [topLeaguesData, setTopLeaguesData] = useState([]);

    let league_name = "";
    let country_name = "";
    let leagueId = "";

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }
    
    //function to form league name
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

    //select the active tab by checking the # tag value on page load
    useEffect(()=>{ 
        if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);
        }

        FetchLeaguesTopData(leagueId).then(data => {
            if(data.status == true){
                var h2h_data = data.data;

                setEndPointStatus(data.message);

                setTopLeaguesData(h2h_data);

            }else{
                setEndPointStatus(data.message);
            }
        })
    }, [router.isReady])

     //Calculate the width on windows change detection
     function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }

     // Call the predictions function
     var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_league_results?league_name="+league_name+"&country_name="+country_name);
    
     let league_url = "";
    
     // form the dynamic url 
     league_url = country_name+'/'+league_name+'-'+leagueId;

     //If data is completly loaded. Display, Else, Show preloader
     if(renderPredictions[0].endpointStatus === ""){
         return(
             <PreLoader/>
         ) 
     }else if(renderPredictions[0].endpointStatus === "error"){
        if(topLeaguesData.length > 0){
         return ( 
            <React.Fragment>
                <div className="sites-card mb-2">
                    <LeaguesDetailsTop league_name={topLeaguesData[0].league_name} country_name={topLeaguesData[0].country_name} leagueId={topLeaguesData[0].league_id} country_logo={topLeaguesData[0].downloaded_country_flag} league_logo= {topLeaguesData[0].downloaded_league_logo} />
                    <div className="border-top"></div>                      
                    <FiltersLeagueDetails url_filter = {router.pathname.substring(1)} league_url={league_url} league_type={topLeaguesData[0].league_type}/>
                </div>
                <div className="sites-card">
                    <DataNotFoundPage props = "We don't have any matches for this league to show you right now, please try again later."/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="7856848919"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                </div>
            </React.Fragment>
            )
         }
     }else{
         if(renderPredictions.length >0 && topLeaguesData.length > 0){
                return(
                 <React.Fragment>
                     {/* data is displayed in tabs */}
                     <div className="desktop-container-resize">
                       <div className="sites-card mb-2">
                            <LeaguesDetailsTop league_name={topLeaguesData[0].league_name} country_name={topLeaguesData[0].country_name} leagueId={topLeaguesData[0].league_id} country_logo={topLeaguesData[0].downloaded_country_flag} league_logo= {topLeaguesData[0].downloaded_league_logo} />
                            <div className="border-top"></div>
                            <FiltersLeagueDetails url_filter = {router.pathname.substring(1)} league_url={league_url} league_type={topLeaguesData[0].league_type}/>
                            <div className="border-top"></div>
                            <FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 url_filter = {router.pathname.substring(1)}  my_dynamic_url ={encodeURI(`/league/football-predictions-for-${topLeaguesData[0].country_name.toLowerCase()}/${topLeaguesData[0].league_name.replace(/\s+/g, "-").toLowerCase()}-${topLeaguesData[0].league_id}/results`)} />                 
                       </div>
                       <div className="sites-card">  
                            <RenderData renderPredictions={renderPredictions} isMobile= {isMobile}/>
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
             )
         }else {
            return <PreLoader/>
         }
     }
}
export default FootballPredictionsByLeague;