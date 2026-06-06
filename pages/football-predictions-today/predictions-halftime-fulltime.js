// pages/football-predictions-today.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterTodaysOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/football-predictions-today/filter-pred1x2-ov-un-dc-ht-ft";
import fs from 'fs';
import path from 'path';
import { writeCacheFileAtPath } from "../../components/functions/file_cache";

function TodaysFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    structuredData,
}) {
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
        const endIndex = Math.min(currentStartIndex + chunkSize - 1, 850);
        
        try {
            const chunkUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
            const response = await fetch(chunkUrl, {
                headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const chunkData = await response.json();
            
            if (chunkData.status === true && chunkData.data && chunkData.data.length > 0) {
                setAllData(prevData => [...prevData, ...chunkData.data]);
                setCurrentStartIndex(endIndex + 1);
                
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
                <DataNotFoundPage props="No matches available for today"/>
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
        <>
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <div className="sites-card">                
                <p className="text-center blink_me">Looking for Premium Football Predictions!!!&nbsp;</p>
                <p className="text-center">
                    <a href="/auth/login" className="btn btn-danger btn-sm">Subscribe Now</a>
                </p>
                
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
                            <FilterTodaysOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
    const todaysDate = getFormattedCurrentDate();
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Base URL for today's games
    const baseUrl = "https://develop.pitchpredictions.com/api/fetch_todays_games";
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    // Cache setup
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `todays-predictions-${todaysDate}.json`; // Specific cache for today's page
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

        // Check if we have a valid cache file (1 minute = 60000 ms)
        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 1) { // 1 minute max
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
            const response = await fetch(firstBatchUrl, {
                headers: { 
                    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === true && data.data) {
                initialData = data.data || [];
                
                // Save to cache (atomic write for K3s)
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    fixtureDate: todaysDate,
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
                error = data.message || "Failed to load today's predictions";
            }
        }

        // Clean up old cache files (older than 1 minute)
        cleanupOldCacheFiles(cacheDir);

    } catch (err) {
        console.error('Error fetching today\'s predictions:', err);
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

    // Create structured data
    const structuredData = createStructuredData(siteUrl, currentDate);

    return {
        props: {
            initialData,
            endpointStatus,
            error,
            baseUrl: baseUrl,
            todaysDate: todaysDate,
            structuredData,
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
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        for (const file of files) {
            if (file.startsWith('todays-predictions-') && file.endsWith('.json')) {
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

function createStructuredData(siteUrl, currentDate) {

    const pageUrl = `${siteUrl}/football-predictions-today/predictions-halftime-fulltime`;

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
                    "url": `${siteUrl}/contact-us`
                }
            },

            // 2. WebPage (HT/FT PAGE)
            {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                "name": "Half Time / Full Time Predictions Today (HT/FT Tips)",
                "description": "Today's HT/FT predictions with expert analysis. Get accurate half time and full time football tips across top leagues worldwide.",
                "url": pageUrl,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Half Time Full Time Football Predictions"
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
                            "name": "Football Predictions Today",
                            "item": `${siteUrl}/football-predictions-today`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Half Time / Full Time Predictions",
                            "item": pageUrl
                        }
                    ]
                }
            },

            // 3. FAQPage (HT/FT focused)
            {
                "@type": "FAQPage",
                "@id": `${pageUrl}#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What does HT/FT mean in football betting?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "HT/FT means Half Time / Full Time. It predicts the result at half time and the final result at full time, such as Home/Home, Draw/Home, or Away/Away."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are half time full time predictions for today free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. All HT/FT predictions are provided free, with premium options offering higher-confidence selections."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How are HT/FT predictions calculated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "HT/FT predictions are based on team performance trends, first-half and second-half statistics, scoring patterns, and historical match data."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Which leagues are covered in HT/FT predictions today?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "HT/FT predictions cover major leagues including Premier League, La Liga, Serie A, Bundesliga, Champions League, and top African competitions."
                        }
                    }
                ]
            },

            // 4. BreadcrumbList (standalone)
            {
                "@type": "BreadcrumbList",
                "@id": `${pageUrl}#breadcrumb`,
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
                        "name": "Football Predictions Today",
                        "item": `${siteUrl}/football-predictions-today`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Half Time / Full Time Predictions",
                        "item": pageUrl
                    }
                ]
            },

            // 5. ItemList
            {
                "@type": "ItemList",
                "@id": `${pageUrl}#itemlist`,
                "name": "HT/FT Predictions Today",
                "description": "Today's half time full time football predictions across major leagues.",
                "url": pageUrl,
                "numberOfItems": 20,
                "itemListOrder": "https://schema.org/ItemListOrderDescending"
            },

            // 6. WebSite
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
export default TodaysFixtures;