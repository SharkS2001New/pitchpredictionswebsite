// pages/country/[football-prediction-for-country]/results.js
import React, { useEffect, useState, useCallback } from "react";
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
    countryName,
    displayCountryName,
    initialCountriesTopData,
    hasResults,
    hasMoreResults
}) {
    const router = useRouter();
    const [countriesTopdata, setCountriesTopData] = useState(initialCountriesTopData || "");
    const [resultsData, setResultsData] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
    const [hasMore, setHasMore] = useState(hasMoreResults);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Fetch more results with pagination
    const loadMoreResults = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = currentStartIndex + chunkSize - 1;
        
        try {
            const url = `https://develop.pitchpredictions.com/api/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`;
            const response = await fetch(url, { headers });
            const data = await response.json();
            
            if (data.status === true && data.data && data.data.length > 0) {
                setResultsData(prev => [...prev, ...data.data]);
                setCurrentStartIndex(prev => prev + data.data.length);
                
                if (data.data.length < chunkSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more results:', error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, currentStartIndex, countryName]);

    // Process the data
    const renderPredictions = resultsData.length > 0 
        ? PagesMatchPredictionDetails({ gamesData: resultsData })
        : [];

    const displayName = displayCountryName || (countryName ? countryName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '');

    // Handle loading state
    if (!router.isReady) {
        return <PreLoader />;
    }

    // Handle initial loading state
    if (!initialData && !error) {
        return <PreLoader />;
    }

    // Handle error state
    if (endpointStatus === "error" && !hasResults) {
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
                    <DataNotFoundPage props="We don't have any results for this country to show you right now, please try again later."/>
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
    if (renderPredictions.length === 0 && !loadingMore) {
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
                <div className="desktop-container-resize mb-1">
                    <div className="col-sm-12 text-center bg-light pt-1">
                        <h2 className="sectionTitle">Results - {displayName}</h2>
                    </div>
                </div>
                
                <RenderData renderPredictions={renderPredictions} />
                
                {/* Show More button for pagination */}
                {hasMore && (
                    <div className="text-center my-2">
                        <button
                            className="btn btn-link btn-sm fixturesTextSize"
                            style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
                            onClick={loadMoreResults}
                            disabled={loadingMore}>
                            {loadingMore ? (
                                <PreLoader />
                            ) : (
                                "Show More Results"
                            )}
                        </button>
                    </div>
                )}
                
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
    const fullParam = context.params?.["football-prediction-for-country"] || '';
    
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
                countryName: "",
                displayCountryName: "",
                initialCountriesTopData: [],
                hasResults: false,
                hasMoreResults: false
            }
        };
    }
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };
    
    // Initialize data variables
    let countriesTopData = [];
    let resultsData = [];
    let hasResults = false;
    let hasMoreResults = false;
    
    try {
        // 1. Fetch top countries data
        try {
            const topUrl = `https://develop.pitchpredictions.com/api/fetch_countries_top_data?country_name=${encodeURIComponent(countryNameForApi)}`;
            const topResponse = await fetch(topUrl, { headers });
            const topData = await topResponse.json();
            
            if (topData.status === true) {
                countriesTopData = topData.data || [];
            }
        } catch (topError) {
            console.error('Error fetching countries top data:', topError);
        }
        
        // 2. Fetch results fixtures by country (first batch)
        try {
            const resultsUrl = `https://develop.pitchpredictions.com/api/fetch_results_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=50`;
            const resultsResponse = await fetch(resultsUrl, { headers });
            const resultsDataResponse = await resultsResponse.json();
            
            if (resultsDataResponse.status === true && resultsDataResponse.data && resultsDataResponse.data.length > 0) {
                resultsData = resultsDataResponse.data;
                hasResults = true;
                hasMoreResults = resultsDataResponse.data.length === 50;
            } else if (resultsDataResponse.status === false) {
                // No results for this country
            }
        } catch (resultsError) {
            console.error('Error fetching results fixtures:', resultsError);
        }
        
        // Determine endpoint status
        let endpointStatus = "error";
        let errorMessage = null;
        
        if (hasResults && resultsData.length > 0) {
            endpointStatus = "success";
            errorMessage = null;
        } else {
            endpointStatus = "error";
            errorMessage = "No results found for this country";
        }
        
        return {
            props: {
                initialData: resultsData,
                endpointStatus: endpointStatus,
                error: errorMessage,
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                initialCountriesTopData: countriesTopData,
                hasResults: hasResults,
                hasMoreResults: hasMoreResults
            }
        };
        
    } catch (error) {
        console.error('Error fetching country results:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message || "Failed to load country results",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                initialCountriesTopData: [],
                hasResults: false,
                hasMoreResults: false
            }
        };
    }
}

export default FootballPredictionsByCountry;