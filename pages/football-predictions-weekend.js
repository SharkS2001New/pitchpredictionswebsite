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
    endpointMessage, 
    error,
    baseUrl,
    saturdayDate,
    sundayDate,
    weekendDates 
}) {
    const router = useRouter();

    // Call the predictions component with props
    var renderPredictions = PagesMatchPredictionDetails({ 
        initialData, 
        endpointStatus, 
        endpointMessage, 
        error,
        baseUrl: baseUrl,
        dateParam: { saturday: saturdayDate, sunday: sundayDate } // Pass both dates
    });

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

    // If data is completely loaded. Display, Else, Show preloader
    if(renderPredictions[0]?.endpointStatus === "loading" || renderPredictions[0]?.endpointStatus === ""){
        return <PreLoader />;
    } else if(renderPredictions[0]?.endpointStatus === "error" || error){
        return (
            <>                
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
            </>
        );
    } else if(renderPredictions.length > 0){
        return(
            <>                
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
            </>
        );
    }
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
                const fullBatchUrl = `${baseUrl}?saturday_date=${saturdayDate}&sunday_date=${sundayDate}&start_index=0&end_index=850`;
                
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
                console.error('Error fetching full batch for weekend games:', batchError);
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
                saturdayDate: saturdayDate,
                sundayDate: sundayDate,
                weekendDates: weekendDates
            }
        };
    } catch (error) {
        console.error('Error fetching weekend predictions:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                endpointMessage: "Failed to load weekend predictions",
                error: error.message,
                baseUrl: baseUrl,
                saturdayDate: saturdayDate,
                sundayDate: sundayDate,
                weekendDates: weekendDates
            }
        };
    }
}

export default WeekendFixtures;