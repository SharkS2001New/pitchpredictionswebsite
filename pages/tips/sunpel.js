// pages/competitor-predictions.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@ctrl/react-adsense";
import DataNotFoundPage from "../../components/includes/datanotfound";
import PopularTips from "../../components/shared/popular_tips_display";
import RenderData from "../../components/shared/render_fixtures_data";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PreLoader from "../../components/includes/loader";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import fs from 'fs';
import path from 'path';
import SunpelPredictionsContent from "../../components/seo-content/tips/sunpel";

function CompetitorPredictions({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    cacheInfo,
    structuredData  // Add structuredData prop
}){     
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
            const chunkUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
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
                <DataNotFoundPage props={`No competitor predictions available for ${formatDisplayDate(todaysDate)}`}/>
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
                <PopularTips/>
                
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
                        <SunpelPredictionsContent/>
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
    
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions";
    
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `top-football-predictions-${todaysDate}.json`;
    const cachePath = path.join(cacheDir, cacheFilename);
    
    let initialData = [];
    let endpointStatus = "success";
    let error = null;
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };

    try {
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 3) {
                initialData = cache.data;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt
                };
            } else {
                fs.unlinkSync(cachePath);
            }
        }

        if (initialData.length === 0) {
            const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
            
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
                
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    fixtureDate: todaysDate,
                    data: initialData,
                    count: initialData.length
                };
                
                // Atomic write for K3s
                const tempPath = `${cachePath}.tmp.${Date.now()}`;
                fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
                fs.renameSync(tempPath, cachePath);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: new Date().toISOString()
                };
            } else {
                endpointStatus = "error";
                error = data.message || "Failed to load competitor predictions";
            }
        }

        // Clean up old cache files
        if (fs.existsSync(cacheDir)) {
            const files = fs.readdirSync(cacheDir);
            const now = new Date().getTime();
            const maxAge = 3 * 60 * 1000;
            
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
        }

    } catch (err) {
        endpointStatus = "error";
        error = err.message;
        
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

    // Create structured data for Sunpel page
    const structuredData = createStructuredData(siteUrl, currentDate);

    return {
        props: {
            initialData,
            endpointStatus,
            error,
            baseUrl: baseUrl,
            todaysDate: todaysDate,
            cacheInfo,
            structuredData
        }
    };
}

// Helper function to create structured data for Sunpel page
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
            
            // 2. WebPage for Sunpel predictions
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/tips/sunpel#webpage`,
                "name": "Sunpel Predictions – Free Football Tips & Jackpot Picks",
                "description": "Looking for Sunpel predictions today? Get free football tips, jackpot predictions, BTTS, correct score and mega jackpot analysis on Pitch Predictions — updated daily.",
                "url": `${siteUrl}/tips/sunpel`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Sunpel Football Predictions"
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
                            "name": "Tips",
                            "item": `${siteUrl}/top-football-tips-and-predictions/today`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Sunpel Predictions",
                            "item": `${siteUrl}/tips/sunpel`
                        }
                    ]
                }
            },
            
            // 3. FAQPage for Sunpel
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}/tips/sunpel#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is Sunpel?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sunpel is a Kenyan football predictions platform offering daily tips, jackpot predictions, correct score tips, and BTTS picks. It covers major bookmaker jackpots including Sportpesa, Betika, Mozzart, and Odibet."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where can I find free Sunpel predictions today?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Pitch Predictions provides free daily football tips and jackpot predictions covering the same markets as Sunpel — including 1X2, BTTS, correct score, over/under goals, and all major Kenyan bookmaker jackpots. Updated every day."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Pitch Predictions cover Sunpel Mega Jackpot predictions?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. Pitch Predictions covers the Sportpesa Mega Jackpot (17 games, weekend), Sportpesa Midweek Jackpot (13 games), Betika Midweek Jackpot, Mozzart Super Daily Jackpot, and more — with full analysis for every game on the coupon, updated weekly."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What are Sunpel BTTS tips?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sunpel BTTS (Both Teams to Score) tips predict matches where both sides are expected to find the net. Pitch Predictions provides free BTTS tips based on each team's recent scoring and defensive records across the last 10 matches."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is the Sportpesa Mega Jackpot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The Sportpesa Mega Jackpot runs every weekend (Saturday–Sunday) with a grand prize of up to KES 360 million. It features 17 preselected games from top leagues worldwide. Bettors who correctly predict 12–16 games qualify for bonus prizes. A stake of KES 99 is required per entry."
                        }
                    }
                ]
            },
            
            // 4. BreadcrumbList (standalone)
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/tips/sunpel#breadcrumb`,
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
                        "name": "Tips",
                        "item": `${siteUrl}/top-football-tips-and-predictions/today`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Sunpel Predictions",
                        "item": `${siteUrl}/tips/sunpel`
                    }
                ]
            },
            
            // 5. ItemList
            {
                "@type": "ItemList",
                "@id": `${siteUrl}/tips/sunpel#itemlist`,
                "name": "Sunpel Predictions Today",
                "description": "Today's football predictions including 1X2, BTTS, correct score, and jackpot analysis for Kenyan and international leagues.",
                "url": `${siteUrl}/tips/sunpel`,
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

export default CompetitorPredictions;