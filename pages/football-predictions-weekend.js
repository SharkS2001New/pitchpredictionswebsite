// pages/football-predictions-weekend.js
import React from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import DateofWeekend from "../components/functions/compute_weekend_dates";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions-weekend/filter-pred1x2-ov-un-dc-ht-ft";
import WeekendFootballPredictionsContent from "../components/seo-content/mainpages/football-predictions-weekend";

function WeekendFixtures({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    saturdayDate,
    sundayDate
}) {
    const router = useRouter();

    // Show preloader while server is fetching data
    if (typeof window === 'undefined') {
        return <PreLoader />;
    }

    // Format weekend dates for display
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

    const formatWeekendRange = () => {
        if (!saturdayDate || !sundayDate) return '';
        return `${formatDisplayDate(saturdayDate)} - ${formatDisplayDate(sundayDate)}`;
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
                <DataNotFoundPage props={`No matches available for weekend ${formatWeekendRange()}`}/>
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
            <div className="container-fluid">
                <div className="row" style={{backgroundColor: "#edf3f5"}}>
                    <div className="col-md-1 col-2"></div>
                    <div className="col-md-10 col-12">
                        <FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
                    </div>
                    <div className="col-md-1 col-1"></div>
                </div>
            </div>
            
            <RenderData renderPredictions={renderPredictions}/>
            
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
                    <WeekendFootballPredictionsContent/>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps() {
    // Get weekend dates
    const weekendDates = DateofWeekend();
    const saturdayDate = weekendDates[0];
    const sundayDate = weekendDates[1];
    
    // Base URL for weekend fixtures
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_weekend_fixtures";
    
    // First batch: 0-20 records
    const firstBatchUrl = `${baseUrl}?saturday_date=${saturdayDate}&sunday_date=${sundayDate}&start_index=0&end_index=20`;
    
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
                    const fullBatchUrl = `${baseUrl}?saturday_date=${saturdayDate}&sunday_date=${sundayDate}&start_index=0&end_index=850`;
                    
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
                    console.error('Error fetching full batch for weekend games:', batchError);
                    // If full batch fails, keep the first batch data
                }
            }
            
            // Calculate elapsed time
            const elapsedTime = Date.now() - startTime;
            
            // If fetch was too fast, add a small delay to show preloader (optional)
            if (elapsedTime < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
            }
            
            return {
                props: {
                    initialData: finalData,
                    endpointStatus: "success",
                    error: null,
                    baseUrl: baseUrl,
                    saturdayDate: saturdayDate,
                    sundayDate: sundayDate
                }
            };
        } else {
            // API returned status: false
            return {
                props: {
                    initialData: [],
                    endpointStatus: "error",
                    error: data.message || "Failed to load weekend predictions",
                    baseUrl: baseUrl,
                    saturdayDate: saturdayDate,
                    sundayDate: sundayDate
                }
            };
        }
    } catch (error) {
        console.error('Error fetching weekend predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: baseUrl,
                saturdayDate: saturdayDate,
                sundayDate: sundayDate
            }
        };
    }
}

export default WeekendFixtures;