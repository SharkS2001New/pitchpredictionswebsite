import React,{useEffect, useState} from "react";
import PreLoader from "../../../components/includes/loader";
import { useRouter } from 'next/router'
import MatchDetailsTop from "../../../components/matchdetails/match_details_top";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import fetchLast6MatchesHome from "../../../components/matchdetails/functions/fetch_last_6_matches";
import fetchLast6MatchesAway from "../../../components/matchdetails/functions/fetch_last_6_matches_away";
import getMatchDetailsTopData from "../../../components/matchdetails/functions/match_details_top_data";
import FiltersMatchDetails from "../../../components/matchdetails/filters-match-details";
import DisplayIndependentLeagueStandings from "../../../components/shared/standings_by_league";
import { Adsense } from "@ctrl/react-adsense";

function MatchDetails(){
    const router = useRouter(); //fetch page link data
    const [isMobile, setIsMobile] = useState(false);
    const [match_details_data,setMatchDetailsFilters] = useState([]);
    const [endpointStatus1,setEndPointStatus1] = useState("");
    const [endpointStatus2,setEndPointStatus2] = useState("");
    const [endpointStatus3,setEndPointStatus3] = useState("");
    const [tableStandings, setTableStandings] = useState([]);

    const current_url = router.query['match-details'];
    let fixtureIdInteger = 0;

    //fetch fixture id from the url
    if(router.isReady){
        fixtureIdInteger = parseInt(current_url.split("-").pop(), 10);
    }

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    const url = "https://api.pitchpredictions.com/api/fetch_match_details_top_data?fixture_id="+fixtureIdInteger;
    const [game_details, setGamesDetails] = useState([]);

    const home_team_matches_url = "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_home_team";
    const [home_team_matches, setHomeTeamMatches] = useState([]);

    
    const away_team_matches_url = "https://api.pitchpredictions.com/api/fetch_last_six_matches_by_away_team";
    const [away_team_matches, setAwayTeamMatches] = useState([]);
    
    useEffect(()=>{ 
        if(router.isReady){
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);

            //Fetch filters from database, and use the results to execute and display the rest of the data
            getMatchDetailsTopData(url).then(data => {
                if(data){
                    setGamesDetails(data);

                    //Set more filters to be used in filtering external end points
                    setMatchDetailsFilters(data[0]);

                    fetchLast6MatchesHome(home_team_matches_url,data[0].home_team_id,data[0].unformated_date).then(data1 => {

                        if(data1.status == true){
                            var h2h_data = data1.data;
                    
                            setEndPointStatus1(data1.message);
                                                        
                            setHomeTeamMatches(h2h_data);
                        }else{
                            setEndPointStatus1(data1.message);
                        }   
                    })
        
                    fetchLast6MatchesAway(away_team_matches_url,data[0].away_team_id,data[0].unformated_date).then(data1 => { 
                        if(data1.status == true){
                            var away_h2h_data = data1.data;
            
                            setEndPointStatus2(data1.message);
            
                            setAwayTeamMatches(away_h2h_data);
                        }else{
                            setEndPointStatus2(data1.message);
                        }
                    })
    
                    fetchTableStandings().then(data => {
                        if(endpointStatus1 ==="success" && endpointStatus2 === "success"){
                            if (data.status === true) {
                                const h2h_data = data.data;

                                setTableStandings(h2h_data[0].standings_data);

                                setEndPointStatus3(data.message);
                                
                            } else if(data.status == false) {
                                setEndPointStatus3(data.message);
                            }
                        }
                    });
                }else{
                    router.push('/', undefined, { 
                        statusCode: 301
                    })
                }               
            })
        } 
    },[router.isReady, endpointStatus1, endpointStatus2]);

    async function fetchTableStandings() {
        const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_team_standings", {
            method: 'POST',
            body: JSON.stringify({ league_id: match_details_data.league_id }),
            headers: headers,
        });
        return response1.json();
    }

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }

    let url_name = "";
    // form the dynamic url
    if(game_details.length >0){
        url_name = encodeURIComponent(match_details_data.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+match_details_data.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+fixtureIdInteger);
    }
   
    // If data is completly loaded. Display, Else, Show preloader
    if (!router.isReady || endpointStatus3 === "" || endpointStatus1 === "" || endpointStatus2 ==="") {
        return <PreLoader />;
    } else if (endpointStatus3 === "error") {
        if (game_details.length > 0) {
            return (
                <React.Fragment>
                    <div className="sites-card mb-2">
                        <MatchDetailsTop props={game_details} home_team_id={match_details_data.home_team_id} away_team_id ={match_details_data.away_team_id} home_team_data={home_team_matches} away_team_data={away_team_matches} />
                        <div className="border-top"></div>                      
                        {/* data is displayed in tabs */}
                        <FiltersMatchDetails url_filter = {router.pathname.substring(1)} match_url={url_name} league_type={match_details_data.league_type}/>    
                    </div>
                    <div className="sites-card"> 
                        <DataNotFoundPage props = "Sorry, there isn't enough data available to display at this time."/>
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
    }else if(endpointStatus3 ==="success"){
        if (game_details.length > 0 && tableStandings.length > 0) {
            return (
                <React.Fragment>
                    {home_team_matches.length && away_team_matches.length >0 ?
                    <React.Fragment>
                        <div className="sites-card mb-2">
                            <MatchDetailsTop props={game_details} home_team_id={match_details_data.home_team_id} away_team_id ={match_details_data.away_team_id} home_team_data={home_team_matches} away_team_data={away_team_matches} />
                            <div className="border-top"></div>                      
                         {/* data is displayed in tabs */}
                         <FiltersMatchDetails url_filter = {router.pathname.substring(1)} match_url={url_name} league_type={match_details_data.league_type}/>    
                        </div>
                        <div className="sites-card">
                            <DisplayIndependentLeagueStandings props={tableStandings} league_name={match_details_data.league_name} home_team_id={match_details_data.home_team_id} away_team_id ={match_details_data.away_team_id} isMobile = {isMobile} />
                        </div>
                    </React.Fragment>
                    : <></>
                    }
                </React.Fragment>
            )
        }else {
            <PreLoader/>
        }
    }
}


export default MatchDetails;