// pages/country/[football-prediction-for-country]/results.js
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";

function FootballPredictionsByCountry({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    countryName,
    displayCountryName,
    initialCountriesTopData
}) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [countriesTopdata, setCountriesTopData] = useState(initialCountriesTopData || "");

    // Client-side only: check for mobile
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 760);
        }
    }, []);

    // Window resize detection (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        function detectWindowSize() {
            setIsMobile(window.innerWidth < 760);
        }
        
        window.addEventListener('resize', detectWindowSize);
        return () => window.removeEventListener('resize', detectWindowSize);
    }, []);

    // Process the data - PagesMatchPredictionDetails now just returns an array of components
    const renderPredictions = PagesMatchPredictionDetails({ 
        gamesData: initialData, // Use initialData directly since no pagination needed
    });

    // Format country name for display (if displayCountryName not provided)
    const formatCountryName = (name) => {
        if (!name) return '';
        return name.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const displayName = displayCountryName || formatCountryName(countryName);

    // Handle error state
    if (endpointStatus === "error" || error) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <CountriesDetailsTop props={countriesTopdata[0]} />
                    <FiltersCountriesDetails 
                        country_name={countryName} 
                        url_filter={router.pathname.substring(1)} 
                    />
                </div>
                <div className="sites-card">
                    <DataNotFoundPage props="We don't have any matches for this country to show you right now, please try again later."/>
                    <br/>
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7856848919"
                                style={{ display: "block" }}
                                layout="display"
                                format="auto"
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    // Handle empty data state
    if (renderPredictions.length === 0) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <CountriesDetailsTop props={countriesTopdata[0]} />
                    <FiltersCountriesDetails 
                        country_name={countryName} 
                        url_filter={router.pathname.substring(1)} 
                    />
                </div>
                <div className="sites-card">
                    <DataNotFoundPage props={`No results available for ${displayName}`}/>
                    <br/>
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7856848919"
                                style={{ display: "block" }}
                                layout="display"
                                format="auto"
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    // Render the page with data
    return (
        <React.Fragment>
            <div className="sites-card mb-2">
                <CountriesDetailsTop props={countriesTopdata[0]} />
                <FiltersCountriesDetails 
                    country_name={countryName} 
                    url_filter={router.pathname.substring(1)} 
                />
            </div>
            
            <div className="sites-card">
                <RenderData renderPredictions={renderPredictions} isMobile={isMobile} />
                
                <br/>
                
                <div className="desktop-container-resize mb-1">
                    <div className="col-sm-12 text-center bg-light pt-1">
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7624930534"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export async function getServerSideProps(context) {
    // Get the full parameter from the URL
    // URL: /country/football-predictions-for-brazil/results
    // params: { "football-prediction-for-country": "football-predictions-for-brazil" }
    const fullParam = context.params?.["football-prediction-for-country"] || '';
    
    console.log('Full URL param:', fullParam);
    
    // Extract the country name (remove the prefix)
    const prefix = "football-predictions-for-";
    let extractedCountry = fullParam;
    
    if (fullParam.startsWith(prefix)) {
        extractedCountry = fullParam.substring(prefix.length);
    }
    
    // For API calls, replace hyphens with spaces
    const countryNameForApi = extractedCountry.replace(/-/g, ' ');
    
    // For display, capitalize each word
    const displayCountryName = extractedCountry
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // If no country name found, return error
    if (!countryNameForApi) {
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: "No country specified",
                baseUrl: "https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country",
                countryName: "",
                displayCountryName: "",
                initialCountriesTopData: []
            }
        };
    }
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };
    
    try {
        // Fetch top countries data
        let countriesTopData = [];
        try {
            const topUrl = `https://api.pitchpredictions.com/api/fetch_countries_top_data?country_name=${encodeURIComponent(countryNameForApi)}`;
            console.log('Fetching top data:', topUrl);
            
            const topResponse = await fetch(topUrl, { headers });
            const topData = await topResponse.json();
            if (topData.status === true) {
                countriesTopData = topData.data || [];
            }
        } catch (topError) {
            console.error('Error fetching countries top data:', topError);
        }
        
        // Fetch results fixtures by country (first batch: 0-20)
        const resultsUrl = `https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=20`;
        console.log('Fetching results fixtures:', resultsUrl);
        
        const resultsResponse = await fetch(resultsUrl, { headers });
        
        if (!resultsResponse.ok) {
            throw new Error(`HTTP error! status: ${resultsResponse.status}`);
        }
        
        const resultsData = await resultsResponse.json();
        
        // Check if we need to fetch more than 20 records
        let finalResultsData = resultsData.data || [];
        
        if (resultsData.status === true && resultsData.data && resultsData.data.length > 20) {
            try {
                // Fetch full batch: 0-850 records
                const fullBatchUrl = `https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=850`;
                console.log('Fetching full batch:', fullBatchUrl);
                
                const fullResponse = await fetch(fullBatchUrl, { headers });
                const fullData = await fullResponse.json();
                
                if (fullData.status === true) {
                    finalResultsData = fullData.data || [];
                }
            } catch (batchError) {
                console.error('Error fetching full batch:', batchError);
            }
        }
        
        return {
            props: {
                initialData: finalResultsData,
                endpointStatus: resultsData.status === true ? "success" : "error",
                error: resultsData.status === true ? null : (resultsData.message || "Failed to load country results"),
                baseUrl: "https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                initialCountriesTopData: countriesTopData
            }
        };
    } catch (error) {
        console.error('Error fetching country results:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: "https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                initialCountriesTopData: []
            }
        };
    }
}

export default FootballPredictionsByCountry;