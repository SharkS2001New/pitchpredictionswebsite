// pages/country/[football-prediction-for-country]/fixtures.js
import React, { useEffect, useState, useRef } from "react";
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
    initialTodaysMatches
}) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [countriesTopdata, setCountriesTopData] = useState(initialCountriesTopData || "");
    const [todaysMatchesByCountry, setTodaysMatchesByCountry] = useState(initialTodaysMatches || []);
    
    const mounted = useRef(false);
    const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Client-side only: check for mobile
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 760);
        }
    }, []);

    // Fetch todays data by country (for live updates)
    async function fetchTodaysFixturesByCountry() {
        try {
            const response = await fetch(
                `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryName)}&fixture_date=${todaysDate}`,
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

    // Live updates every 30 seconds (client-side only)
    useEffect(() => {
        let count = 0;
        const intervalId = setInterval(() => {
            count++;
            setLiveUpdateCounter(count);
        }, 30000);

        if (mounted.current) {
            fetchTodaysFixturesByCountry().then(data => {
                if (data.status === true) {
                    setTodaysMatchesByCountry(data.data);
                }
            });
        } else {
            mounted.current = true;
        }

        return () => clearInterval(intervalId);
    }, [liveUpdateCounter]);

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
                    <DataNotFoundPage props={`No upcoming matches available for ${displayCountryName}`}/>
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
            
            <TodaysFixturesByCountry 
                todays_matches={todaysMatchesByCountry} 
                country_name={countryName} 
                isMobile={isMobile}
            />
            
            <div className="sites-card">
                <div className="desktop-container-resize mb-1">
                    <div className="col-sm-12 text-center bg-light pt-1">
                        <h2 className="sectionTitle">Upcoming Fixtures - {displayCountryName}</h2>
                    </div>
                </div>
                
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
    // URL: /country/football-predictions-for-brazil/fixtures
    // params: { "football-prediction-for-country": "football-predictions-for-brazil" }
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
                baseUrl: "https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country",
                countryName: "",
                displayCountryName: "",
                todaysDate: getFormattedCurrentDate(),
                initialCountriesTopData: [],
                initialTodaysMatches: []
            }
        };
    }
    
    const todaysDate = getFormattedCurrentDate();
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };
    
    try {
        // Fetch top countries data
        let countriesTopData = [];
        try {
            const topUrl = `https://api.pitchpredictions.com/api/fetch_countries_data?country_name=${encodeURIComponent(countryNameForApi)}`;
            console.log('Fetching top data:', topUrl);
            
            const topResponse = await fetch(topUrl, { headers });
            const topData = await topResponse.json();
            if (topData.status === true) {
                countriesTopData = topData.data || [];
            }
        } catch (topError) {
            console.error('Error fetching countries top data:', topError);
        }
        
        // Fetch today's fixtures by country
        let todaysMatchesData = [];
        try {
            const todaysUrl = `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_country_name?country_name=${encodeURIComponent(countryNameForApi)}&fixture_date=${todaysDate}`;
            console.log('Fetching today\'s fixtures:', todaysUrl);
            
            const todaysResponse = await fetch(todaysUrl, { headers });
            const todaysData = await todaysResponse.json();
            if (todaysData.status === true) {
                todaysMatchesData = todaysData.data || [];
            }
        } catch (todaysError) {
            console.error('Error fetching today\'s fixtures:', todaysError);
        }
        
        // Fetch upcoming fixtures (first batch: 0-20)
        const upcomingUrl = `https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=20`;
        console.log('Fetching upcoming fixtures:', upcomingUrl);
        
        const upcomingResponse = await fetch(upcomingUrl, { headers });
        
        if (!upcomingResponse.ok) {
            throw new Error(`HTTP error! status: ${upcomingResponse.status}`);
        }
        
        const upcomingData = await upcomingResponse.json();
        
        // Check if we need to fetch more than 20 records
        let finalUpcomingData = upcomingData.data || [];
        
        if (upcomingData.status === true && upcomingData.data && upcomingData.data.length > 20) {
            try {
                // Fetch full batch: 0-850 records
                const fullBatchUrl = `https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country?country_name=${encodeURIComponent(countryNameForApi)}&start_index=0&end_index=850`;
                console.log('Fetching full batch:', fullBatchUrl);
                
                const fullResponse = await fetch(fullBatchUrl, { headers });
                const fullData = await fullResponse.json();
                
                if (fullData.status === true) {
                    finalUpcomingData = fullData.data || [];
                }
            } catch (batchError) {
                console.error('Error fetching full batch:', batchError);
            }
        }
        
        return {
            props: {
                initialData: finalUpcomingData,
                endpointStatus: upcomingData.status === true ? "success" : "error",
                error: upcomingData.status === true ? null : (upcomingData.message || "Failed to load country fixtures"),
                baseUrl: "https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                todaysDate: todaysDate,
                initialCountriesTopData: countriesTopData,
                initialTodaysMatches: todaysMatchesData
            }
        };
    } catch (error) {
        console.error('Error fetching country fixtures:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: "https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country",
                countryName: countryNameForApi,
                displayCountryName: displayCountryName,
                todaysDate: todaysDate,
                initialCountriesTopData: [],
                initialTodaysMatches: []
            }
        };
    }
}

export default FootballPredictionsByCountry;