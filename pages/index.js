// pages/index.js
import React from "react";
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
    isLoading 
}) {
  
  // Show preloader while server is fetching data
  if (isLoading) {
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
  
  // Process the data - PagesMatchPredictionDetails now just returns an array of components
  const renderPredictions = PagesMatchPredictionDetails({ 
    initialData, 
    baseUrl: baseUrl
  });
  
  // Handle empty data state
  if (renderPredictions.length === 0) {
    return (
      <div className="sites-card">
        <DataNotFoundPage props="No matches available for today"/>
        <br/>
      </div>
    );
  }
  
  // Render the page with data
  return (
    <>
      <div className="sites-card">
        <p className="text-center blink_me">Looking for Premium Football Predictions!!!&nbsp;</p>
        <p className="text-center">
          <a href="/auth/login" className="btn btn-danger btn-sm">Subscribe Now</a>
        </p>
        <PopularTips/>
        <RenderData renderPredictions={renderPredictions}/>
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
  
  // Base URL without pagination params
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date=" + todaysDate;
  
  // First batch: 0-20 records
  const firstBatchUrl = `${baseUrl}&start_index=0&end_index=20`;
  
  // Set loading to true initially
  let isLoading = true;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Fetch first batch
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
    
    // Check API response structure
    if (data.status === true) {
      let finalData = data.data || [];
      
      // Check if we need to fetch the full batch (if more than 20 records)
      if (data.data && data.data.length > 20) {
        try {
          // Fetch full batch: 0-850 records
          const fullBatchUrl = `${baseUrl}&start_index=0&end_index=850`;
          
          const fullResponse = await fetch(fullBatchUrl, {
            headers: { 
              "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
            }
          });
          
          const fullData = await fullResponse.json();
          
          if (fullData.status === true) {
            finalData = fullData.data || [];
          }
        } catch (batchError) {
          console.error('Error fetching full batch:', batchError);
          // If full batch fails, keep the first batch data
        }
      }
      
      isLoading = false;
      
      return {
        props: {
          initialData: finalData,
          endpointStatus: "success",
          error: null,
          baseUrl: baseUrl,
          isLoading: isLoading
        }
      };
    } else {
      isLoading = false;
      
      return {
        props: {
          initialData: [],
          endpointStatus: "error",
          error: data.message || "API returned error",
          baseUrl: baseUrl,
          isLoading: isLoading
        }
      };
    }
  } catch (error) {
    console.error('Error fetching homepage predictions:', error);
    
    isLoading = false;
    
    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        error: error.message,
        baseUrl: baseUrl,
        isLoading: isLoading
      }
    };
  }
}