// pages/football-predictions/[filter_date].js
import React from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/football-predictions/filter-pred1x2-ov-un-dc-ht-ft";

function FootballPredictionsByDate({ 
    initialData, 
    endpointStatus, 
    endpointMessage, 
    error,
    baseUrl,
    filterDate 
}) {
    const router = useRouter();

    // Call the predictions component with props (same pattern as homepage)
    var renderPredictions = PagesMatchPredictionDetails({ 
        initialData, 
        endpointStatus, 
        endpointMessage, 
        error,
        baseUrl: baseUrl,
        dateParam: filterDate
    });

    // Format date for display
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
                                <FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 
                                    url_filter="football-predictions" 
                                    filter_date={filterDate} 
                                />
                            </div>
                            <div className="col-md-1 col-1"></div>
                        </div>
                    </div>
                    
                    <RenderData renderPredictions={renderPredictions} />
                    
                    <br/>
                    
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                    
                    <br/> 
                </div>
            </>
        );
    }
}

export async function getServerSideProps({ params, query }) {
    // Get filter_date from params (dynamic route) or query
    const filterDate = params?.filter_date || query.filter_date || '';
    
    if (!filterDate) {
        return {
            notFound: true
        };
    }
    
    // Base URL for fetching fixtures by date
    const baseUrl = "https://api.pitchpredictions.com/api/fetch_fixtures_by_date";
    
    // First batch: 0-20 records (like homepage pattern)
    const firstBatchUrl = `${baseUrl}?fixture_date=${filterDate}&start_index=0&end_index=20`;
    
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
                const fullBatchUrl = `${baseUrl}?fixture_date=${filterDate}&start_index=0&end_index=850`;
                
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
                console.error('Error fetching full batch for date:', batchError);
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
                filterDate: filterDate
            }
        };
    } catch (error) {
        console.error('Error fetching predictions by date:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                endpointMessage: "Failed to load predictions",
                error: error.message,
                baseUrl: baseUrl,
                filterDate: filterDate
            }
        };
    }
}

export default FootballPredictionsByDate;