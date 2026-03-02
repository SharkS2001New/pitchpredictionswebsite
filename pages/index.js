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
    popularTipsData // Add this prop
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
      <div className="sites-card">
        <p className="text-center blink_me">Looking for Premium Football Predictions!!!&nbsp;</p>
        <p className="text-center">
          <a href="/auth/login" className="btn btn-danger btn-sm">Subscribe Now</a>
        </p>
        <PopularTips initialMatches={popularTipsData} />
        
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
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date=" + todaysDate;
  const firstBatchUrl = `${baseUrl}&start_index=0&end_index=20`;
  
  // Fetch popular tips data in parallel with main data
  const startDate = new Date().toLocaleDateString("en-CA");
  const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString("en-CA"); 
  const popularTipsUrl = `https://api.pitchpredictions.com/api/fetch_free_upcoming_matches?start_date=${startDate}&end_date=${endDate}`;
  
  try {
    // Fetch both APIs in parallel - this is KEY
    const [mainResponse, popularTipsPromise] = await Promise.allSettled([
      fetch(firstBatchUrl, {
        headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
      }),
      fetch(popularTipsUrl, {
        headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
      })
    ]);
    
    // Process main data (required)
    let mainData = { status: false, data: [] };
    if (mainResponse.status === 'fulfilled' && mainResponse.value.ok) {
      mainData = await mainResponse.value.json();
    } else {
      throw new Error('Main API failed');
    }
    
    // Process popular tips (optional - don't fail if this errors)
    let popularTipsData = [];
    if (popularTipsPromise.status === 'fulfilled' && popularTipsPromise.value.ok) {
      const popularTipsJson = await popularTipsPromise.value.json();
      popularTipsData = popularTipsJson.data || [];
    } else {
      console.log('Popular tips fetch failed, continuing without them');
      // Don't throw error - just continue with empty array
    }
    
    if (mainData.status === true) {
      return {
        props: {
          initialData: mainData.data || [],
          endpointStatus: "success",
          error: null,
          baseUrl: baseUrl,
          popularTipsData: popularTipsData
        }
      };
    } else {
      return {
        props: {
          initialData: [],
          endpointStatus: "error",
          error: mainData.message || "API returned error",
          baseUrl: baseUrl,
          popularTipsData: popularTipsData
        }
      };
    }
  } catch (error) {
    console.error('Error fetching homepage predictions:', error);
    
    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: error.message,
        baseUrl: baseUrl,
        popularTipsData: [] // Empty array as fallback
      }
    };
  }
}