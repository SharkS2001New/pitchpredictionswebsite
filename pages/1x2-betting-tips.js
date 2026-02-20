// pages/index.js
import React from "react";
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
    endpointMessage, 
    error,
    baseUrl,
    todaysDate 
}) {
  
  // Call the predictions component with props
  var renderPredictions = PagesMatchPredictionDetails({ 
    initialData, 
    endpointStatus, 
    endpointMessage, 
    error,
    baseUrl: baseUrl,
    dateParam: todaysDate
  });

  // If data is completely loaded. Display, Else, Show preloader
  if(renderPredictions[0]?.endpointStatus === "loading" || renderPredictions[0]?.endpointStatus === ""){
      return <PreLoader />;
  } else if(renderPredictions[0]?.endpointStatus === "error" || error){
      return (
          <>
              <div className="sites-card">
                  <DataNotFoundPage props="We don't have any matches to show you right now, please try again later"/>
                  <br/>
              </div>
          </>
      );
  } else if(renderPredictions.length > 0){
      return(
          <>              
              <div className="sites-card">
                  <PopularTips/>
                  
                  <RenderData renderPredictions={renderPredictions}/>
                  
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
          </>
      );
  }
}

export async function getServerSideProps() {
  const todaysDate = getFormattedCurrentDate();
  
  // Base URL for top winning predictions
  const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions";
  
  // First batch: 0-20 records
  const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
  
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
    
    let finalData = data.status ? data.data : [];
    let finalStatus = data.status ? "success" : "error";
    let finalMessage = data.message || "";
    
    // Check if we need to fetch the full batch (if more than 20 records)
    if (data.status && data.data && data.data.length > 20) {
      try {
        // Fetch full batch: 0-850 records
        const fullBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=850`;
        
        const fullResponse = await fetch(fullBatchUrl, {
          headers: { 
            "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
          }
        });
        
        const fullData = await fullResponse.json();
        
        if (fullData.status === true) {
          finalData = fullData.data;
          finalMessage = fullData.message;
          finalStatus = "success";
        }
      } catch (batchError) {
        console.error('Error fetching full batch:', batchError);
        // If full batch fails, keep the first batch data
      }
    }
    
    return {
      props: {
        initialData: finalData,
        endpointStatus: finalStatus,
        endpointMessage: finalMessage,
        error: null,
        baseUrl: baseUrl,
        todaysDate: todaysDate
      }
    };
  } catch (error) {
    console.error('Error fetching homepage predictions:', error);
    
    return {
      props: {
        initialData: [],
        endpointStatus: "error",
        endpointMessage: "Failed to load predictions",
        error: error.message,
        baseUrl: baseUrl,
        todaysDate: todaysDate
      }
    };
  }
}