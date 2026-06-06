// pages/competitor-predictions.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@/components/shared/client-adsense";
import DataNotFoundPage from "../../components/includes/datanotfound";
import PopularTips from "../../components/shared/popular_tips_display";
import RenderData from "../../components/shared/render_fixtures_data";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PreLoader from "../../components/includes/loader";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import fs from 'fs';
import path from 'path';
import SokafansPredictionsContent from "../../components/seo-content/tips/sokafans";
import { writeCacheFileAtPath } from "../../components/functions/file_cache";

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
                        <SokafansPredictionsContent/>
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
                
                // Atomic write for K3s
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

    // Create structured data for Sokafans page
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

// Helper function to create structured data for Sokafans page
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
            
            // 2. WebPage for Sokafans predictions
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/tips/sokafans#webpage`,
                "name": "Sokafans Predictions Today – Free Football Tips & Jackpot Analysis",
                "description": "Get free Sokafans-style football predictions and jackpot tips. Daily 1X2, BTTS, and jackpot analysis for Sportpesa Mega Jackpot, Betika, and more.",
                "url": `${siteUrl}/tips/sokafans`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Sokafans Football Predictions"
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
                            "name": "Sokafans Predictions",
                            "item": `${siteUrl}/tips/sokafans`
                        }
                    ]
                }
            },
            
            // 3. FAQPage for Sokafans
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}/tips/sokafans#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is Sokafans?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sokafans is a Kenyan football predictions and betting tips platform that connects tipsters with bettors. It provides daily football tips, jackpot predictions, and match analysis for leagues across Kenya and worldwide."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where can I find free Sokafans predictions today?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Pitch Predictions offers free daily football tips and jackpot predictions similar to Sokafans, covering the Sportpesa Mega Jackpot, Betika Midweek Jackpot, and 700+ leagues worldwide — updated every day."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Pitch Predictions cover Sokafans jackpot predictions?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. Pitch Predictions covers all major jackpots including the Sportpesa Mega Jackpot (17 games), Sportpesa Midweek Jackpot (13 games), and Betika Midweek Jackpot — with detailed analysis for every selection on the coupon."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How accurate are the jackpot predictions on Pitch Predictions?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our jackpot predictions are built using head-to-head records, last 12 match performance, league standings, and home/away form. We provide 1X2, Double Chance, and Correct Score options to help bettors increase their chances of winning bonus prizes."
                        }
                    }
                ]
            },
            
            // 4. BreadcrumbList (standalone)
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/tips/sokafans#breadcrumb`,
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
                        "name": "Sokafans Predictions",
                        "item": `${siteUrl}/tips/sokafans`
                    }
                ]
            },
            
            // 5. ItemList
            {
                "@type": "ItemList",
                "@id": `${siteUrl}/tips/sokafans#itemlist`,
                "name": "Sokafans Predictions Today",
                "description": "Today's football predictions including 1X2, BTTS, and jackpot analysis for Kenyan and international leagues.",
                "url": `${siteUrl}/tips/sokafans`,
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