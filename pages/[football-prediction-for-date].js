// pages/football-predictions/[filter_date].js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions/filter-pred1x2-ov-un-dc-ht-ft";
import fs from 'fs';
import path from 'path';
import { writeCacheFileAtPath } from "../components/functions/file_cache";
import { resolveFilterDateFromRoute } from "../components/functions/GetTodaysDate";

function FootballPredictionsByDate({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    filterDate,
    cacheInfo,
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
            const chunkUrl = `${baseUrl}?fixture_date=${filterDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
            const response = await fetch(chunkUrl, {
                headers: { "Origin": "https://www.pitchpredictions.com", "Authorization": `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}` }
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

    // Format date for display
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
            <>
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div className="sites-card">
                    <DataNotFoundPage props={`We don't have any matches for ${formatDisplayDate(filterDate)} to show you right now, please try again later`}/>
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
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div className="sites-card">
                    <DataNotFoundPage props={`No matches available for ${formatDisplayDate(filterDate)}`}/>
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
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <div className="sites-card">
                <div className="container-fluid">               
                    <div className="row" style={{backgroundColor: "#edf3f5"}}>
                        <div className="col-md-1 col-2"></div>
                        <div className="col-md-10 col-12">
                            <FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 
                                url_filter="football-predictions" 
                                filter_date={filterDate} 
                            />
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
        </>
    );
}

export async function getServerSideProps({ params, query }) {
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Route is pages/[football-prediction-for-date].js
    // URL: /football-predictions-for-2026-09-01?filter_date=2026-09-01
    const filterDate = resolveFilterDateFromRoute({ params, query });
    
    if (!filterDate) {
        return {
            notFound: true
        };
    }
    
    // Base URL for fetching fixtures by date
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_fixtures_by_date";
    
    // Cache setup - create cache file for specific date
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `date-football-predictions-${filterDate}.json`;
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

        // Check if we have a valid cache file
        if (fs.existsSync(cachePath)) {
            // Read the cache file
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            // Check if cache is still valid (1 hour = 3600000 ms)
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 60) {
                // ✅ Cache is valid - use it!
                initialData = cache.data;
                endpointStatus = "success";
                error = null;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt
                };
            } else {
                // ❌ Cache expired - delete it
                fs.unlinkSync(cachePath);
            }
        }

        // If we don't have valid cache data, fetch from API
        if (initialData.length === 0) {
            const firstBatchUrl = `${baseUrl}?fixture_date=${filterDate}&start_index=0&end_index=20`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(firstBatchUrl, {
                headers: { "Origin": "https://www.pitchpredictions.com", "Authorization": `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}` },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check API response structure
            if (data.status === true && data.data) {
                initialData = data.data;
                
                // Save to cache for next time
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    fixtureDate: filterDate,
                    data: initialData,
                    count: initialData.length
                };
                
                // Atomic write
                writeCacheFileAtPath(cachePath, cacheData);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
                endpointStatus = "success";
                error = null;
            } else {
                endpointStatus = "error";
                error = data.message || "Failed to load predictions";
            }
        }

        // Clean up old cache files (older than 1 hour)
        await cleanupOldCacheFiles(cacheDir);

    } catch (err) {
        console.error('Error fetching predictions by date:', err);
        endpointStatus = "error";
        error = err.message;
        
        // If cache exists but we had an error, use it as fallback
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

    // Create structured data for date-specific predictions
    const structuredData = createStructuredData(siteUrl, currentDate, filterDate);

    return {
        props: {
            initialData,
            endpointStatus,
            error,
            baseUrl: baseUrl,
            filterDate: filterDate,
            cacheInfo,
            structuredData
        }
    };
}

// Helper function to clean up old cache files
async function cleanupOldCacheFiles(cacheDir) {
    try {
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = new Date().getTime();
        const maxAge = 60 * 60 * 1000; // 1 hour
        
        for (const file of files) {
            if (file.startsWith('date-football-predictions-') && file.endsWith('.json')) {
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

// Helper function to create structured data for date-specific predictions
function createStructuredData(siteUrl, currentDate, filterDate) {
    const formattedDate = new Date(filterDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            // 1. Organization
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": "Pitch Predictions",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}/pitch-predictions-logo.png`,
                    "width": 300,
                    "height": 60
                },
                "description": "Free, data-driven football prediction platform covering 700+ leagues worldwide.",
                "sameAs": ["https://t.me/s/betsassuredkenya"],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Support",
                    "url": `${siteUrl}/contactus`
                }
            },
            
            // 2. WebPage for date-specific predictions
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/football-predictions/${filterDate}#webpage`,
                "name": `Football Predictions for ${formattedDate} – Free Tips & Analysis`,
                "description": `Free football predictions for matches on ${formattedDate}. Expert 1X2, BTTS, Over/Under, and Double Chance tips across 700+ leagues — updated daily.`,
                "url": `${siteUrl}/football-predictions/${filterDate}`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": `Football Predictions for ${formattedDate}`
                },
                "dateModified": currentDate,
                "inLanguage": "en",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": siteUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Football Predictions",
                            "item": `${siteUrl}/football-predictions`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": formattedDate,
                            "item": `${siteUrl}/football-predictions/${filterDate}`
                        }
                    ]
                }
            },
            
            // 3. BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/football-predictions/${filterDate}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Football Predictions",
                        "item": `${siteUrl}/football-predictions`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": formattedDate,
                        "item": `${siteUrl}/football-predictions/${filterDate}`
                    }
                ]
            },
            
            // 4. ItemList for date-specific predictions
            {
                "@type": "ItemList",
                "@id": `${siteUrl}/football-predictions/${filterDate}#itemlist`,
                "name": `Football Predictions for ${formattedDate}`,
                "description": `Today's top football predictions for matches on ${formattedDate} across 700+ leagues.`,
                "url": `${siteUrl}/football-predictions/${filterDate}`,
                "itemListOrder": "https://schema.org/ItemListOrderDescending"
            },
            
            // 5. WebSite
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "name": "Pitch Predictions",
                "url": siteUrl,
                "publisher": {
                    "@id": `${siteUrl}#organization`
                }
            }
        ]
    };
}

export default FootballPredictionsByDate;