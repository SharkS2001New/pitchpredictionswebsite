// components/shared/pages_match_predictions_details.js
import React from "react";
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
    gamesData = [], 
    isLoading = false, 
    loadedCount = 0, 
    totalCount = 850,
    isMobile = false // Receive isMobile as a prop
}) {
    const router = useRouter();
    const predictionsList = [];   

    // No loading indicator - silent loading
    // Just show whatever data we have, even if loading

    if(gamesData.length > 0){
        for(let i = 0; i < gamesData.length; i++){  
            let winning_team = "";
            let winning_odd = 0;

            //Decode halftime data stored as a json in mysql
            var scores_data = JSON.parse(gamesData[i].scores);
            var halftime_data = "";
            var extratime_data = "";
            var penalty_data = "";
            
            if(gamesData[i].scores != null){
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

            if(gamesData[i].percent_pred_home !==null){
                home_odd  = parseInt(gamesData[i].percent_pred_home.slice(0, -1));
            }else{
                home_odd = "-";
            }

            if(gamesData[i].percent_pred_draw !==null){
                draw_odd = parseInt(gamesData[i].percent_pred_draw.slice(0, -1));
            }else{
                draw_odd = "-";
            }

            if(gamesData[i].percent_pred_away !==null){
                away_odd = parseInt(gamesData[i].percent_pred_away.slice(0, -1));  
            }else{
                away_odd = "-";
            }

            let ht_home_odd = "";
            let ht_draw_odd = "";
            let ht_away_odd = "";

            if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
                if(gamesData[i].hf_percent_pred_home !==null){
                    ht_home_odd  = parseInt(gamesData[i].hf_percent_pred_home.slice(0, -1));
                }else{
                    ht_home_odd = "-";
                }

                if(gamesData[i].hf_percent_pred_draw !==null){
                    ht_draw_odd = parseInt(gamesData[i].hf_percent_pred_draw.slice(0, -1));
                }else{
                    ht_draw_odd = "-";
                }

                if(gamesData[i].hf_percent_pred_away !==null){
                    ht_away_odd = parseInt(gamesData[i].hf_percent_pred_away.slice(0, -1));  
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
                gamesData[i].teams_perfomance_home_for,
                gamesData[i].teams_perfomance_home_aganist,
                gamesData[i].teams_perfomance_away_for,
                gamesData[i].teams_perfomance_away_aganist,
                gamesData[i].teams_games_played_home,
                gamesData[i].teams_games_played_away
            )
         
            if(router.pathname.substring(1).includes("double-chance-predictions")) {
                computed_winning_preds =  DoubleChanceWinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesData[i],router.pathname.substring(1));

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = DoubleChanceProbabilityResults(gamesData[i],winning_team, router.pathname.substring(1));

            } else if(router.pathname.substring(1).includes("predictions-under-over")) {
                computed_winning_preds =  UnderOverWinningTeamAndOdd(fixturesAverage, isMobile);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = UnderOverProbabilityResults(gamesData[i],winning_team);

            } else if(router.pathname.substring(1).includes("predictions-both-to-score")) {

                probability_results = BothTeamsToScore(gamesData[i]);
            
            } else if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
                ht_computed_winning_preds =  HalfTimeWinningTeamAndOdd(ht_home_odd,ht_draw_odd,ht_away_odd,gamesData[i]);

                ht_winning_team = ht_computed_winning_preds[0];
                ht_winning_odd = ht_computed_winning_preds[1];

                ht_probability_results = HalfTimeProbabilityResults(gamesData[i],ht_winning_team);

                computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesData[i]);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = ProbabilityResults(gamesData[i],winning_team);
            } else {
                computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,gamesData[i]);

                winning_team = computed_winning_preds[0];
                winning_odd = computed_winning_preds[1];

                probability_results = ProbabilityResults(gamesData[i],winning_team);
            }            

            let livescores_results = DetermineLiveScores(gamesData[i],isMobile);

            let livestatus = livescores_results[0];
            let livescores = livescores_results[1];

            var sharedTabledetailsArray = [];

            sharedTabledetailsArray.push(
                {
                    game_details: gamesData[i],
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
    }
    
    return predictionsList;
}

export default PagesMatchPredictionDetails;