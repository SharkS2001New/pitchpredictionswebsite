// pages/competitor-predictions.js
import React from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import PopularTips from "../../components/shared/popular_tips_display";

function CompetitorPredictions({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    todaysDate 
}){     
    const router = useRouter();

    // Show preloader while server is fetching data
    if (typeof window === 'undefined') {
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
    
    // Process the data - PagesMatchPredictionDetails now just returns an array of components
    const renderPredictions = PagesMatchPredictionDetails({ 
        initialData,
        baseUrl: baseUrl
    });
    
    // Handle empty data state
    if (renderPredictions.length === 0) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props={`No competitor predictions available for ${formatDisplayDate(todaysDate)}`}/>
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
            <PopularTips />
            
            <RenderData renderPredictions={renderPredictions}/>
            
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

export async function getServerSideProps() {
    const todaysDate = getFormattedCurrentDate();
    
    // Base URL for top winning predictions
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_top_winning_predictions";
    
    // First batch: 0-20 records
    const firstBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=20`;
    
    // Record start time to ensure minimum loading time if needed
    const startTime = Date.now();
    
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
                    const fullBatchUrl = `${baseUrl}?fixture_date=${todaysDate}&start_index=0&end_index=400`;
                    
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
                    console.error('Error fetching full batch for competitor predictions:', batchError);
                    // If full batch fails, keep the first batch data
                }
            }        
            
            return {
                props: {
                    initialData: finalData,
                    endpointStatus: "success",
                    error: null,
                    baseUrl: baseUrl,
                    todaysDate: todaysDate
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
                    todaysDate: todaysDate
                }
            };
        }
    } catch (error) {
        console.error('Error fetching competitor predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: baseUrl,
                todaysDate: todaysDate
            }
        };
    }
}

export default CompetitorPredictions;