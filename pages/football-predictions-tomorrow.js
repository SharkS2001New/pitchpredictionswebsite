// pages/football-predictions-tomorrow.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import FormatedDate from "../components/functions/format_date_function";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions-tomorrow/filter-pred1x2-ov-un-dc-ht-ft";
import TomorrowFootballPredictionsContent from "../components/seo-content/mainpages/football-predictions-tomorrow";

function TomorrowFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    tomorrowsDate 
}) {
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
            const chunkUrl = `${baseUrl}?fixture_date=${tomorrowsDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
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
    if (typeof window === 'undefined' || (!initialData && !error)) {
        return <PreLoader />;
    }

    // Format tomorrow's date for display
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
                <DataNotFoundPage props="We don't have any matches to show you right now, please try again later"/>
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />
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
                <DataNotFoundPage props={`No matches available for ${formatDisplayDate(tomorrowsDate)}`}/>
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />
            </div>
        );
    }
    
    // Render the page with data
    return (
        <div className="sites-card">
            <div className="container-fluid">
                <div className="row" style={{backgroundColor: "#edf3f5"}}>
                    <div className="col-md-1 col-2"></div>
                    <div className="col-md-10 col-12">
                        <FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
            
            <div className="">
                <div className="container">
                    <TomorrowFootballPredictionsContent/>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps() {
    const tomorrowsDate = FormatedDate(1);
    
    // Base URL for fetching fixtures by date
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_fixtures_by_date";
    
    // First batch: ONLY fetch 0-20 records on server (NO full batch)
    const firstBatchUrl = `${baseUrl}?fixture_date=${tomorrowsDate}&start_index=0&end_index=20`;
    
    // Record start time to ensure minimum loading time if needed
    const startTime = Date.now();
    
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
                    tomorrowsDate: tomorrowsDate
                }
            };
        } else {
            // API returned status: false
            return {
                props: {
                    initialData: [],
                    endpointStatus: "error",
                    error: data.message || "Failed to load tomorrow's predictions",
                    baseUrl: baseUrl,
                    tomorrowsDate: tomorrowsDate
                }
            };
        }
    } catch (error) {
        console.error('Error fetching tomorrow\'s predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: baseUrl,
                tomorrowsDate: tomorrowsDate
            }
        };
    }
}

export default TomorrowFixtures;