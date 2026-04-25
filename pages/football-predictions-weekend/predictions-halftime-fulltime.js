// pages/football-predictions-weekend.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import DateofWeekend from "../../components/functions/compute_weekend_dates";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/football-predictions-weekend/filter-pred1x2-ov-un-dc-ht-ft";
import fs from 'fs';
import path from 'path';

function WeekendFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    saturdayDate,
    sundayDate,
    structuredData
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
            const chunkUrl = `${baseUrl}?saturday_date=${saturdayDate}&sunday_date=${sundayDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
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

    // Format weekend dates for display
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

    const formatWeekendRange = () => {
        if (!saturdayDate || !sundayDate) return '';
        return `${formatDisplayDate(saturdayDate)} - ${formatDisplayDate(sundayDate)}`;
    };

    // Handle error state
    if (endpointStatus === "error" || error) {
        return (
            <>
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
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
            </>
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
            <>
                <div className="sites-card">
                    <DataNotFoundPage props={`No matches available for weekend ${formatWeekendRange()}`}/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    />
                </div>
            </>
        );
    }
    
    // Render the page with data
    return (
        <>            
            <div className="sites-card">
                <div className="container-fluid">
                    <div className="row" style={{backgroundColor: "#edf3f5"}}>
                        <div className="col-md-1 col-2"></div>
                        <div className="col-md-10 col-12">
                            <FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get weekend dates
    const weekendDates = DateofWeekend();
    const saturdayDate = weekendDates[0];
    const sundayDate = weekendDates[1];
    
    // Base URL for weekend fixtures
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_weekend_fixtures";
    
    // First batch: ONLY fetch 0-20 records on server (NO full batch)
    const firstBatchUrl = `${baseUrl}?saturday_date=${saturdayDate}&sunday_date=${sundayDate}&start_index=0&end_index=20`;
    
    let initialData = [];
    let endpointStatus = "success";
    let error = null;
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };

    // Cache setup
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `weekend-football-predictions-${saturdayDate}-${sundayDate}.json`;
    const cachePath = path.join(cacheDir, cacheFilename);

    try {
        // Create cache directory if it doesn't exist
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Check if we have a valid cache file for fixtures only (30 minutes = 1,800,000 ms)
        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 30) {
                // ✅ Cache is valid - use cached fixtures
                initialData = cache.initialData;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt
                };
            } else {
                // ❌ Cache expired - delete it
                fs.unlinkSync(cachePath);
            }
        }

        // If no valid cache, fetch from API
        if (initialData.length === 0) {            
            // Record start time to ensure minimum loading time if needed
            const startTime = Date.now();
            
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
                
                initialData = data.data || [];
                endpointStatus = "success";
                error = null;

                // Save fixtures to cache
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    initialData: initialData,
                    saturdayDate: saturdayDate,
                    sundayDate: sundayDate,
                    count: initialData.length
                };
                
                // Atomic write
                const tempPath = `${cachePath}.tmp.${Date.now()}`;
                fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
                fs.renameSync(tempPath, cachePath);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
                
            } else {
                // API returned status: false
                endpointStatus = "error";
                error = data.message || "Failed to load weekend predictions";
            }
        }

        // Clean up old cache files (older than 30 minutes)
        await cleanupOldCacheFiles(cacheDir, saturdayDate, sundayDate);

    } catch (err) {
        endpointStatus = "error";
        error = err.message;
        initialData = [];
        
        // If cache exists but API failed, use cached fixtures as fallback
        if (fs.existsSync(cachePath)) {
            try {
                const cacheContent = fs.readFileSync(cachePath, 'utf8');
                const cache = JSON.parse(cacheContent);
                initialData = cache.initialData;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt,
                    isFallback: true
                };
                endpointStatus = "success";
                error = null;
            } catch (fallbackErr) {
                console.error('Fallback error for weekend fixtures:', fallbackErr);
            }
        }
    }
        
    return {
        props: {
            initialData,
            endpointStatus,
            error: error || null,
            baseUrl: baseUrl,
            saturdayDate: saturdayDate,
            sundayDate: sundayDate,
            cacheInfo
        }
    };
}

// Helper function to clean up old cache files
async function cleanupOldCacheFiles(cacheDir, currentSaturday, currentSunday) {
    try {
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = new Date().getTime();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const file of files) {
            // Clean up weekend fixture cache files that are older than 30 minutes
            if (file.startsWith('weekend-football-predictions-') && file.endsWith('.json')) {
                // Don't delete the current weekend's cache file
                const currentCacheFile = `weekend-football-predictions-${currentSaturday}-${currentSunday}.json`;
                if (file === currentCacheFile) continue;
                
                const filePath = path.join(cacheDir, file);
                const stats = fs.statSync(filePath);
                const fileAge = now - stats.mtimeMs;
                
                if (fileAge > maxAge) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    } catch (error) {
        console.error('Error cleaning up weekend cache:', error);
    }
}

export default WeekendFixtures;