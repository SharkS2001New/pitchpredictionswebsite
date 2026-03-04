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
          <div className="container">
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
    
    // Create structured data in @graph format as requested
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": siteUrl,
          "name": "PitchPredictions",
          "url": siteUrl,
          "logo": `${siteUrl}/pitch-predictions-logo.png`,
          "description": "PitchPredictions provides free daily football predictions, expert tips, accumulator guides, jackpots, and betting insights based on team form, statistics, and performance analysis.",
          "sameAs": [
            "https://t.me/betsassuredkenya",
            "https://wa.me/254111509962"
          ]
        },
        {
          "@type": "WebSite",
          "@id": siteUrl,
          "url": siteUrl,
          "name": "PitchPredictions",
          "publisher": {
            "@id": siteUrl
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/?s={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "WebPage",
          "@id": siteUrl,
          "url": siteUrl,
          "name": "PitchPredictions – Accurate Football Predictions, Stats & Betting Insights",
          "isPartOf": {
            "@id": siteUrl
          },
          "about": {
            "@id": `${siteUrl}/about-us`
          },
          "description": "PitchPredictions offers accurate daily football predictions, detailed match stats, accumulator tips, jackpots, and betting insights to help users make smarter betting decisions.",
          "inLanguage": "en"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is PitchPredictions?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "PitchPredictions is a football prediction platform that provides accurate match forecasts, detailed statistics, and actionable betting insights for football fans and bettors worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "How accurate are PitchPredictions forecasts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our forecasts are backed by statistical models, historical data, and expert review. While no prediction is guaranteed, our methods consistently improve accuracy compared to random guessing."
              }
            },
            {
              "@type": "Question",
              "name": "What types of statistics are provided?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We provide team form, head-to-head results, goal trends, home/away performance, player availability, and tactical analysis for every match."
              }
            },
            {
              "@type": "Question",
              "name": "Do you provide betting insights?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We offer value bets, odds analysis, match strategies, and expert tips to help users make smarter betting decisions."
              }
            },
            {
              "@type": "Question",
              "name": "Are predictions free or paid?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "PitchPredictions offers both free daily predictions and premium enhanced forecasts for users who want detailed statistics, advanced analysis, and exclusive betting insights."
              }
            },
            {
              "@type": "Question",
              "name": "Which leagues are covered?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We cover major leagues worldwide including Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA competitions, World Cup matches, and selected leagues in Asia, Africa, and South America."
              }
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
          "@id": siteUrl,
          "name": "PitchPredictions",
          "url": siteUrl,
          "logo": `${siteUrl}/pitch-predictions-logo.png`,
          "description": "PitchPredictions provides free daily football predictions, expert tips, accumulator guides, jackpots, and betting insights based on team form, statistics, and performance analysis.",
          "sameAs": [
            "https://t.me/betsassuredkenya",
            "https://wa.me/254111509962"
          ]
        },
        {
          "@type": "WebSite",
          "@id": siteUrl,
          "url": siteUrl,
          "name": "PitchPredictions",
          "publisher": {
            "@id": siteUrl
          }
        },
        {
          "@type": "WebPage",
          "@id": siteUrl,
          "url": siteUrl,
          "name": "PitchPredictions – Accurate Football Predictions, Stats & Betting Insights",
          "isPartOf": {
            "@id": siteUrl
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