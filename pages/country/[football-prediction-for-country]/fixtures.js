// pages/country/[football-prediction-for-country]/fixtures.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import getFormattedCurrentDate from "../../../components/functions/GetTodaysDate";
import TodaysFixturesByCountry from "../../../components/countrydetails/todays-fixtures";

function FootballPredictionsByCountry({ 
    initialData, 
    endpointStatus, 
    error,
    countryName,
    displayCountryName,
    todaysDate,
    initialCountriesTopData,
    initialTodaysMatches,
    hasUpcomingFixtures,
    hasTodaysFixtures,
    hasMoreUpcoming
}) {
    const router = useRouter();
    const [countriesTopdata, setCountriesTopData] = useState(initialCountriesTopData || "");
    const [todaysMatchesByCountry, setTodaysMatchesByCountry] = useState(initialTodaysMatches || []);
    const [upcomingFixtures, setUpcomingFixtures] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
    const [hasMore, setHasMore] = useState(hasMoreUpcoming);
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Fetch today's data by country (for live updates)
    async function fetchTodaysFixturesByCountry() {
        try {
            const response = await fetch(
                `https://develop.pitchpredictions.com/api/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryName)}&fixture_date=${todaysDate}&start_index=0&end_index=50`,
                {
                    method: 'GET',
                    headers: headers,
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching today\'s fixtures by country:', error);
            return { status: false, data: [] };
        }
    }

    // Fetch more upcoming fixtures with pagination
    const loadMoreUpcomingFixtures = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = currentStartIndex + chunkSize - 1;
        
        try {
            const url = `https://develop.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryName)}&start_index=${startIndex}&end_index=${endIndex}`;
            const response = await fetch(url, { headers });
            const data = await response.json();
            
            if (data.status === true && data.data && data.data.length > 0) {
                setUpcomingFixtures(prev => [...prev, ...data.data]);
                setCurrentStartIndex(prev => prev + data.data.length);
                
                if (data.data.length < chunkSize) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more upcoming fixtures:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, currentStartIndex, countryName]);

    // Live updates every 30 seconds (client-side only)
    useEffect(() => {
        let intervalId;
        
        if (hasTodaysFixtures) {
            intervalId = setInterval(() => {
                fetchTodaysFixturesByCountry().then(data => {
                    if (data.status === true && data.data) {
                        setTodaysMatchesByCountry(data.data);
                    }
                });
            }, 30000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [hasTodaysFixtures, countryName, todaysDate]);

    // Process the data - only for upcoming fixtures
    const renderPredictions = hasUpcomingFixtures && upcomingFixtures.length > 0 
        ? PagesMatchPredictionDetails({ gamesData: upcomingFixtures })
        : [];

    // Handle initial loading state
    if (!initialData && !error) {
        return <PreLoader />;
    }

    // Handle error state - only when BOTH upcoming AND today's fixtures are empty
    if (endpointStatus === "error" && !hasUpcomingFixtures && !hasTodaysFixtures) {
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
            
            {/* TODAY'S FIXTURES SECTION - Show only once */}
            {hasTodaysFixtures && todaysMatchesByCountry.length > 0 && (
                <>
                    {hasUpcomingFixtures ? (
                        // If both exist, use TodaysFixturesByCountry component
                        <TodaysFixturesByCountry 
                            todays_matches={todaysMatchesByCountry} 
                            country_name={countryName} 
                        />
                    ) : (
                        // If ONLY today's fixtures exist, show them in a card
                        <div className="sites-card">
                            <div className="desktop-container-resize mb-1">
                                <div className="col-sm-12 text-center bg-light pt-1">
                                    <h2 className="sectionTitle">Today's Fixtures - {displayCountryName}</h2>
                                </div>
                            </div>
                            
                            <RenderData renderPredictions={PagesMatchPredictionDetails({ gamesData: todaysMatchesByCountry })} />
                            
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
                    )}
                </>
            )}
            
            {/* UPCOMING FIXTURES SECTION */}
            {hasUpcomingFixtures && renderPredictions.length > 0 && (
                <div className="sites-card">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Upcoming Fixtures - {displayCountryName}</h2>
                        </div>
                    </div>
                    
                    <RenderData renderPredictions={renderPredictions} />
                    
                    {/* Show More button for pagination */}
                    {hasMore && (
                        <div className="text-center my-2">
                            <button
                                className="btn btn-link btn-sm fixturesTextSize"
                                style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
                                onClick={loadMoreUpcomingFixtures}
                                disabled={loadingMore}>
                                {loadingMore ? (
                                    <PreLoader />
                                ) : (
                                    "Show More Upcoming Matches"
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
            )}
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
                todaysDate: getFormattedCurrentDate(),
                initialCountriesTopData: [],
                initialTodaysMatches: [],
                hasUpcomingFixtures: false,
                hasTodaysFixtures: false,
                hasMoreUpcoming: false
            }
        };
    }
    
    const todaysDate = getFormattedCurrentDate();
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };
    
    // Initialize data variables
    let countriesTopData = [];
    let todaysMatchesData = [];
    let upcomingFixturesData = [];
    let hasUpcomingFixtures = false;
    let hasTodaysFixtures = false;
    let hasMoreUpcoming = false;
    
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
        
        // 2. Fetch today's fixtures by country
        try {
            const todaysUrl = `https://develop.pitchpredictions.com/api/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryNameForApi)}&fixture_date=${todaysDate}&start_index=0&end_index=50`;
            const todaysResponse = await fetch(todaysUrl, { headers });
            const todaysData = await todaysResponse.json();
            
            if (todaysData.status === true && todaysData.data && todaysData.data.length > 0) {
                todaysMatchesData = todaysData.data;
                hasTodaysFixtures = true;
            }
        } catch (todaysError) {
            console.error('Error fetching today\'s fixtures:', todaysError);
        }
        
        // 3. Fetch upcoming fixtures (first batch)
        try {
            const upcomingUrl = `https://develop.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=50`;
            const upcomingResponse = await fetch(upcomingUrl, { headers });
            const upcomingData = await upcomingResponse.json();
            
            if (upcomingData.status === true && upcomingData.data && upcomingData.data.length > 0) {
                upcomingFixturesData = upcomingData.data;
                hasUpcomingFixtures = true;
                hasMoreUpcoming = upcomingData.data.length === 50;
            }
        } catch (upcomingError) {
            console.error('Error fetching upcoming fixtures:', upcomingError);
        }
        
        // Determine endpoint status
        let endpointStatus = "error";
        let errorMessage = null;
        
        if (hasUpcomingFixtures && upcomingFixturesData.length > 0) {
            endpointStatus = "success";
            errorMessage = null;
        } else if (hasTodaysFixtures && todaysMatchesData.length > 0) {
            endpointStatus = "success";
            errorMessage = null;
        } else {
            endpointStatus = "error";
            errorMessage = "No fixtures found for this country";
        }
        
        return {
            props: {
                initialData: upcomingFixturesData,
                endpointStatus: endpointStatus,
                error: errorMessage,
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                todaysDate: todaysDate,
                initialCountriesTopData: countriesTopData,
                initialTodaysMatches: todaysMatchesData,
                hasUpcomingFixtures: hasUpcomingFixtures,
                hasTodaysFixtures: hasTodaysFixtures,
                hasMoreUpcoming: hasMoreUpcoming
            }
        };
        
    } catch (error) {
        console.error('Error fetching country fixtures:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message || "Failed to load country fixtures",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                todaysDate: todaysDate,
                initialCountriesTopData: [],
                initialTodaysMatches: [],
                hasUpcomingFixtures: false,
                hasTodaysFixtures: false,
                hasMoreUpcoming: false
            }
        };
    }
}

export default FootballPredictionsByCountry;