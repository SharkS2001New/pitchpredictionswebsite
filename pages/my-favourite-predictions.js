import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import RenderData from "../components/shared/render_fixtures_data";
import WinningTeamAndOdd from "../components/functions/determine_winning_team_and_odd";
import ProbabilityResults from "../components/functions/determine_probability_results";
import DetermineLiveScores from "../components/functions/determine_live_scores";
import ComputeFixtureAverage from "../components/functions/ComputefixtureAverage";
import DataNotFoundPage from "../components/includes/datanotfound";
import PreLoader from "../components/includes/loader";
import FixturesTableDisplay from "../components/shared/fixtures_table_display";
import FetchFixtureByIdMyFav from "../components/functions/FetchfixturesById-Myfavourites";
import { Adsense } from "@ctrl/react-adsense";

function MySelectedMatches(){    
    const router = useRouter();
    const [my_state_data, setMyStateData] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [favMatchesUpdateCounter, setfavMatchesUpdateCounter] = useState(0);
    const [favLiveMatchesUpdateCounter, setfavLiveMatchesUpdateCounter] = useState(0);
    const [loading, setIsLoading] = useState("");
    
    const mounted = useRef(false);
    
    // Calculate the width on window change detection
    function detectWindowSize() {
        setIsMobile(window.innerWidth < 760);
    }
    
    useEffect(() => {
        if (router.isReady) {
            setIsMobile(window.innerWidth < 760);
            window.addEventListener('resize', detectWindowSize);
        }
    
        return () => {
            window.removeEventListener('resize', detectWindowSize);
        };
    }, [router.isReady]);
    
    // Method used to refresh the data automatically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setfavMatchesUpdateCounter(prevCounter => prevCounter + 1);
        }, 500);
    
        if (mounted.current) {
            const favoritematches = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata"));
            if (favoritematches) {
                setMyStateData(favoritematches);
            }
            setIsLoading("loaded");
        } else {
            mounted.current = true;
            setIsLoading("loading");
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [favMatchesUpdateCounter]);
    
    // Method used to refresh the live data automatically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setfavLiveMatchesUpdateCounter(prevCounter => prevCounter + 1);
        }, 10000);
    
        if (mounted.current) {
            const favoritematches = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata"));
            if (favoritematches) {
                const fixtureIds = favoritematches.map(item => ({ fixture_id: item.fixture_id }));
                FetchFixtureByIdMyFav(fixtureIds);
            }
        } else {
            mounted.current = true;
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [favLiveMatchesUpdateCounter]);
    
    // to be used in forming fixture details array
    const predictionsList = [];
    
    //forming the fixture details array
    for(let i = 0; i <my_state_data.length;i++){  
        let winning_team = "";
        let winning_odd = 0;

        let home_odd  = "";
        let draw_odd = "";
        let away_odd = "";

        if(my_state_data[i].percent_pred_home != null){
            home_odd  = my_state_data[i].percent_pred_home.slice(0, -1);
            draw_odd = my_state_data[i].percent_pred_draw.slice(0, -1);
            away_odd = my_state_data[i].percent_pred_away.slice(0, -1);  
        }
                
        //Decode halftime data stored as a json in mysql
        var scores_data = JSON.parse(my_state_data[i].scores);

        var halftime_data = "";
        var extratime_data = "";
        var penalty_data = "";

        if(my_state_data[i].scores != null){
            if(scores_data.halftime.home != null){
                halftime_data = '('+ scores_data.halftime.home + ' - ' + scores_data.halftime.away +')';
            }                

            if(scores_data.extratime.home != null){
                extratime_data = scores_data.extratime.home + ' - ' + scores_data.extratime.away;
            }

            if(scores_data.penalty.home != null){
                penalty_data = scores_data.penalty.home + ' - ' + scores_data.penalty.away;
            }
        }

        let computed_winning_preds = WinningTeamAndOdd(home_odd,draw_odd,away_odd,my_state_data[i]);

        winning_team = computed_winning_preds[0];
        winning_odd = computed_winning_preds[1];
    
        let probability_results = ProbabilityResults(my_state_data[i],winning_team);

        let livescores_results = DetermineLiveScores(my_state_data[i],isMobile);

        let livestatus = livescores_results[0];
        let livescores = livescores_results[1];

        let fixturesAverage = ComputeFixtureAverage(my_state_data[i].teams_perfomance_home_for,my_state_data[i].teams_perfomance_home_aganist,my_state_data[i].teams_perfomance_away_for,my_state_data[i].teams_perfomance_away_aganist,my_state_data[i].teams_games_played_home,my_state_data[i].teams_games_played_away);

        var sharedTabledetailsArray = [];

        sharedTabledetailsArray.push(
            {
                game_details:my_state_data[i],
                home_odd : home_odd,
                draw_odd: draw_odd,
                away_odd: away_odd,
                probability_results : probability_results,
                winning_odd : winning_odd,
                winning_team:winning_team,
                livestatus : livestatus,
                livescores : livescores,
                halftime_data : halftime_data,
                extratime_data : extratime_data,
                penalty_data:penalty_data,
                average : fixturesAverage
            }
        )
        
        //Array to render in the page, for fixture details
        predictionsList.push(
            <FixturesTableDisplay  props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
        )
    } 

    //wait for the dadta to load completly to be ready 
    if (loading === "loaded" && predictionsList.length > 0) { 
        return(
        <React.Fragment>
            <div className="desktop-container-resize sites-card">
                <RenderData renderPredictions = {predictionsList} isMobile= {isMobile}/>                 
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                /> 
                <br/>   
            </div>
        </React.Fragment>
        )  
    }else if(loading === "loaded" && predictionsList.length === 0){
        return (
            <React.Fragment>
                <div className="sites-card">
                    <DataNotFoundPage props = "You haven't selected any games yet. To get started, simply click on the game icon next to any game listed on the website."/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                    <br/>   
                </div>
            </React.Fragment>
        )
    }else if(loading ==="loading"){
        return <PreLoader/>
    }
   
}
export default MySelectedMatches;