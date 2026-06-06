// pages/top-football-tips-and-predictions/tomorrow.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FormatedDate from "../../../components/functions/format_date_function";
import FiltersTopFootballPredictions from "../../../components/shared/filters-top-football-predictions";
import FilterTomorrowsTopOverallDoubleChanceUnderOverHTFTPred1x2 from "../../../components/top-football-tips-and-predictions/tomorrow/filter-pred1x2-ov-un-dc-ht-ft";
import fs from 'fs';
import path from 'path';
import { writeCacheFileAtPath } from "../../../components/functions/file_cache";

function TopFootballFixturesTomorrow({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    tomorrowsDate
}){     
    const router = useRouter();
    const [allData, setAllData] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [loadTrigger, setLoadTrigger] = useState(0);

    const loadMoreData = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = Math.min(currentStartIndex + chunkSize - 1, 400);
        
        try {
            const chunkUrl = `${baseUrl}?fixture_date=${tomorrowsDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
            const response = await fetch(chunkUrl, {
                headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const chunkData = await response.json();
            
            if (chunkData.status === true && chunkData.data && chunkData.data.length > 0) {
                setAllData(prevData => [...prevData, ...chunkData.data]);
                setCurrentStartIndex(endIndex + 1);
                
                if (endIndex >= 400 || chunkData.data.length < chunkSize) {
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

    useEffect(() => {
        if (loadTrigger > 0) {
            loadMoreData();
        }
    }, [loadTrigger]);

    const handleLoadMore = () => {
        setLoadTrigger(prev => prev + 1);
    };

    if (!initialData && !error) {
        return <PreLoader />;
    }

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
    
    const renderPredictions = PagesMatchPredictionDetails({ 
        gamesData: allData,
        onLoadMore: handleLoadMore,
        isLoadingMore: loadingMore,
        hasMore: hasMore
    });
    
    if (renderPredictions.length === 0 && !loadingMore && !initialData) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props={`No top football predictions available for ${formatDisplayDate(tomorrowsDate)}`}/>
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
    
    return (
        <div className="sites-card">            
            <div className="row">
                <div className="col-md-4 col-2"></div>
                <div className="col-md-6 col-9 container">
                    <FiltersTopFootballPredictions url_filter={router.pathname.substring(1)} />
                </div>
                <div className="col-md-2 col-1"></div>
            </div>
            
            <div className="container-fluid">
                <div className="row" style={{backgroundColor: "#edf3f5"}}>
                    <div className="col-md-1 col-2"></div>
                    <div className="col-md-10 col-12">
                        <FilterTomorrowsTopOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
    );
}

export async function getServerSideProps() {
    const tomorrowsDate = FormatedDate(1);
    
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions";
    const firstBatchUrl = `${baseUrl}?fixture_date=${tomorrowsDate}&start_index=0&end_index=20`;
    
    // Cache setup - different file for tomorrow's date
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `top-football-predictions-${tomorrowsDate}.json`; // Date-specific cache
    const cachePath = path.join(cacheDir, cacheFilename);
    
    let initialData = [];
    let endpointStatus = "success";
    let error = null;
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };

    try {
        // Create cache directory if it doesn't exist
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Check if we have a valid cache file (3 minutes = 180000 ms)
        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 3) {
                // Cache is valid - use it!
                initialData = cache.data;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt
                };
            } else {
                // Cache expired - delete it
                fs.unlinkSync(cachePath);
            }
        }

        // If no valid cache, fetch from API
        if (initialData.length === 0) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(firstBatchUrl, {
                headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.status === true && data.data) {
                initialData = data.data;
                
                // Save to cache (atomic write for K3s)
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    fixtureDate: tomorrowsDate,
                    data: initialData,
                    count: initialData.length
                };
                
                writeCacheFileAtPath(cachePath, cacheData);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
            } else {
                endpointStatus = "error";
                error = data.message || "Failed to load top football predictions";
            }
        }

        // Clean up old cache files
        cleanupOldCacheFiles(cacheDir);

    } catch (err) {
        endpointStatus = "error";
        error = err.message;
        
        // If cache exists but API failed, use it as fallback
        if (fs.existsSync(cachePath)) {
            try {
                const cacheContent = fs.readFileSync(cachePath, 'utf8');
                const cache = JSON.parse(cacheContent);
                initialData = cache.data;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt,
                    isFallback: true
                };
                endpointStatus = "success";
                error = null;
            } catch (fallbackErr) {
                // Silent fail
            }
        }
    }

    return {
        props: {
            initialData,
            endpointStatus,
            error,
            baseUrl: baseUrl,
            tomorrowsDate: tomorrowsDate,
            cacheInfo
        }
    };
}

// Helper function to clean up old cache files
function cleanupOldCacheFiles(cacheDir) {
    try {
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = new Date().getTime();
        const maxAge = 3 * 60 * 1000; // 3 minutes
        
        for (const file of files) {
            if (file.startsWith('top-football-predictions-') && file.endsWith('.json')) {
                const filePath = path.join(cacheDir, file);
                const stats = fs.statSync(filePath);
                const fileAge = now - stats.mtimeMs;
                
                if (fileAge > maxAge) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    } catch (error) {
        console.error('Error cleaning up cache:', error);
    }
}

export default TopFootballFixturesTomorrow;