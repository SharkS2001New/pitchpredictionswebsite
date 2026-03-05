// pages/index.js
import React, { useState, useEffect } from "react";
import getFormattedCurrentDate from '../components/functions/GetTodaysDate';
import DataNotFoundPage from '../components/includes/datanotfound';
import PreLoader from '../components/includes/loader';
import PagesMatchPredictionDetails from '../components/shared/pages_match_predictions_details';
import RenderData from '../components/shared/render_fixtures_data';
import { Adsense } from "@ctrl/react-adsense";
import PopularTips from "../components/shared/popular_tips_display";
import ShortBlogPosts from "../components/shared/short-blog-posts";
import LandingPageContent from "../components/seo-content/mainpages/landing-page";

export default function Home({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    structuredData
}) {
  const [allData, setAllData] = useState(initialData || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentStartIndex, setCurrentStartIndex] = useState(20); // Start after the first 20
  const [hasMore, setHasMore] = useState(true);
  const [loadTrigger, setLoadTrigger] = useState(0); // Used to trigger loads from OtherPagesRenders

  // This function will be called from OtherPagesRenders when "Show More" is clicked
  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const chunkSize = 50;
    const startIndex = currentStartIndex;
    const endIndex = Math.min(currentStartIndex + chunkSize - 1, 850);
    
    try {
      const chunkUrl = `${baseUrl}&start_index=${startIndex}&end_index=${endIndex}`;
      
      const response = await fetch(chunkUrl, {
        headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const chunkData = await response.json();
      
      if (chunkData.status === true && chunkData.data && chunkData.data.length > 0) {
        // Append new data to existing data
        setAllData(prevData => [...prevData, ...chunkData.data]);
        setCurrentStartIndex(endIndex + 1);
        
        // Check if we've reached the maximum (850)
        if (endIndex >= 850 || chunkData.data.length < chunkSize) {
          setHasMore(false);
        }
      } else {
        // No more data available
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Expose the loadMore function to child components via a custom event or context
  // For now, we'll use a useEffect that watches loadTrigger
  useEffect(() => {
    if (loadTrigger > 0) {
      loadMoreData();
    }
  }, [loadTrigger]);

  // Function to be called from child components (will be passed down)
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
      </div>
    );
  }
  
  // Process the data - Pass the loadMore function down
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
      </div>
    );
  }
  
  return (
    <>
      {/* Structured Data Script - Using @graph format */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="sites-card">
        <p className="text-center blink_me">Looking for Premium Football Predictions!!!&nbsp;</p>
        <p className="text-center">
          <a href="/auth/login" className="btn btn-danger btn-sm">Subscribe Now</a>
        </p>
        <PopularTips/>
        
        <RenderData 
          renderPredictions={renderPredictions} 
          onLoadMore={handleLoadMore}
          isLoadingMore={loadingMore}
          hasMore={hasMore}
        />
        
        <br/>
        <div className="text-center">
          <a className="btn btn-danger btn-sm" href="/football-predictions-today" role="button">Football Predictions for Today</a>
        </div>
        <br/>
        <Adsense
          client="ca-pub-5665711413000284"
          slot="3850951453"
          style={{ display: "block" }}
          layout="display"
          format="auto"
        />
        
        <ShortBlogPosts/>
        <br/>  
        <div className="">
          <div className="container-wide">
            <LandingPageContent/>
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
  const currentDateTime = new Date().toISOString();
  
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date=" + todaysDate;
  const firstBatchUrl = `${baseUrl}&start_index=0&end_index=20`;
  
  try {
    const response = await fetch(firstBatchUrl, {
      headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    // Create structured data in @graph format with ALL schemas from the HTML head
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        // 1. Organization
        {
          "@type": "Organization",
          "@id": `${siteUrl}#organization`,
          "name": "Pitch Predictions",
          "alternateName": "PitchPredictions",
          "url": siteUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/pitch-predictions-logo.png`,
            "width": 300,
            "height": 60
          },
          "description": "Pitch Predictions is a free, data-driven football prediction platform covering 700+ leagues worldwide. We provide daily football tips, live scores, jackpot predictions, team comparisons and standings.",
          "foundingDate": "2020",
          "areaServed": ["GB", "KE", "NG", "GH", "ZA", "UG", "TZ"],
          "sameAs": [
            "https://t.me/s/betsassuredkenya"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "url": `${siteUrl}/contactus`,
            "availableLanguage": "English"
          }
        },
        
        // 2. SportsOrganization
        {
          "@type": "SportsOrganization",
          "name": "Pitch Predictions",
          "url": siteUrl,
          "sport": "Football",
          "description": "Free football prediction and sports analytics platform covering 700+ leagues globally."
        },
        
        // 3. WebSite with Sitelinks Searchbox
        {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          "name": "Pitch Predictions",
          "alternateName": "Free Football Predictions & Tips",
          "url": siteUrl,
          "description": "Free daily football predictions, tips, live scores and jackpot picks across 700+ leagues worldwide.",
          "inLanguage": "en",
          "copyrightYear": 2026,
          "publisher": {
            "@type": "Organization",
            "@id": `${siteUrl}#organization`
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        },
        
        // 4. WebPage
        {
          "@type": "WebPage",
          "@id": `${siteUrl}#webpage`,
          "name": "Pitch Predictions – Free Football Tips & Match Predictions",
          "description": "Get free, data-driven football predictions for today's matches across 700+ leagues. Expert tips, live scores, jackpot picks & standings — updated daily.",
          "url": siteUrl,
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${siteUrl}#website`
          },
          "about": {
            "@type": "Thing",
            "name": "Football Predictions"
          },
          "dateModified": currentDate,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              }
            ]
          }
        },
        
        // 5. FAQPage
        {
          "@type": "FAQPage",
          "@id": `${siteUrl}#faq`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are Pitch Predictions football tips free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. All daily predictions, live scores, league standings, team comparisons and jackpot tips on Pitch Predictions are completely free. A premium subscription unlocks our highest-confidence exclusive tips and early-access picks."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate are Pitch Predictions football tips?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our top-confidence predictions carry a 65%+ historical accuracy rate, calculated using a multi-factor model including current form, head-to-head records, team news, home/away performance, and betting market movements. No prediction is guaranteed — we provide analysis to inform, not to promise outcomes."
              }
            },
            {
              "@type": "Question",
              "name": "Which football leagues does Pitch Predictions cover?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pitch Predictions covers over 700 football leagues worldwide including the English Premier League, La Liga, Bundesliga, Serie A, Ligue 1, UEFA Champions League, Europa League, Africa Cup of Nations, Sportpesa Mega Jackpot, Betika Jackpot and dozens of regional competitions across Africa, Asia, and the Americas."
              }
            },
            {
              "@type": "Question",
              "name": "How often are the predictions updated?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Predictions are refreshed daily, with live match data updating in real-time throughout the day. Jackpot predictions are updated weekly before each jackpot deadline."
              }
            },
            {
              "@type": "Question",
              "name": "Does Pitch Predictions cover jackpot predictions?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Pitch Predictions provides dedicated jackpot prediction pages for Sportpesa Mega Jackpot, Betika Jackpot, Betpawa, and Mozzart — updated weekly with expert analysis for every selection on the coupon."
              }
            },
            {
              "@type": "Question",
              "name": "What types of football predictions does Pitch Predictions offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer 1X2 match winner predictions, Over/Under goals tips (Over 2.5, Under 2.5), Both Teams to Score (BTTS/GG/NG) predictions, Correct Score tips, Asian Handicap picks, and jackpot predictions. Each tip comes with a confidence percentage and supporting statistical analysis."
              }
            }
          ]
        },
        
        // 6. ItemList - Today's Top Predictions
        {
          "@type": "ItemList",
          "@id": `${siteUrl}#top-predictions`,
          "name": "Today's Top Football Predictions",
          "description": "Expert football predictions for today's matches across major leagues worldwide.",
          "url": `${siteUrl}/football-predictions-today`,
          "numberOfItems": 3,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Premier League Predictions Today",
              "url": `${siteUrl}/league/football-predictions-for-england/premier-league-39/fixtures`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Champions League Predictions",
              "url": `${siteUrl}/league/football-predictions-for-europe/champions-league/fixtures`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Jackpot Predictions This Week",
              "url": `${siteUrl}/jackpot-predictions`
            }
          ]
        },
        
        // 7. BreadcrumbList (additional breadcrumb for homepage)
        {
          "@type": "BreadcrumbList",
          "@id": `${siteUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Football Predictions",
              "item": siteUrl
            }
          ]
        }
      ]
    };

    if (data.status === true) {
      return {
        props: {
          initialData: data.data || [],
          endpointStatus: "success",
          error: null,
          baseUrl: baseUrl,
          structuredData: structuredData
        }
      };
    } else {
      return {
        props: {
          initialData: [],
          endpointStatus: "error",
          error: data.message || "API returned error",
          baseUrl: baseUrl,
          structuredData: structuredData
        }
      };
    }
  } catch (error) {
    console.error('Error fetching homepage predictions:', error);
    
    // Create basic structured data even if API fails
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}#organization`,
          "name": "Pitch Predictions",
          "alternateName": "PitchPredictions",
          "url": siteUrl,
          "logo": `${siteUrl}/pitch-predictions-logo.png`,
          "description": "Pitch Predictions is a free, data-driven football prediction platform covering 700+ leagues worldwide.",
          "sameAs": ["https://t.me/s/betsassuredkenya"]
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`,
          "name": "Pitch Predictions",
          "url": siteUrl,
          "publisher": {
            "@id": `${siteUrl}#organization`
          }
        },
        {
          "@type": "WebPage",
          "@id": `${siteUrl}#webpage`,
          "url": siteUrl,
          "name": "Pitch Predictions – Accurate Football Predictions, Stats & Betting Insights",
          "isPartOf": {
            "@id": `${siteUrl}#website`
          },
          "description": "PitchPredictions offers accurate daily football predictions, detailed match stats, accumulator tips, jackpots, and betting insights.",
          "inLanguage": "en"
        }
      ]
    };
    
    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: error.message,
        baseUrl: baseUrl,
        structuredData: structuredData
      }
    };
  }
}