// components/shared/pages_match_predictions_details.js
import React from "react";
import DetermineLiveScores from "../functions/determine_live_scores";
import FixturesTableDisplay from "./fixtures_table_display";
import { useRouter } from 'next/router'

function PagesMatchPredictionDetails({ 
    gamesData = [], 
    isLoading = false, 
    loadedCount = 0, 
    totalCount = 850,
    isMobile = false
}) {
    const router = useRouter();
    const predictionsList = [];   

    if(gamesData.length > 0){
        for(let i = 0; i < gamesData.length; i++){  
            const fixture = gamesData[i];

            // Extract halftime, extratime, penalty data from new API structure
            const halftime_data = fixture.score?.half_time?.home !== null && fixture.score?.half_time?.away !== null 
                ? `(${fixture.score.half_time.home} - ${fixture.score.half_time.away})` 
                : "";
            
            const extratime_data = fixture.score?.extra_time?.home !== null && fixture.score?.extra_time?.away !== null
                ? `${fixture.score.extra_time.home} - ${fixture.score.extra_time.away}`
                : "";
            
            const penalty_data = fixture.score?.penalties?.home !== null && fixture.score?.penalties?.away !== null
                ? `${fixture.score.penalties.home} - ${fixture.score.penalties.away}`
                : "";

            // Get prediction probabilities directly from API
            const homeProb = fixture.predictions?.["1x2"]?.home?.toString() || "-";
            const drawProb = fixture.predictions?.["1x2"]?.draw?.toString() || "-";
            const awayProb = fixture.predictions?.["1x2"]?.away?.toString() || "-";
            
            // Get half-time predictions if on HT/FT page
            const ht_home_odd = fixture.predictions?.half_time?.home?.toString() || "-";
            const ht_draw_odd = fixture.predictions?.half_time?.draw?.toString() || "-";
            const ht_away_odd = fixture.predictions?.half_time?.away?.toString() || "-";

            // Get live scores status
            let livescores_results = DetermineLiveScores(fixture, isMobile);
            let livestatus = livescores_results[0];
            let livescores = livescores_results[1];

            // Pass the raw fixture data directly to FixturesTableDisplay
            var sharedTabledetailsArray = [{
                game_details: fixture, // Pass raw API data directly
                home_odd: homeProb,
                draw_odd: drawProb,
                away_odd: awayProb,
                livestatus: livestatus,
                livescores: livescores,
                halftime_data: halftime_data,
                extratime_data: extratime_data,
                penalty_data: penalty_data,
                avg_goals: fixture.predictions?.avg_goals || "-",
                // Include half-time predictions if needed
                ...(router.pathname.substring(1).includes("predictions-halftime-fulltime") && {
                    ht_home_odd: ht_home_odd,
                    ht_draw_odd: ht_draw_odd,
                    ht_away_odd: ht_away_odd,
                }),
            }];
                
            predictionsList.push(
                <FixturesTableDisplay props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
            );
        }  
    }
    
    return predictionsList;
}

export default PagesMatchPredictionDetails;