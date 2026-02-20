// pages/my-selected-matches.js
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import RenderData from "../components/shared/render_fixtures_data";
import WinningTeamAndOdd from "../components/functions/determine_winning_team_and_odd";
import ProbabilityResults from "../components/functions/determine_probability_results";
import DetermineLiveScores from "../components/functions/determine_live_scores";
import ComputeFixtureAverage from "../components/functions/ComputefixtureAverage";
import DataNotFoundPage from "../components/includes/datanotfound";
import PreLoader from "../components/includes/loader";
import FixturesTableDisplay from "../components/shared/fixtures_table_display";
import FetchFixtureByIdMyFav from "../components/functions/FetchfixturesById-Myfavourites";

function MySelectedMatches() {    
    const router = useRouter();
    const [myStateData, setMyStateData] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [favMatchesUpdateCounter, setFavMatchesUpdateCounter] = useState(0);
    const [favLiveMatchesUpdateCounter, setFavLiveMatchesUpdateCounter] = useState(0);
    const [loading, setLoading] = useState("loading");
    
    const mounted = useRef(false);
    
    // Calculate the width on window change detection
    const detectWindowSize = () => {
        setIsMobile(window.innerWidth < 760);
    };
    
    useEffect(() => {
        if (router.isReady) {
            detectWindowSize();
            window.addEventListener('resize', detectWindowSize);
        }
    
        return () => {
            window.removeEventListener('resize', detectWindowSize);
        };
    }, [router.isReady]);
    
    // Method used to refresh the data automatically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFavMatchesUpdateCounter(prevCounter => prevCounter + 1);
        }, 500);
    
        if (mounted.current) {
            try {
                const favoriteMatches = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata"));
                if (favoriteMatches && Array.isArray(favoriteMatches)) {
                    setMyStateData(favoriteMatches);
                } else {
                    setMyStateData([]);
                }
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
                setMyStateData([]);
            }
            setLoading("loaded");
        } else {
            mounted.current = true;
            setLoading("loading");
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [favMatchesUpdateCounter]);
    
    // Method used to refresh the live data automatically
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFavLiveMatchesUpdateCounter(prevCounter => prevCounter + 1);
        }, 10000);
    
        if (mounted.current) {
            try {
                const favoriteMatches = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata"));
                if (favoriteMatches && Array.isArray(favoriteMatches) && favoriteMatches.length > 0) {
                    const fixtureIds = favoriteMatches.map(item => ({ fixture_id: item.fixture_id }));
                    FetchFixtureByIdMyFav(fixtureIds);
                }
            } catch (error) {
                console.error('Error fetching live data for favorites:', error);
            }
        } else {
            mounted.current = true;
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [favLiveMatchesUpdateCounter]);
    
    // Process the data to create predictions list
    const processPredictions = () => {
        if (!myStateData || myStateData.length === 0) {
            return [];
        }
        
        const predictionsList = [];
        
        for(let i = 0; i < myStateData.length; i++) {
            const match = myStateData[i];
            
            // Skip if match data is invalid
            if (!match) continue;
            
            let winning_team = "";
            let winning_odd = 0;

            let home_odd = "";
            let draw_odd = "";
            let away_odd = "";

            if (match.percent_pred_home != null) {
                home_odd = match.percent_pred_home.slice(0, -1);
                draw_odd = match.percent_pred_draw.slice(0, -1);
                away_odd = match.percent_pred_away.slice(0, -1);  
            }
                    
            // Decode halftime data stored as a json in mysql
            let halftime_data = "";
            let extratime_data = "";
            let penalty_data = "";
            
            if (match.scores != null) {
                try {
                    const scores_data = JSON.parse(match.scores);
                    
                    if (scores_data?.halftime?.home != null) {
                        halftime_data = '(' + scores_data.halftime.home + ' - ' + scores_data.halftime.away + ')';
                    }                

                    if (scores_data?.extratime?.home != null) {
                        extratime_data = scores_data.extratime.home + ' - ' + scores_data.extratime.away;
                    }

                    if (scores_data?.penalty?.home != null) {
                        penalty_data = scores_data.penalty.home + ' - ' + scores_data.penalty.away;
                    }
                } catch (error) {
                    console.error('Error parsing scores data:', error);
                }
            }

            const computedWinningPreds = WinningTeamAndOdd(home_odd, draw_odd, away_odd, match);

            winning_team = computedWinningPreds[0];
            winning_odd = computedWinningPreds[1];
        
            const probabilityResults = ProbabilityResults(match, winning_team);

            const livescoresResults = DetermineLiveScores(match, isMobile);

            const livestatus = livescoresResults[0];
            const livescores = livescoresResults[1];

            const fixturesAverage = ComputeFixtureAverage(
                match.teams_perfomance_home_for,
                match.teams_perfomance_home_aganist,
                match.teams_perfomance_away_for,
                match.teams_perfomance_away_aganist,
                match.teams_games_played_home,
                match.teams_games_played_away
            );

            const sharedTableDetailsArray = [{
                game_details: match,
                home_odd: home_odd,
                draw_odd: draw_odd,
                away_odd: away_odd,
                probability_results: probabilityResults,
                winning_odd: winning_odd,
                winning_team: winning_team,
                livestatus: livestatus,
                livescores: livescores,
                halftime_data: halftime_data,
                extratime_data: extratime_data,
                penalty_data: penalty_data,
                average: fixturesAverage
            }];
            
            // Add to predictions list
            predictionsList.push(
                <FixturesTableDisplay 
                    props={sharedTableDetailsArray} 
                    key={match.fixture_id || i} 
                    isMobile={isMobile}
                />
            );
        }
        
        return predictionsList;
    };

    const predictionsList = processPredictions();

    // Render based on loading state and data availability
    if (loading === "loading") {
        return <PreLoader />;
    } else if (loading === "loaded" && predictionsList.length === 0) {
        return (
            <>
                <div className="sites-card">
                    <DataNotFoundPage props="You haven't selected any games yet. To get started, simply click on the game icon next to any game listed on the website."/>
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
            </>
        );
    } else if (loading === "loaded" && predictionsList.length > 0) {
        return (
            <>
                <div className="desktop-container-resize sites-card">
                    <RenderData renderPredictions={predictionsList} isMobile={isMobile} />                 
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
            </>
        );
    }
    
    return null;
}

export default MySelectedMatches;