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
import AccumulatorTipsContent from "../../components/seo-content/tips/accumulator-tips";

function CompetitorPredictions({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    cacheInfo,
    structuredData 
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
    
    const renderPredictions = PagesMatchPredictionDetails({ 
        gamesData: allData,
        onLoadMore: handleLoadMore,
        isLoadingMore: loadingMore,
        hasMore: hasMore
    });
    
    if (renderPredictions.length === 0 && !loadingMore && !initialData) {
        return (
            <>
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div className="sites-card">
                    <DataNotFoundPage props={`No accumulator predictions available for ${formatDisplayDate(todaysDate)}`}/>
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
                        <AccumulatorTipsContent/>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
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
                
                fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: new Date().toISOString()
                };
            } else {
                endpointStatus = "error";
                error = data.message || "Failed to load accumulator predictions";
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

    // Create structured data for accumulator tips
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

// Helper function to create structured data for accumulator tips
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
            
            // 2. WebPage for accumulator tips
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/tips/accumulator-tips#webpage`,
                "name": "Accumulator Tips Today – Free Football Acca Predictions",
                "description": "Free football accumulator tips for today. Data-driven acca predictions across the Premier League, Champions League and 700+ leagues — updated daily.",
                "url": `${siteUrl}/tips/accumulator-tips`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Football Accumulator Tips"
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
                            "item": `${siteUrl}/tips`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Accumulator Tips",
                            "item": `${siteUrl}/tips/accumulator-tips`
                        }
                    ]
                }
            },
            
            // 3. FAQPage for accumulator tips
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}/tips/accumulator-tips#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is a football accumulator?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A football accumulator — also called an acca — is a single bet that combines two or more individual selections. All selections must win for the accumulator to pay out. The odds of each selection are multiplied together, meaning the potential return increases significantly with each added leg. A 4-fold accumulator with four selections at odds of 2.00 each returns 16x the stake if all four win."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How many selections should I put in a football accumulator?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Most experienced bettors recommend 4 to 6 selections for a balanced accumulator. Fewer legs (2-3) reduce the potential return, while too many legs (8+) significantly reduce the probability of all selections winning. A 4-6 fold acca offers a practical balance between odds boost and realistic chance of success when each leg is backed by solid statistical analysis."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are the accumulator tips on Pitch Predictions free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. All accumulator tips on Pitch Predictions are completely free. Every day we publish high-confidence predictions across 700+ leagues that are well-suited for building accumulator slips. A premium subscription provides access to additional handpicked tips with deeper analysis."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What makes a good accumulator selection?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A strong accumulator selection is backed by multiple aligned statistical factors — strong recent form, a favourable head-to-head record, clear home or away advantage, no key injuries, and odds that reflect the true probability of the outcome. Each leg should be independently justified, not added just to inflate the potential return."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What types of bets work best in football accumulators?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "1X2 match winner bets, Both Teams to Score (BTTS), and Over/Under 2.5 goals are the most common markets used in football accumulators. Over 2.5 goals and BTTS selections are particularly popular because they can add value to the combined odds without relying on a single team to win outright."
                        }
                    }
                ]
            },
            
            // 4. BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/tips/accumulator-tips#breadcrumb`,
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
                        "item": `${siteUrl}/tips`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Accumulator Tips",
                        "item": `${siteUrl}/tips/accumulator-tips`
                    }
                ]
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

export default CompetitorPredictions;