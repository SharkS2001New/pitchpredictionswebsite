// components/shared/pages_match_predictions_details.js
import React, { useState, useEffect } from "react";
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

function PagesMatchPredictionDetails({ 
    initialData = [], 
    baseUrl = "" // Base URL for live updates
}) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [gamesfixtures, setGames] = useState(initialData);
    const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);
    const predictionsList = [];

    const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" };

    // Handle mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 760);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper function to build URL with pagination params for live updates
    const buildLiveUpdateUrl = () => {
        const path = router.pathname.substring(1);
        
        // Routes that don't need pagination
        if (path.includes("league/[country-name]/[football-prediction-for-league]") || 
            path.includes("country/[football-prediction-for-country]")) {
            return baseUrl;
        }
        
        // For live updates, fetch latest 100 records (like original)
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}start_index=0&end_index=100`;
    };

    // Live football updates per every 30 seconds on todays matches page and live fixtures page
    useEffect(() => {
        const path = router.pathname.substring(1);
        const needsLiveUpdates = path === "" || path === "football-predictions-today" || path === "live-football-predictions";
        
        if (!needsLiveUpdates) return;

        const intervalId = setInterval(() => {
            setLiveUpdateCounter(prev => prev + 1);
        }, 30000);

        return () => clearInterval(intervalId);
    }, [router.pathname]);

    // Fetch live updates when counter changes
    useEffect(() => {
        if (liveUpdateCounter === 0) return;

        const fetchLiveUpdates = async () => {
            try {
                const liveUpdateUrl = buildLiveUpdateUrl();
                
                const response = await fetch(liveUpdateUrl, {
                    headers: headers
                });

                const data = await response.json();

                if (data.status === true) {
                    setGames(data.data);
                }
            } catch (error) {
                console.error("Error fetching live updates:", error);
            }
        };

        fetchLiveUpdates();
    }, [liveUpdateCounter, router.pathname, baseUrl]);

    // If no data, return empty array
    if (!gamesfixtures || gamesfixtures.length === 0) {
        return [];
    }

    // Process fixtures - EXACT same as your original logic
    for(let i = 0; i < gamesfixtures.length; i++) {  
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

        if(gamesfixtures[i].percent_pred_home !== null){
            home_odd  = parseInt(gamesfixtures[i].percent_pred_home.slice(0, -1));
        }else{
            home_odd = "-";
        }

        if(gamesfixtures[i].percent_pred_draw !== null){
            draw_odd = parseInt(gamesfixtures[i].percent_pred_draw.slice(0, -1));
        }else{
            draw_odd = "-";
        }

        if(gamesfixtures[i].percent_pred_away !== null){
            away_odd = parseInt(gamesfixtures[i].percent_pred_away.slice(0, -1));  
        }else{
            away_odd = "-";
        }

        let ht_home_odd = "";
        let ht_draw_odd = "";
        let ht_away_odd = "";

        if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
            if(gamesfixtures[i].hf_percent_pred_home !== null){
                ht_home_odd  = parseInt(gamesfixtures[i].hf_percent_pred_home.slice(0, -1));
            }else{
                ht_home_odd = "-";
            }

            if(gamesfixtures[i].hf_percent_pred_draw !== null){
                ht_draw_odd = parseInt(gamesfixtures[i].hf_percent_pred_draw.slice(0, -1));
            }else{
                ht_draw_odd = "-";
            }

            if(gamesfixtures[i].hf_percent_pred_away !== null){
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

        let fixturesAverage = ComputeFixtureAverage(
            gamesfixtures[i].teams_perfomance_home_for,
            gamesfixtures[i].teams_perfomance_home_aganist,
            gamesfixtures[i].teams_perfomance_away_for,
            gamesfixtures[i].teams_perfomance_away_aganist,
            gamesfixtures[i].teams_games_played_home,
            gamesfixtures[i].teams_games_played_away
        )
     
        if(router.pathname.substring(1).includes("double-chance-predictions")) {
            computed_winning_preds =  DoubleChanceWinningTeamAndOdd(home_odd, draw_odd, away_odd, gamesfixtures[i], router.pathname.substring(1));

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = DoubleChanceProbabilityResults(gamesfixtures[i], winning_team, router.pathname.substring(1));

        } else if(router.pathname.substring(1).includes("predictions-under-over")) {
            computed_winning_preds =  UnderOverWinningTeamAndOdd(fixturesAverage, isMobile);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = UnderOverProbabilityResults(gamesfixtures[i], winning_team);

        } else if(router.pathname.substring(1).includes("predictions-both-to-score")) {

            probability_results = BothTeamsToScore(gamesfixtures[i]);
        
        } else if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
            ht_computed_winning_preds =  HalfTimeWinningTeamAndOdd(ht_home_odd, ht_draw_odd, ht_away_odd, gamesfixtures[i]);

            ht_winning_team = ht_computed_winning_preds[0];
            ht_winning_odd = ht_computed_winning_preds[1];

            ht_probability_results = HalfTimeProbabilityResults(gamesfixtures[i], ht_winning_team);

            computed_winning_preds =  WinningTeamAndOdd(home_odd, draw_odd, away_odd, gamesfixtures[i]);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = ProbabilityResults(gamesfixtures[i], winning_team);
        } else {
            computed_winning_preds =  WinningTeamAndOdd(home_odd, draw_odd, away_odd, gamesfixtures[i]);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = ProbabilityResults(gamesfixtures[i], winning_team);
        }            

        let livescores_results = DetermineLiveScores(gamesfixtures[i], isMobile);

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
            <FixturesTableDisplay props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
        );
    }  
    
    return predictionsList;
}

export default PagesMatchPredictionDetails;