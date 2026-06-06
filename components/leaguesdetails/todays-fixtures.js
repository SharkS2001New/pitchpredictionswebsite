import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import DetermineLiveScores from '../functions/determine_live_scores';
import FixturesTableDisplay from '../shared/fixtures_table_display';
import LeaguesPageRender from '../shared/renders/leagues-render';
import { Adsense } from "@/components/shared/client-adsense";

function TodaysFixturesByLeague(props) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything during SSR to avoid hydration mismatch
    if (!mounted) {
        return null;
    }
 
    var predictionsList = [];

    for(let i = 0; i < props.todays_matches.length; i++){  
        const fixture = props.todays_matches[i];
        
        // Safely extract halftime, extratime, penalty data from new API structure
        const halftimeData = fixture.score?.half_time;
        const halftime_data = (halftimeData?.home !== null && halftimeData?.home !== undefined && 
                               halftimeData?.away !== null && halftimeData?.away !== undefined)
            ? `(${halftimeData.home} - ${halftimeData.away})` 
            : "";
        
        const extratimeData = fixture.score?.extra_time;
        const extratime_data = (extratimeData?.home !== null && extratimeData?.home !== undefined && 
                                 extratimeData?.away !== null && extratimeData?.away !== undefined)
            ? `${extratimeData.home} - ${extratimeData.away}`
            : "";
        
        const penaltyData = fixture.score?.penalties;
        const penalty_data = (penaltyData?.home !== null && penaltyData?.home !== undefined && 
                              penaltyData?.away !== null && penaltyData?.away !== undefined)
            ? `${penaltyData.home} - ${penaltyData.away}`
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
        let livescores_results = DetermineLiveScores(fixture);
        let livestatus = livescores_results?.[0] || "";
        let livescores = livescores_results?.[1] || "";

        // Get avg_goals - handle null value
        const avgGoals = fixture.predictions?.avg_goals !== null && fixture.predictions?.avg_goals !== undefined 
            ? fixture.predictions.avg_goals 
            : "-";

        // Check if we're on halftime-fulltime page
        const isHalftimeFulltimePage = router.pathname.substring(1).includes("predictions-halftime-fulltime");
        
        // Only include half-time predictions if we're on the HT/FT page AND predictions.half_time exists
        const shouldIncludeHalfTime = isHalftimeFulltimePage && fixture.predictions?.half_time;

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
            
        // Form the array of Fixtures Table by league
        predictionsList.push(
            <FixturesTableDisplay props={sharedTabledetailsArray} key={fixture.fixture_id || i} />
        );
    } 

    if(predictionsList.length > 0){
        return(
            <React.Fragment>
                <div className="sites-card mb-2">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Today's Fixtures - {props.country_name}, {props.league_name}</h2>
                        </div>
                    </div>   
                    {/* Display fixtures for todays matches for selected league */}
                    <LeaguesPageRender 
                        url_name={router.pathname.substring(1)} 
                        renderPredictions={predictionsList} 
                    />
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="7624930534"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                </div> 
            </React.Fragment>
        );
    } else {
        return null;
    }
}

export default TodaysFixturesByLeague;