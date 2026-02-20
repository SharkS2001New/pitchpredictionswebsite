// pages/live-football-predictions.js
import React from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterLiveOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/live-football-predictions/filter-pred1x2-ov-un-dc-ht-ft";
import LivescoresContent from "../components/seo-content/mainpages/live-football-predictions";
import Head from 'next/head';

function LiveFixtures({ 
    initialData, 
    endpointStatus, 
    endpointMessage, 
    error,
    baseUrl,
    todaysDate 
}) {
    const router = useRouter();

    // Call the predictions component with props (same pattern as homepage)
    var renderPredictions = PagesMatchPredictionDetails({ 
        initialData, 
        endpointStatus, 
        endpointMessage, 
        error,
        baseUrl: baseUrl,
        dateParam: todaysDate // Pass date for any future filtering needs
    });

    // If data is completely loaded. Display, Else, Show preloader
    if(renderPredictions[0]?.endpointStatus === "loading" || renderPredictions[0]?.endpointStatus === ""){
        return(
            <PreLoader/>
        );
    } else if(renderPredictions[0]?.endpointStatus === "error" || error){
        return (
            <div className="sites-card">
                <DataNotFoundPage props="No live matches to show you at the moment, please try again later"/>
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                /> 
                <br/>   
                <div className="">
                    <div className="container">
                        <LivescoresContent/>
                    </div>
                </div>
            </div>
        );
    } else if(renderPredictions.length > 0){
        return(
            <>
                <Head>
                    <title>Live Football Predictions 2026 | Today's Live Scores & Tips | PitchPredictions</title>
                    <meta name="description" content="Get real-time live football predictions, scores and betting tips. Live match analysis for ongoing games with E-E-A-T compliant insights. Updated in real-time." />
                    <meta name="keywords" content="live football predictions, live scores, betting tips live, in-play predictions, live match analysis" />
                </Head>
                
                <div className="sites-card">
                    <div className="container-fluid">                        
                        <div className="row" style={{backgroundColor: "#edf3f5"}}>
                            <div className="col-md-3 col-2"></div>
                                <div className="col-md-7 col-12">
                                    <FilterTodaysMatchesLiveUpcomingFinished url_filter={router.pathname.substring(1)} />
                                </div>
                            <div className="col-md-2 col-1"></div>
                        </div>
                        <div className="row" style={{backgroundColor: "#edf3f5"}}>
                            <div className="col-md-1 col-2"></div>
                            <div className="col-md-10 col-12">
                                <FilterLiveOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
                            </div>
                            <div className="col-md-1 col-1"></div>
                        </div>
                    </div>
                    
                    <RenderData renderPredictions={renderPredictions}/>
                    
                    <br />
                    
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                    
                    <br/>   
                    
                    <div className="">
                        <div className="container">
                            <LivescoresContent/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    
    // Base URL for live games (matches the original endpoint)
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_live_games";
    
    // First batch: 0-20 records (like homepage pattern)
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Fetch first batch
        const response = await fetch(firstBatchUrl, {
            headers: { 
                "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let finalData = data.status ? data.data : [];
        let finalStatus = data.status ? "success" : "error";
        let finalMessage = data.message || "";
        
        // Check if we need to fetch the full batch (if more than 20 records)
        if (data.status && data.data && data.data.length > 20) {
            try {
                // Fetch full batch: 0-850 records (or appropriate limit for live games)
                const fullBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=850`;
                
                const fullResponse = await fetch(fullBatchUrl, {
                    headers: { 
                        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
                    }
                });
                
                const fullData = await fullResponse.json();
                
                if (fullData.status === true) {
                    finalData = fullData.data;
                    finalMessage = fullData.message;
                    finalStatus = "success";
                }
            } catch (batchError) {
                console.error('Error fetching full batch for live games:', batchError);
                // If full batch fails, keep the first batch data
            }
        }
        
        return {
            props: {
                initialData: finalData,
                endpointStatus: finalStatus,
                endpointMessage: finalMessage,
                error: null,
                baseUrl: baseUrl,
                todaysDate: todaysDate
            }
        };
    } catch (error) {
        console.error('Error fetching live predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                endpointMessage: "Failed to load live predictions",
                error: error.message,
                baseUrl: baseUrl,
                todaysDate: todaysDate
            }
        };
    }
}

export default LiveFixtures;