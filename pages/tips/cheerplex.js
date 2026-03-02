// pages/cheerplex-predictions.js
import React, { useState, useEffect } from "react";
import { Adsense } from "@ctrl/react-adsense";
import DataNotFoundPage from "../../components/includes/datanotfound";
import PopularTips from "../../components/shared/popular_tips_display";
import RenderData from "../../components/shared/render_fixtures_data";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PreLoader from "../../components/includes/loader";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import CheerplexPredictionsContent from "../../components/seo-content/tips/cheerplex";

function CheerplexPredictions({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate,
    popularTipsData 
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
                <DataNotFoundPage props={`No cheerplex predictions available for ${formatDisplayDate(todaysDate)}`}/>
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
        <div className="sites-card">
            <PopularTips initialMatches={popularTipsData} />
            
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
                    <CheerplexPredictionsContent/>
                </div>
            </div>
        </div>
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

export default CheerplexPredictions;