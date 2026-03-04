// pages/index.js
import React, { useState, useEffect } from "react";
import getFormattedCurrentDate from '../components/functions/GetTodaysDate';
import DataNotFoundPage from '../components/includes/datanotfound';
import PreLoader from '../components/includes/loader';
import PagesMatchPredictionDetails from '../components/shared/pages_match_predictions_details';
import RenderData from '../components/shared/render_fixtures_data';
import { Adsense } from "@ctrl/react-adsense";
import PopularTips from "../components/shared/popular_tips_display";
import OneXTwoContent from "../components/seo-content/mainpages/1x2-betting-tips";

export default function Home({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
}) {
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
    const endIndex = Math.min(currentStartIndex + chunkSize - 1, 850);
    
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
  if (typeof window === 'undefined' || (!initialData && !error)) {
    return <PreLoader />;
  }

  // Handle error state
  if (endpointStatus === "error" || error) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="We don't have any matches to show you right now, please try again later"/>
        <br/>
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
        <DataNotFoundPage props="No matches available for today"/>
        <br/>
      </div>
    );
  }
  
  // Render the page with data
  return (
    <div className="sites-card">
      <PopularTips/>
      
      <RenderData 
        renderPredictions={renderPredictions}
        onLoadMore={handleLoadMore}
        isLoadingMore={loadingMore}
        hasMore={hasMore}
      />
      
      <br/>
      
      <div className="text-center">
        <a className="btn btn-danger btn-sm" href="/football-predictions-today" role="button">
          Football Predictions for Today
        </a>
      </div>
      
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
          <OneXTwoContent/>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const todaysDate = getFormattedCurrentDate();
  
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date=" + todaysDate;
  const firstBatchUrl = `${baseUrl}&start_index=0&end_index=20`;
  
  try {
    const response = await fetch(firstBatchUrl, {
      headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (data.status === true) {
      return {
        props: {
          initialData: data.data || [],
          endpointStatus: "success",
          error: null,
          baseUrl: baseUrl
        }
      };
    } else {
      return {
        props: {
          initialData: [],
          endpointStatus: "error",
          error: data.message || "API returned error",
          baseUrl: baseUrl
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
        baseUrl: baseUrl
      }
    };
  }
}