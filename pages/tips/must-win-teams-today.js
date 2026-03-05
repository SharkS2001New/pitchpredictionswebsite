// pages/must-win-teams-today.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@ctrl/react-adsense";
import DataNotFoundPage from "../../components/includes/datanotfound";
import PopularTips from "../../components/shared/popular_tips_display";
import RenderData from "../../components/shared/render_fixtures_data";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PreLoader from "../../components/includes/loader";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import MustWinTeamsTodayContent from "../../components/seo-content/tips/must-win-teams-today";

function MustWinTeamsToday({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    structuredData
}){     
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
        const endIndex = Math.min(currentStartIndex + chunkSize - 1, 400); // Using 400 as max from your code
        
        try {
            const chunkUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=${startIndex}&end_index=${endIndex}`;
            
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

    // Format today's date for display
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
            <div className="sites-card">
                <DataNotFoundPage props={`No must-win teams predictions available for ${formatDisplayDate(todaysDate)}`}/>
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
    
    // Render the page with data
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
                        <MustWinTeamsTodayContent/>
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
    
    // Base URL for top winning predictions
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions";
    
    // First batch: ONLY fetch 0-20 records on server (NO full batch)
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    // Record start time to ensure minimum loading time if needed
    const startTime = Date.now();
    
    try {
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
        
        // Create structured data in @graph format
        const structuredData = {
            "@context": "https://schema.org",
            "@graph": [
                // 1. Organization (consistent across all pages)
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
                    "description": "Free data-driven football prediction platform covering 700+ leagues worldwide.",
                    "sameAs": ["https://t.me/s/betsassuredkenya"],
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "Customer Support",
                        "url": `${siteUrl}/contactus`
                    }
                },
                
                // 2. WebPage
                {
                    "@type": "WebPage",
                    "@id": `${siteUrl}/tips/must-win-teams-today#webpage`,
                    "name": "Must-Win Football Teams Today – High-Confidence Match Picks",
                    "description": "Explore today's must-win football teams based on form, H2H records and team stats. Data-driven picks across major leagues — updated daily by Pitch Predictions.",
                    "url": `${siteUrl}/tips/must-win-teams-today`,
                    "isPartOf": {
                        "@type": "WebSite",
                        "@id": `${siteUrl}#website`
                    },
                    "about": {
                        "@type": "Thing",
                        "name": "Must-Win Football Predictions"
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
                                "name": "Football Tips",
                                "item": `${siteUrl}/tips`
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "Must-Win Teams Today",
                                "item": `${siteUrl}/tips/must-win-teams-today`
                            }
                        ]
                    }
                },
                
                // 3. FAQPage
                {
                    "@type": "FAQPage",
                    "@id": `${siteUrl}/tips/must-win-teams-today#faq`,
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What does 'must-win team' mean in football predictions?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "A must-win team is a side identified as having a strong statistical advantage in a given match — based on current form, head-to-head records, home/away performance, squad fitness and betting market data. It does not mean the outcome is certain, but the data supports that team as the more likely winner."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How does Pitch Predictions select must-win teams?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Each must-win selection is chosen using a multi-factor model that analyses: current league form (last 5–10 matches), head-to-head history, home and away win rates, goal scoring and conceding averages, key player availability, and odds movement. Only matches where multiple indicators align are listed."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Are must-win football tips free on Pitch Predictions?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. All must-win team tips on this page are completely free. A premium subscription is available for early-access exclusive picks with higher confidence ratings."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How often is this page updated?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Must-win team selections are updated daily, typically by 9:00 AM GMT. You can also use the date navigation to browse picks for tomorrow and upcoming days."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What leagues are covered in must-win team predictions?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "We cover must-win picks across 700+ leagues including the English Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, and major African and Asian competitions."
                            }
                        }
                    ]
                },
                
                // 4. BreadcrumbList (standalone)
                {
                    "@type": "BreadcrumbList",
                    "@id": `${siteUrl}/tips/must-win-teams-today#breadcrumb`,
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
                            "name": "Football Tips",
                            "item": `${siteUrl}/tips`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Must-Win Teams Today",
                            "item": `${siteUrl}/tips/must-win-teams-today`
                        }
                    ]
                },
                
                // 5. ItemList
                {
                    "@type": "ItemList",
                    "@id": `${siteUrl}/tips/must-win-teams-today#itemlist`,
                    "name": "Must-Win Football Teams Today",
                    "description": "Today's high-confidence must-win football team selections across major leagues, chosen by form, head-to-head data and statistical analysis.",
                    "url": `${siteUrl}/tips/must-win-teams-today`,
                    "numberOfItems": 10,
                    "itemListOrder": "https://schema.org/ItemListOrderDescending"
                },
                
                // 6. WebSite (for complete reference)
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

        // Check API response structure
        if (data.status === true) {
            // Calculate elapsed time
            const elapsedTime = Date.now() - startTime;
            
            return {
                props: {
                    initialData: data.data || [],
                    endpointStatus: "success",
                    error: null,
                    baseUrl: baseUrl,
                    todaysDate: todaysDate,
                    structuredData: structuredData
                }
            };
        } else {
            // API returned status: false
            return {
                props: {
                    initialData: [],
                    endpointStatus: "error",
                    error: data.message || "Failed to load competitor predictions",
                    baseUrl: baseUrl,
                    todaysDate: todaysDate,
                    structuredData: structuredData
                }
            };
        }
    } catch (error) {
        console.error('Error fetching competitor predictions:', error);
        
        // Create basic structured data for error case
        const structuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": `${siteUrl}#organization`,
                    "name": "Pitch Predictions",
                    "url": siteUrl,
                    "logo": `${siteUrl}/pitch-predictions-logo.png`,
                    "description": "Free data-driven football prediction platform covering 700+ leagues worldwide.",
                    "sameAs": ["https://t.me/s/betsassuredkenya"]
                },
                {
                    "@type": "WebPage",
                    "@id": `${siteUrl}/tips/must-win-teams-today#webpage`,
                    "name": "Must-Win Football Teams Today",
                    "url": `${siteUrl}/tips/must-win-teams-today`,
                    "isPartOf": {
                        "@id": `${siteUrl}#website`
                    },
                    "dateModified": currentDate,
                    "inLanguage": "en"
                },
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
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: baseUrl,
                todaysDate: todaysDate,
                structuredData: structuredData
            }
        };
    }
}

export default MustWinTeamsToday;