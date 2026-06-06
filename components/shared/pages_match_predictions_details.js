// components/shared/pages_match_predictions_details.js
import React from "react";
import DetermineLiveScores from "../functions/determine_live_scores";
import dedupeFixturesById from "../functions/dedupe_fixtures_by_id";
import FixturesTableDisplay from "./fixtures_table_display";
import { useRouter } from 'next/router'

function PagesMatchPredictionDetails({ 
    gamesData = [], 
    isLoading = false, 
    loadedCount = 0, 
    totalCount = 850,
    isMobile = false,
    marketRoute = null,
}) {
    const router = useRouter();
    const routeForMarket = marketRoute || router.pathname.substring(1);
    const predictionsList = [];
    const uniqueGamesData = dedupeFixturesById(gamesData);

    if(uniqueGamesData.length > 0){
        for(let i = 0; i < uniqueGamesData.length; i++){  
            const fixture = uniqueGamesData[i];

            // Safely extract halftime data - check if values exist and are not null
            const halftimeData = fixture.score?.half_time;
            const halftime_data = (halftimeData?.home !== null && halftimeData?.home !== undefined && 
                                   halftimeData?.away !== null && halftimeData?.away !== undefined)
                ? `(${halftimeData.home} - ${halftimeData.away})` 
                : "";
            
            // Safely extract extratime data
            const extratimeData = fixture.score?.extra_time;
            const extratime_data = (extratimeData?.home !== null && extratimeData?.home !== undefined && 
                                     extratimeData?.away !== null && extratimeData?.away !== undefined)
                ? `${extratimeData.home} - ${extratimeData.away}`
                : "";
            
            // Safely extract penalty data
            const penaltyData = fixture.score?.penalties;
            const penalty_data = (penaltyData?.home !== null && penaltyData?.home !== undefined && 
                                  penaltyData?.away !== null && penaltyData?.away !== undefined)
                ? `${penaltyData.home} - ${penaltyData.away}`
                : "";

            // Safely get prediction probabilities with optional chaining
            const homeProb = fixture.predictions?.["1x2"]?.home?.toString() || "-";
            const drawProb = fixture.predictions?.["1x2"]?.draw?.toString() || "-";
            const awayProb = fixture.predictions?.["1x2"]?.away?.toString() || "-";
            
            // Safely get half-time predictions
            const ht_home_odd = fixture.predictions?.half_time?.home?.toString() || "-";
            const ht_draw_odd = fixture.predictions?.half_time?.draw?.toString() || "-";
            const ht_away_odd = fixture.predictions?.half_time?.away?.toString() || "-";

            // Get live scores status
            let livescores_results = DetermineLiveScores(fixture, isMobile);
            let livestatus = livescores_results?.[0] || "";
            let livescores = livescores_results?.[1] || "";

            // Check if we're on halftime-fulltime page
            const isHalftimeFulltimePage = routeForMarket.includes("predictions-halftime-fulltime");
            
            // Only include half-time predictions if we're on the HT/FT page AND predictions.half_time exists
            const shouldIncludeHalfTime = isHalftimeFulltimePage && fixture.predictions?.half_time;

            // Get avg_goals - handle null value
            const avgGoals = fixture.predictions?.avg_goals !== null && fixture.predictions?.avg_goals !== undefined 
                ? fixture.predictions.avg_goals 
                : "-";

            // Pass the raw fixture data directly to FixturesTableDisplay
            var sharedTabledetailsArray = [{
                game_details: fixture,
                home_odd: homeProb,
                draw_odd: drawProb,
                away_odd: awayProb,
                livestatus: livestatus,
                livescores: livescores,
                halftime_data: halftime_data,
                extratime_data: extratime_data,
                penalty_data: penalty_data,
                avg_goals: avgGoals,
                // Only include half-time predictions if they exist and we're on the right page
                ...(shouldIncludeHalfTime && {
                    ht_home_odd: ht_home_odd,
                    ht_draw_odd: ht_draw_odd,
                    ht_away_odd: ht_away_odd,
                }),
            }];
                
            predictionsList.push(
                <FixturesTableDisplay
                    props={sharedTabledetailsArray}
                    key={`fixture-${fixture.fixture_id}-${i}`}
                    isMobile={isMobile}
                    marketRoute={marketRoute}
                />
            );
        }  
    }
    
    return predictionsList;
}

export default PagesMatchPredictionDetails;