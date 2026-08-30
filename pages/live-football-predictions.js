// pages/live-football-predictions.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import fetchJsonWithRetry from "../components/functions/fetch_with_retry";
import LivescoresContent from "../components/seo-content/mainpages/live-football-predictions";

function LiveFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate 
}) {
    const [allData, setAllData] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(20); // Start after the first 20
    const [hasMore, setHasMore] = useState(true);
    const [loadTrigger, setLoadTrigger] = useState(0); // Used to trigger loads from child components

    // This function will be called when "Show More" is clicked
    const loadMoreData = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = Math.min(currentStartIndex + chunkSize - 1, 850);
        
        try {
            const chunkUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=${startIndex}&end_index=${endIndex}`;
            const chunkData = await fetchJsonWithRetry(chunkUrl, {
                headers: { "Origin": "https://www.pitchpredictions.com", "Authorization": `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}` }
            });
            
            if (chunkData.status === true && chunkData.data && chunkData.data.length > 0) {
                // Append new data to existing data
                setAllData(prevData => [...prevData, ...chunkData.data]);
                setCurrentStartIndex(endIndex + 1);
                
                // Check if we've reached the maximum (850) or got less than requested
                if (endIndex >= 850 || chunkData.data.length < chunkSize) {
                    setHasMore(false);
                }
            } else {
                // No more data available
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more live data:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // useEffect that watches loadTrigger to trigger data loading
    useEffect(() => {
        if (loadTrigger > 0) {
            loadMoreData();
        }
    }, [loadTrigger]);

    // Function to be called from child components
    const handleLoadMore = () => {
        setLoadTrigger(prev => prev + 1);
    };

    // Keep live scores fresh on the livescores page
    useEffect(() => {
        const refreshLiveData = async () => {
            const endIndex = Math.max(currentStartIndex - 1, 20);
            const refreshUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=${endIndex}`;

            try {
                const livePayload = await fetchJsonWithRetry(refreshUrl, {
                    headers: { "Origin": "https://www.pitchpredictions.com", "Authorization": `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}` }
                });

                if (livePayload.status === true && Array.isArray(livePayload.data)) {
                    setAllData(livePayload.data);
                }
            } catch (refreshError) {
                console.error("Error refreshing live matches:", refreshError);
            }
        };

        const intervalId = setInterval(refreshLiveData, 20000);
        return () => clearInterval(intervalId);
    }, [baseUrl, todaysDate, currentStartIndex]);

    // Show preloader while server is fetching data
    if (!initialData && !error) {
        return <PreLoader />;
    }

    // Handle error state
    if (endpointStatus === "error" || error) {
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
    }
    
    // Process the data - PagesMatchPredictionDetails now receives allData
    const renderPredictions = PagesMatchPredictionDetails({ 
        gamesData: allData,
        onLoadMore: handleLoadMore,
        isLoadingMore: loadingMore,
        hasMore: hasMore
    });
    
    // Handle empty data state
    if (renderPredictions.length === 0 && !loadingMore && !initialData) {
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
    }
    
    // Render the page with data
    return (
        <div className="sites-card">
            {/*
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
            */}
            
            <RenderData 
                renderPredictions={renderPredictions}
                onLoadMore={handleLoadMore}
                isLoadingMore={loadingMore}
                hasMore={hasMore}
            />
            
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
    );
}

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    
    // Base URL for live games
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_live_games";
    
    // First batch: ONLY fetch 0-20 records on server
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    // Record start time to ensure minimum loading time if needed
    const startTime = Date.now();
    
    try {
        // Fetch first batch only - no full batch fetch on server
        const data = await fetchJsonWithRetry(firstBatchUrl, {
            headers: { "Origin": "https://www.pitchpredictions.com", "Authorization": `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}` },
            retries: 2,
            timeoutMs: 7000
        });
        
        // Check API response structure
        if (data.status === true) {
            // Calculate elapsed time
            const elapsedTime = Date.now() - startTime;
            
            // If fetch was too fast, add a small delay to show preloader (optional)
            if (elapsedTime < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
            }
            
            return {
                props: {
                    initialData: data.data || [],
                    endpointStatus: "success",
                    error: null,
                    baseUrl: baseUrl,
                    todaysDate: todaysDate
                }
            };
        } else {
            // API returned status: false
            return {
                props: {
                    initialData: [],
                    endpointStatus: "error",
                    error: data.message || "Failed to load live matches",
                    baseUrl: baseUrl,
                    todaysDate: todaysDate
                }
            };
        }
    } catch (error) {
        console.error('Error fetching live predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: baseUrl,
                todaysDate: todaysDate
            }
        };
    }
}

export default LiveFixtures;