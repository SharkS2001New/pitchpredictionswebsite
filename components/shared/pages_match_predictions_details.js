import React, {useEffect, useState,useRef} from "react";
import WinningTeamAndOdd from "../functions/determine_winning_team_and_odd";
import ProbabilityResults from "../functions/determine_probability_results";
import DetermineLiveScores from "../functions/determine_live_scores";
import FixturesTableDisplay from "./fixtures_table_display";
import ComputeFixtureAverage from "../functions/ComputefixtureAverage";
import { useRouter } from 'next/router'
import DoubleChanceWinningTeamAndOdd from "../functions/double_chance_winning_team_and_odd";
import DoubleChanceProbabilityResults from "../functions/double_chance_probability_results";
import UnderOverWinningTeamAndOdd from "../functions/under_over_winning_team_and_odd";
import UnderOverProbabilityResults from "../functions/under_over_probability_results";
import BothTeamsToScore from "../functions/BothTeamsToScore";
import HalfTimeWinningTeamAndOdd from "../functions/halftime_winning_team_and_odd"; 
import HalfTimeProbabilityResults from "../functions/halftime_probability_results";

function PagesMatchPredictionDetails(url) {
    const router = useRouter(); //access page link
    const [isMobile, setIsMobile] = useState(false); 
    const [endpointStatus,setEndPointStatus] = useState("");
    const [gamesfixtures, setGames] = useState([]); //defined as an array 
    const predictionsList = [];   
    const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);

    const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the api.pitchpredictions.com

    useEffect(()=>{ 
        if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
             //Determine screen size on mobile or desktop
             window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);

            // load first batch of 20 records
            firstBatch();                 
        }
    },[url]) //remember adding url helps the use effect hook to reload data on url change in order to update content

    //Live football updates per every 30 seconds on todays matches page and live fixtures page
    const mounted = useRef(false);

    useEffect(() => {
      if (router.pathname.substring(1) === "" || router.pathname.substring(1) === "football-predictions-today" || router.pathname.substring(1) === "live-football-predictions") {
        // Set an initial value for the counter
        let count = 0;
        // Set up an interval to update the counter every 30 seconds
        const intervalId = setInterval(() => {
          // Update the counter
          count++;
          // Update the liveCounter state with the new count value
          setLiveUpdateCounter(count);
        }, 30000);
    
        // Fetch data on mount only after the first render
        if (mounted.current) {
          getAllData(0, 100).then(data => {    
            if (data.status === true) {
              setEndPointStatus(data.message);
              setGames(data.data);
            } else {
              setEndPointStatus(data.message);
              setGames(data);
            }
          });
        } else {
          mounted.current = true;
        }
    
        // Return a cleanup function to clear the interval
        return () => clearInterval(intervalId);
      }
    }, [liveUpdateCounter]);
          

    //first batch is 0 - 20, 20 records only
    const firstBatch = async () => {
        getAllData(0,20).then(data => {
            if(data.status === true){
                setEndPointStatus(data.message);

                setGames(data.data);

                //if length of first batch reached 50, then run next batch
                if(data.data.length >20) {
                    fetchNextBatch();
                }
            }else{
                setEndPointStatus(data.message);

                setGames(data);
            }
        });
    };

    //fetch batch from 50, to n'th data which is simply the size of the fixtures being fetched
    const fetchNextBatch = async () => {
        getAllData(0, 850).then(data => {
          if(data.status === true) {
            setEndPointStatus(data.message);
            setGames(data.data);
          } else {
            setEndPointStatus(data.message);
            setGames(prevGames => [...prevGames]);
          }
        });       
      };
      

    //Fetch Data according to Url passed and process it
    async function getAllData(startIndex,endIndex) {
        let url_with_params  = "";

        //Please reform the url according to route to add the start index and the end index
        if(router.pathname.substring(1) == "football-predictions-tomorrow" || router.pathname.substring(1) == "[football-prediction-for-date]" || router.pathname.substring(1) == "football-predictions-weekend"){
        
            url_with_params = url+"&start_index="+startIndex+"&end_index="+endIndex;
        
        }else if(router.pathname.substring(1).includes("league/[country-name]/[football-prediction-for-league]") || router.pathname.substring(1).includes("country/[football-prediction-for-country]")){

            url_with_params = url;
        
        }else{
        
            url_with_params = url+"&start_index="+startIndex+"&end_index="+endIndex;
        }
        
        try {
            // Fetch fixtures 
            const response = await fetch(url_with_params,{
                headers: headers
            });

            const data = await response.json();
        
            return data;          

        } catch (error) {
            console.error(error);
            // Handle error here, e.g. show a message to the user
        }
    }

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }

    if(endpointStatus == "success"){
        //odds are less than predictions. So to avoid array overload. check the size of data using odd array           
        for(let i = 0; i <gamesfixtures.length;i++){  
            let winning_team = "";
            let winning_odd = 0;

            //Decode halftime data stored as a json in mysql
            var scores_data = JSON.parse(gamesfixtures[i].scores);
            var halftime_data = "";
            var extratime_data = "";
            var penalty_data = "";
            
            if(gamesfixtures[i].scores != null){
                if(scores_data.halftime != null) {
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
            }

            let home_odd = "";
            let draw_odd = "";
            let away_odd = "";

            if(gamesfixtures[i].percent_pred_home !==null){
                home_odd  = parseInt(gamesfixtures[i].percent_pred_home.slice(0, -1));
            }else{
                home_odd = "-";
            }

            if(gamesfixtures[i].percent_pred_draw !==null){
                draw_odd = parseInt(gamesfixtures[i].percent_pred_draw.slice(0, -1));
            }else{
                draw_odd = "-";
            }

            if(gamesfixtures[i].percent_pred_away !==null){
                away_odd = parseInt(gamesfixtures[i].percent_pred_away.slice(0, -1));  
            }else{
                away_odd = "-";
            }

            let ht_home_odd = "";
            let ht_draw_odd = "";
            let ht_away_odd = "";

            if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
                if(gamesfixtures[i].hf_percent_pred_home !==null){
                    ht_home_odd  = parseInt(gamesfixtures[i].hf_percent_pred_home.slice(0, -1));
                }else{
                    ht_home_odd = "-";
                }

                if(gamesfixtures[i].hf_percent_pred_draw !==null){
                    ht_draw_odd = parseInt(gamesfixtures[i].hf_percent_pred_draw.slice(0, -1));
                }else{
                    ht_draw_odd = "-";
                }

                if(gamesfixtures[i].hf_percent_pred_away !==null){
                    ht_away_odd = parseInt(gamesfixtures[i].hf_percent_pred_away.slice(0, -1));  
                }else{
                    ht_away_odd = "-";
                }
            }
        
            let computed_winning_preds = "";
            
            let probability_results = "";

            let ht_computed_winning_preds ="";
            let ht_probability_results = "";
            let ht_winning_team ="";
            let ht_winning_odd ="";

            let fixturesAverage = ComputeFixtureAverage(gamesfixtures[i].teams_perfomance_home_for,gamesfixtures[i].teams_perfomance_home_aganist,gamesfixtures[i].teams_perfomance_away_for,gamesfixtures[i].teams_perfomance_away_aganist,gamesfixtures[i].teams_games_played_home,gamesfixtures[i].teams_games_played_away)
         
            if(router.pathname.substring(1).includes("double-chance-predictions")) {
                computed_winning_preds =  DoubleChanceWinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesfixtures[i],router.pathname.substring(1));

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = DoubleChanceProbabilityResults(gamesfixtures[i],winning_team, router.pathname.substring(1));

            } else if(router.pathname.substring(1).includes("predictions-under-over")) {
                computed_winning_preds =  UnderOverWinningTeamAndOdd(fixturesAverage, isMobile);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = UnderOverProbabilityResults(gamesfixtures[i],winning_team);

            } else if(router.pathname.substring(1).includes("predictions-both-to-score")) {

                probability_results = BothTeamsToScore(gamesfixtures[i]);
            
            } else if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
                ht_computed_winning_preds =  HalfTimeWinningTeamAndOdd(ht_home_odd,ht_draw_odd,ht_away_odd,gamesfixtures[i]);

                ht_winning_team = ht_computed_winning_preds[0];
                ht_winning_odd = ht_computed_winning_preds[1];

                ht_probability_results = HalfTimeProbabilityResults(gamesfixtures[i],ht_winning_team);

                computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesfixtures[i]);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = ProbabilityResults(gamesfixtures[i],winning_team);
            } else {
                computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesfixtures[i]);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = ProbabilityResults(gamesfixtures[i],winning_team);
            }            

            let livescores_results = DetermineLiveScores(gamesfixtures[i],isMobile);

            let livestatus = livescores_results[0];
            let livescores = livescores_results[1];

            var sharedTabledetailsArray = [];

            sharedTabledetailsArray.push(
                {
                    game_details: gamesfixtures[i],
                    home_odd: home_odd,
                    draw_odd: draw_odd,
                    away_odd: away_odd,
                    probability_results: probability_results,
                    winning_odd: winning_odd,
                    winning_team: winning_team,
                    livestatus: livestatus,
                    livescores: livescores,
                    halftime_data: halftime_data,
                    extratime_data: extratime_data,
                    penalty_data: penalty_data,
                    average: fixturesAverage,
                    // If it's halftime/fulltime page
                    ...(router.pathname.substring(1).includes("predictions-halftime-fulltime") && {
                        ht_home_odd: ht_home_odd,
                        ht_draw_odd: ht_draw_odd,
                        ht_away_odd: ht_away_odd,
                        ht_probability_results: ht_probability_results,
                        ht_winning_odd: ht_winning_odd,
                        ht_winning_team: ht_winning_team,
                    }),
                }
            );
                
            predictionsList.push(
                <FixturesTableDisplay  props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
            )
        }  
    }else{
        predictionsList.push({endpointStatus, isMobile});
    }
    
    return predictionsList;
}

export default PagesMatchPredictionDetails;