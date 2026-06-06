// pages/football-predictions-today/finished.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterTodaysFinishedOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/football-predictions-today/finished/filter-pred1x2-ov-un-dc-ht-ft";

function TodaysFinishedFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate 
}){     
    const router = useRouter();
    const [allData, setAllData] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(20); // Start after the first 20
    const [hasMore, setHasMore] = useState(true);
    const [loadTrigger, setLoadTrigger] = useState(0);

    // Load more data when "Show More" is clicked
    const loadMoreData = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = Math.min(currentStartIndex + chunkSize - 1, 850);
        
        try {
            const chunkUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
            const response = await fetch(chunkUrl, {
                headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const chunkData = await response.json();
            
            if (chunkData.status === true && chunkData.data && chunkData.data.length > 0) {
                // Append new data to existing data
                setAllData(prevData => [...prevData, ...chunkData.data]);
                setCurrentStartIndex(endIndex + 1);
                
                // Check if we've reached the maximum or got less than requested
                if (endIndex >= 850 || chunkData.data.length < chunkSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Trigger data loading when loadTrigger changes
    useEffect(() => {
        if (loadTrigger > 0) {
            loadMoreData();
        }
    }, [loadTrigger]);

    // Function to be called from child components
    const handleLoadMore = () => {
        setLoadTrigger(prev => prev + 1);
    };

    // Show preloader while server is fetching data
    if (!initialData && !error) {
        return <PreLoader />;
    }

    // Format today's date for display
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return dateString;
        }
    };

    // Handle error state
    if (endpointStatus === "error" || error) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props="We don't have any finished matches to show you right now, please try again later"/>
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
        );
    }
    
    // Process the data - Pass allData and load more props
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
                <DataNotFoundPage props={`No finished matches available for ${formatDisplayDate(todaysDate)}`}/>
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
        );
    }
    
    // Render the page with data
    return (
        <div className="sites-card">
            <div className="container">
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
                        <FilterTodaysFinishedOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
                    </div>
                    <div className="col-md-1 col-1"></div>
                </div>
            </div>
            
            <RenderData 
                renderPredictions={renderPredictions}
                onLoadMore={handleLoadMore}
                isLoadingMore={loadingMore}
                hasMore={hasMore}
            />
            
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
    );
}

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    
    // Base URL for today's completed games
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_todays_completed_games";
    
    // First batch: ONLY fetch 0-20 records on server (NO full batch)
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Fetch first batch only
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
        
        // Check API response structure
        if (data.status === true) {
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
                    error: data.message || "Failed to load today's completed games",
                    baseUrl: baseUrl,
                    todaysDate: todaysDate
                }
            };
        }
    } catch (error) {
        console.error('Error fetching today\'s completed games:', error);
        
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

export default TodaysFinishedFixtures;