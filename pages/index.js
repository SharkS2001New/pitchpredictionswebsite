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
import fs from 'fs';
import path from 'path';

export default function Home({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    structuredData,
    isMobile = false
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
  
  // IMPORTANT FIX: Call as function to get array, not as JSX component
  const renderPredictionsArray = PagesMatchPredictionDetails({ 
    gamesData: allData,
    isLoading: loadingMore,
    loadedCount: allData.length,
    totalCount: 850,
    isMobile: isMobile
  });
  
  // Check if we have any predictions to show
  const hasPredictions = renderPredictionsArray && renderPredictionsArray.length > 0;
  
  if (!hasPredictions && !loadingMore && (!initialData || initialData.length === 0)) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="No matches available for today"/>
        <br/>
      </div>
    );
  }
  
  return (
    <>
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
          renderPredictions={renderPredictionsArray} 
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

export async function getServerSideProps({ req }) {
  const todaysDate = "2026-05-25";
  const siteUrl = 'https://www.pitchpredictions.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Detect if mobile
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  
  // API base URL
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date=" + todaysDate;
  
  // Cache setup - store only the first 20 items
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cacheFilename = `top-football-predictions-${todaysDate}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);
  
  let initialData = [];
  let endpointStatus = "success";
  let error = null;

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Check if we have a valid cache file
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInMinutes = (now - cacheTime) / (1000 * 60);
      
      if (ageInMinutes <= 3) {
        initialData = cache.data;
      } else {
        fs.unlinkSync(cachePath);
      }
    }

    // If we don't have valid cache data, fetch from API
    if (initialData.length === 0) {
      const firstBatchUrl = `${baseUrl}&start_index=0&end_index=20`;
      const response = await fetch(firstBatchUrl, {
        headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.status === true && data.data) {
        initialData = data.data;

        console.log(initialData);
        
        // Save to cache
        const cacheData = {
          generatedAt: new Date().toISOString(),
          fixtureDate: todaysDate,
          data: initialData,
          count: initialData.length
        };
        
        fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      } else {
        endpointStatus = "error";
        error = data.message || "API returned error";
      }
    }

    // Clean up old cache files
    await cleanupOldCacheFiles(cacheDir);

  } catch (err) {
    console.error('Error in getServerSideProps:', err);
    endpointStatus = "error";
    error = err.message;
    
    // Try fallback cache
    if (fs.existsSync(cachePath)) {
      try {
        const cacheContent = fs.readFileSync(cachePath, 'utf8');
        const cache = JSON.parse(cacheContent);
        initialData = cache.data;
        endpointStatus = "success";
        error = null;
      } catch (fallbackErr) {
        console.error('Fallback cache failed:', fallbackErr);
      }
    }
  }

  // Create structured data
  const structuredData = createStructuredData(siteUrl, currentDate);

  return {
    props: {
      initialData,
      endpointStatus,
      error,
      baseUrl,
      structuredData,
      isMobile
    }
  };
}

async function cleanupOldCacheFiles(cacheDir) {
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

function createStructuredData(siteUrl, currentDate) {
  return {
    "@context": "https://schema.org",
    "@graph": [
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
        "description": "Pitch Predictions is a free, data-driven football prediction platform covering 700+ leagues worldwide.",
        "foundingDate": "2020",
        "areaServed": ["GB", "KE", "NG", "GH", "ZA", "UG", "TZ"],
        "sameAs": ["https://t.me/s/betsassuredkenya"],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "url": `${siteUrl}/contactus`,
          "availableLanguage": "English"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "name": "Pitch Predictions",
        "alternateName": "Free Football Predictions & Tips",
        "url": siteUrl,
        "description": "Free daily football predictions, tips, live scores and jackpot picks across 700+ leagues worldwide.",
        "inLanguage": "en",
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
      {
        "@type": "WebPage",
        "@id": `${siteUrl}#webpage`,
        "url": siteUrl,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`
        },
        "dateModified": currentDate
      }
    ]
  };
}