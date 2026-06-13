// pages/competitor-predictions.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@/components/shared/client-adsense";
import DataNotFoundPage from "../../components/includes/datanotfound";
import PopularTips from "../../components/shared/popular_tips_display";
import RenderData from "../../components/shared/render_fixtures_data";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PreLoader from "../../components/includes/loader";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import SureTipsContent from "../../components/seo-content/tips/sure-tips";
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { writeCacheFileAtPath } from "../../components/functions/file_cache";

function CompetitorPredictions({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    cacheInfo 
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
            <Head>
                {/* Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Pitch Predictions",
                            "url": "https://www.pitchpredictions.com",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.pitchpredictions.com/pitch-predictions-logo.png"
                            },
                            "description": "Free, data-driven football prediction platform covering 700+ leagues worldwide.",
                            "sameAs": ["https://t.me/s/betsassuredkenya"],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "contactType": "Customer Support",
                                "url": "https://www.pitchpredictions.com/contactus"
                            }
                        })
                    }}
                />

                {/* BreadcrumbList Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { 
                                    "@type": "ListItem", 
                                    "position": 1, 
                                    "name": "Home", 
                                    "item": "https://www.pitchpredictions.com/" 
                                },
                                { 
                                    "@type": "ListItem", 
                                    "position": 2, 
                                    "name": "Tips", 
                                    "item": "https://www.pitchpredictions.com/tips" 
                                },
                                { 
                                    "@type": "ListItem", 
                                    "position": 3, 
                                    "name": "Direct Win Predictions", 
                                    "item": "https://www.pitchpredictions.com/tips/direct-win-prediction" 
                                }
                            ]
                        })
                    }}
                />

                {/* FAQPage Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "What is a direct win prediction in football?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "A direct win prediction — also called a straight win or 1/2 tip — means backing one team to win the match outright, with no draw included. It is the simplest and most popular football betting market, offering clear outcomes: either the predicted team wins or the tip loses."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Are the direct win predictions on Pitch Predictions free?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes. All direct win predictions on Pitch Predictions are completely free. A premium subscription unlocks additional handpicked tips with deeper analysis from major leagues and tournaments."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "What is the difference between a direct win and a double chance bet?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "A direct win (1 or 2) backs one team to win outright with no safety net. A double chance covers two outcomes — for example, 1X covers a home win or draw, reducing risk but also reducing odds. Direct win tips offer higher odds and are best suited for matches with a clear statistical favourite."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Can I use direct win tips for accumulators?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes. Direct win predictions are ideal for building accumulator slips. Combining several high-confidence straight win tips from different leagues can significantly increase potential returns while keeping each individual selection statistically justified."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How are direct win tips calculated on Pitch Predictions?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Each direct win tip is generated using a multi-factor analysis covering recent form (last 5–10 matches), head-to-head records, home and away performance, player injuries and suspensions, squad depth, and betting market movement. Every tip carries a confidence percentage to indicate statistical strength."
                                    }
                                }
                            ]
                        })
                    }}
                />

                {/* WebPage Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Direct Win Predictions – Free Straight Win Football Tips Today",
                            "description": "Free direct win predictions for today's football matches. Straight win tips backed by form, H2H records and squad news across 700+ leagues.",
                            "url": "https://www.pitchpredictions.com/tips/direct-win-prediction",
                            "isPartOf": { 
                                "@type": "WebSite", 
                                "name": "Pitch Predictions", 
                                "url": "https://www.pitchpredictions.com" 
                            },
                            "about": { 
                                "@type": "Thing", 
                                "name": "Direct Win Football Predictions" 
                            },
                            "dateModified": new Date().toISOString().split('T')[0],
                            "inLanguage": "en"
                        })
                    }}
                />
            </Head>

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
                        <SureTipsContent/>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    
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
            
            if (ageInMinutes <= 1) {
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
                
                writeCacheFileAtPath(cachePath, cacheData);
                
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

    return {
        props: {
            initialData,
            endpointStatus,
            error,
            baseUrl: baseUrl,
            todaysDate: todaysDate,
            cacheInfo
        }
    };
}

export default CompetitorPredictions;