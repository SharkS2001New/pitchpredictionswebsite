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
import fs from 'fs';
import path from 'path';

export default function Home({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    cacheInfo
}) {
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
      const chunkUrl = `${baseUrl}&start_index=${startIndex}&end_index=${endIndex}`;
      
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

  if (typeof window === 'undefined' || (!initialData && !error)) {
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
  
  // Cache setup
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
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Check if we have a valid cache file (3 minutes = 180000 ms)
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInMinutes = (now - cacheTime) / (1000 * 60);
      
      if (ageInMinutes <= 3) {
        // Cache is valid - use it!
        initialData = cache.data;
        cacheInfo = {
          fromCache: true,
          generatedAt: cache.generatedAt
        };
      } else {
        // Cache expired - delete it
        fs.unlinkSync(cachePath);
      }
    }

    // If no valid cache, fetch from API
    if (initialData.length === 0) {
      const response = await fetch(firstBatchUrl, {
        headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.status === true && data.data) {
        initialData = data.data;
        
        // Save to cache
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
          generatedAt: cacheData.generatedAt
        };
      } else {
        endpointStatus = "error";
        error = data.message || "API returned error";
      }
    }

    // Clean up old cache files
    cleanupOldCacheFiles(cacheDir);

  } catch (err) {
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

// Helper function to clean up old cache files
function cleanupOldCacheFiles(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;
    
    const files = fs.readdirSync(cacheDir);
    const now = new Date().getTime();
    const maxAge = 3 * 60 * 1000; // 3 minutes
    
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
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}