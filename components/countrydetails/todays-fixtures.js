import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DetermineLiveScores from '../functions/determine_live_scores';
import FixturesTableDisplay from '../shared/fixtures_table_display';
import CountrysPageRenders from '../shared/renders/country-renders';
import { Adsense } from '@/components/shared/client-adsense';

function TodaysFixturesByCountry(props) {
    const router = useRouter();
    var predictionsList = [];

    for (let i = 0; i < props.todays_matches.length; i++) {
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

        // Get avg_goals - handle null value
        const avgGoals = fixture.predictions?.avg_goals !== null && fixture.predictions?.avg_goals !== undefined 
            ? fixture.predictions.avg_goals 
            : "-";

        // Get live scores status
        let livescores_results = DetermineLiveScores(fixture);
        let livestatus = livescores_results?.[0] || "";
        let livescores = livescores_results?.[1] || "";

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
            avg_goals: avgGoals
        }];

        // Form the array of Fixtures Table by country
        predictionsList.push(
            <FixturesTableDisplay props={sharedTabledetailsArray} key={fixture.fixture_id || i} />
        );
    }

    if (predictionsList.length > 0) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Today's Fixtures - {props.country_name}</h2>
                        </div>
                    </div>
                    <CountrysPageRenders 
                        url_name={router.pathname.substring(1)} 
                        renderPredictions={predictionsList} 
                    />
                    <br />
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7624930534"
                                style={{ display: "block" }}
                                layout="display"
                                format="auto"
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else {
        return <></>;
    }
}

export default TodaysFixturesByCountry;