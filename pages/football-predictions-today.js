// pages/football-predictions-today.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterTodaysOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions-today/filter-pred1x2-ov-un-dc-ht-ft";
import TodayFootballPredictionsContent from "../components/seo-content/mainpages/football-predictions-today";
import fs from 'fs';
import path from 'path';

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
                
                <br/>   
                
                <div className="">
                    <div className="container">
                        <TodayFootballPredictionsContent/>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Base URL for today's games
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_todays_games";
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

        // Check if we have a valid cache file (2 minutes = 120000 ms)
        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 2) { // 2 minutes max
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
                
                const tempPath = `${cachePath}.tmp.${Date.now()}`;
                fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
                fs.renameSync(tempPath, cachePath);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
            } else {
                endpointStatus = "error";
                error = data.message || "Failed to load today's predictions";
            }
        }

        // Clean up old cache files (older than 2 minutes)
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

// Helper function to create structured data
function createStructuredData(siteUrl, currentDate) {
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
            
            // 2. WebPage for today's football predictions
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/football-predictions-today#webpage`,
                "name": "Today's Football Predictions – Free Tips & Match Analysis",
                "description": "Get today's free football predictions including 1X2, BTTS, Over/Under, Double Chance and HT/FT tips. Data-driven analysis for matches worldwide.",
                "url": `${siteUrl}/football-predictions-today`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Today's Football Predictions"
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
                            "name": "Today's Football Predictions",
                            "item": `${siteUrl}/football-predictions-today`
                        }
                    ]
                }
            },
            
            // 3. FAQPage
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}/football-predictions-today#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Are today's football predictions free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. All of today's football predictions on Pitch Predictions are completely free — including 1X2, BTTS, Over/Under, Double Chance and HT/FT tips. A premium subscription unlocks our highest-confidence exclusive picks."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How are today's football predictions calculated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Today's predictions use a multi-factor model analysing current form (last 5–10 matches), head-to-head history, team news and injuries, home/away records, and live betting market movements. Each tip is assigned a confidence percentage."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Which leagues have predictions today?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Pitch Predictions covers today's matches across 700+ leagues including the Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, Europa League, and leagues across Africa and Asia."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What prediction markets are available today?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Today's markets include 1X2 (Match Winner), Double Chance, HT/FT (Half Time/Full Time), Over/Under 2.5 Goals, Both Teams to Score (BTTS/GG/NG), and Correct Score predictions."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How often are today's tips updated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Predictions are published every morning and updated throughout the day as team news and odds movements emerge. Live scores refresh in real-time during matches."
                        }
                    }
                ]
            },
            
            // 4. BreadcrumbList (standalone)
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/football-predictions-today#breadcrumb`,
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
                        "name": "Today's Football Predictions",
                        "item": `${siteUrl}/football-predictions-today`
                    }
                ]
            },
            
            // 5. ItemList
            {
                "@type": "ItemList",
                "@id": `${siteUrl}/football-predictions-today#itemlist`,
                "name": "Today's Football Predictions",
                "description": "Today's football predictions across major leagues including match winner, BTTS, over/under goals, and correct score tips.",
                "url": `${siteUrl}/football-predictions-today`,
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