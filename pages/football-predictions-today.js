// pages/football-predictions-today.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterTodaysOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions-today/filter-pred1x2-ov-un-dc-ht-ft";
import TodayFootballPredictionsContent from "../components/seo-content/mainpages/football-predictions-today";
import fs from 'fs';
import { CACHE_DIR, getCacheFilePath, purgeStaleJsonCaches, readJsonCache, writeCacheFile } from "../components/functions/file_cache";

function TodaysFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    liveBaseUrl,
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

    // Keep in-play matches live on today's page while keeping NS cache-friendly
    useEffect(() => {
        const refreshLiveMatches = async () => {
            const endIndex = Math.max(currentStartIndex - 1, 20);
            const liveUrl = `${liveBaseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=${endIndex}`;

            try {
                const response = await fetch(liveUrl, {
                    headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
                });

                if (!response.ok) return;
                const livePayload = await response.json();

                if (livePayload.status === true && Array.isArray(livePayload.data)) {
                    setAllData((prevMatches) => mergeLiveMatchesIntoList(prevMatches, livePayload.data));
                }
            } catch (refreshError) {
                console.error("Error refreshing today's live matches:", refreshError);
            }
        };

        const intervalId = setInterval(refreshLiveMatches, 20000);
        return () => clearInterval(intervalId);
    }, [liveBaseUrl, todaysDate, currentStartIndex]);

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
    const liveBaseUrl = "https://api.pitchpredictions.com/api/fetch_live_games";
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    const liveFirstBatchUrl = `${liveBaseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    // Cache setup
    const cacheFilename = `todays-predictions-${todaysDate}.json`; // Specific cache for today's page
    const cachePath = getCacheFilePath(cacheFilename);
    
    let initialData = [];
    let endpointStatus = "success";
    let error = null;
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };
    let cachedNotStartedMatches = [];

    try {
        // Check if we have a valid cache file (1 minute)
        const cache = readJsonCache(cachePath, 60 * 1000);
        if (cache) {
            cachedNotStartedMatches = cache.data || [];
            cacheInfo = {
                fromCache: true,
                generatedAt: cache.generatedAt
            };
        }

        // Fetch today's base fixtures
        let freshTodaysMatches = [];
        const todaysResponse = await fetch(firstBatchUrl, {
            headers: { 
                "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
            }
        });
        
        if (!todaysResponse.ok) {
            throw new Error(`HTTP error! status: ${todaysResponse.status}`);
        }
        
        const todaysPayload = await todaysResponse.json();
        
        if (todaysPayload.status === true && todaysPayload.data) {
            freshTodaysMatches = todaysPayload.data || [];

            // Cache only fixtures that have not started yet
            const notStartedMatches = freshTodaysMatches.filter((match) =>
                isNotStartedMatchStatus(match?.match?.status)
            );

            const cacheData = {
                generatedAt: new Date().toISOString(),
                fixtureDate: todaysDate,
                data: notStartedMatches,
                count: notStartedMatches.length
            };
            
            writeCacheFile(cacheFilename, cacheData);
            
            cacheInfo = {
                fromCache: false,
                generatedAt: cacheData.generatedAt
            };
        } else {
            endpointStatus = "error";
            error = todaysPayload.message || "Failed to load today's predictions";
        }

        // Fetch live fixtures and overlay them on today's list
        let liveMatches = [];
        try {
            const liveResponse = await fetch(liveFirstBatchUrl, {
                headers: {
                    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
                }
            });

            if (liveResponse.ok) {
                const livePayload = await liveResponse.json();
                if (livePayload.status === true && Array.isArray(livePayload.data)) {
                    liveMatches = livePayload.data;
                }
            }
        } catch (liveErr) {
            console.error("Error fetching live overlay for today page:", liveErr);
        }

        const notStartedSource = freshTodaysMatches.length > 0
            ? freshTodaysMatches.filter((match) => isNotStartedMatchStatus(match?.match?.status))
            : cachedNotStartedMatches;
        const startedSource = freshTodaysMatches.filter((match) => !isNotStartedMatchStatus(match?.match?.status));
        const baseMatches = [...notStartedSource, ...startedSource];

        initialData = mergeLiveMatchesIntoList(baseMatches, liveMatches);
        if (initialData.length > 0) {
            endpointStatus = "success";
            error = null;
        }

        purgeStaleJsonCaches(30 * 60 * 1000, CACHE_DIR);

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
            liveBaseUrl,
            todaysDate: todaysDate,
            structuredData,
            cacheInfo
        }
    };
}

function isNotStartedMatchStatus(status) {
    const notStartedStatuses = ["NS", "TBD", "PST"];
    return notStartedStatuses.includes(status);
}

function mergeLiveMatchesIntoList(baseMatches = [], liveMatches = []) {
    const merged = Array.isArray(baseMatches) ? [...baseMatches] : [];
    const indexByFixtureId = new Map();

    merged.forEach((match, index) => {
        indexByFixtureId.set(match?.fixture_id, index);
    });

    for (const liveMatch of liveMatches) {
        const fixtureId = liveMatch?.fixture_id;
        if (!fixtureId) continue;

        if (indexByFixtureId.has(fixtureId)) {
            merged[indexByFixtureId.get(fixtureId)] = liveMatch;
        } else {
            merged.unshift(liveMatch);
        }
    }

    return merged;
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