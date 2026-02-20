// pages/league/[country-name]/[football-prediction-for-league]/results.js
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
import PreLoader from "../../../../components/includes/loader";
import RenderData from "../../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../../components/includes/datanotfound";
import LeaguesDetailsTop from "../../../../components/leaguesdetails/leagues_top_details";
import FiltersLeagueDetails from "../../../../components/leaguesdetails/filters-league-details";
import FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 from "../../../../components/leaguesdetails/results/filter-pred1x2-ov-un-dc-ht-ft";
import getFormattedCurrentDate from "../../../../components/functions/GetTodaysDate";

function FootballPredictionsByLeagueResults({ 
    initialData, 
    endpointStatus, 
    error,
    baseUrl,
    leagueName,
    countryName,
    displayLeagueName,
    displayCountryName,
    leagueId,
    initialTopLeaguesData
}) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [topLeaguesData, setTopLeaguesData] = useState(initialTopLeaguesData || []);

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
        initialData,
        baseUrl: baseUrl
    });

    // Form the dynamic URL for filters
    const league_url = `${countryName}/${leagueName}-${leagueId}`;

    // Handle loading state
    if (!router.isReady) {
        return <PreLoader />;
    }

    // Handle error state
    if (endpointStatus === "error" || error) {
        return (
            <React.Fragment>
                {topLeaguesData.length > 0 ? (
                    <div className="sites-card mb-2">
                        <LeaguesDetailsTop 
                            league_name={topLeaguesData[0].league_name} 
                            country_name={topLeaguesData[0].country_name} 
                            leagueId={topLeaguesData[0].league_id} 
                            country_logo={topLeaguesData[0].downloaded_country_flag} 
                            league_logo={topLeaguesData[0].downloaded_league_logo} 
                        />
                        <div className="border-top"></div> 
                        <FiltersLeagueDetails 
                            url_filter={router.pathname.substring(1)} 
                            league_url={league_url} 
                            league_type={topLeaguesData[0].league_type} 
                        />
                    </div>
                ) : (
                    <div className="sites-card mb-2">
                        <LeaguesDetailsTop 
                            league_name={displayLeagueName} 
                            country_name={displayCountryName} 
                            leagueId={leagueId} 
                            country_logo="" 
                            league_logo="" 
                        />
                    </div>
                )}
                <div className="sites-card">
                    <DataNotFoundPage props="We don't have any results for this league to show you right now, please try again later."/>
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
    if (!renderPredictions || renderPredictions.length === 0) {
        return (
            <React.Fragment>
                {topLeaguesData.length > 0 ? (
                    <div className="sites-card mb-2">
                        <LeaguesDetailsTop 
                            league_name={topLeaguesData[0].league_name} 
                            country_name={topLeaguesData[0].country_name} 
                            leagueId={topLeaguesData[0].league_id} 
                            country_logo={topLeaguesData[0].downloaded_country_flag} 
                            league_logo={topLeaguesData[0].downloaded_league_logo} 
                        />
                        <div className="border-top"></div> 
                        <FiltersLeagueDetails 
                            url_filter={router.pathname.substring(1)} 
                            league_url={league_url} 
                            league_type={topLeaguesData[0].league_type} 
                        />
                    </div>
                ) : (
                    <div className="sites-card mb-2">
                        <LeaguesDetailsTop 
                            league_name={displayLeagueName} 
                            country_name={displayCountryName} 
                            leagueId={leagueId} 
                            country_logo="" 
                            league_logo="" 
                        />
                    </div>
                )}
                <div className="sites-card">
                    <DataNotFoundPage props={`No results available for ${displayCountryName}, ${displayLeagueName}`}/>
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
            <div className="desktop-container-resize">
                <div className="sites-card mb-2">
                    <LeaguesDetailsTop 
                        league_name={topLeaguesData.length > 0 ? topLeaguesData[0].league_name : displayLeagueName} 
                        country_name={topLeaguesData.length > 0 ? topLeaguesData[0].country_name : displayCountryName} 
                        leagueId={leagueId} 
                        country_logo={topLeaguesData.length > 0 ? topLeaguesData[0].downloaded_country_flag : ""} 
                        league_logo={topLeaguesData.length > 0 ? topLeaguesData[0].downloaded_league_logo : ""} 
                    />
                    <div className="border-top"></div>
                    <FiltersLeagueDetails 
                        url_filter={router.pathname.substring(1)} 
                        league_url={league_url} 
                        league_type={topLeaguesData.length > 0 ? topLeaguesData[0].league_type : ""}
                    />
                    <div className="border-top"></div>
                    <FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 
                        url_filter={router.pathname.substring(1)}  
                        my_dynamic_url={encodeURI(`/league/football-predictions-for-${countryName.replace(/\s+/g, "-").toLowerCase()}/${leagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/results`)} 
                    />               
                </div>
                
                <div className="sites-card">  
                    <RenderData renderPredictions={renderPredictions} isMobile={isMobile} />
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
            </div>
        </React.Fragment>
    );
}

// Helper function to remove last integer part (from your original code)
function removeLastIntegerPart(str) {
    const regex = /-\d+$/;
    const match = str.match(regex);
    if (match) {
        const integerPart = match[0];
        return str.slice(0, str.lastIndexOf(integerPart));
    } else {
        return str;
    }
}

export async function getServerSideProps(context) {
    // Get parameters from URL
    // URL example: /league/football-predictions-for-england/premier-league-39/results
    const countryParam = context.params?.["country-name"] || ''; // "football-predictions-for-england"
    const leagueParam = context.params?.["football-prediction-for-league"] || ''; // "premier-league-39"
    
    // Validate that leagueParam has an ID
    if (!leagueParam.match(/-\d+$/)) {
        // Redirect to homepage if no ID in URL
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        };
    }
    
    // Extract country name from country param
    const countryPrefix = "football-predictions-for-";
    let extractedCountry = countryParam;
    
    if (countryParam.startsWith(countryPrefix)) {
        extractedCountry = countryParam.substring(countryPrefix.length); // "england"
    }
    
    // Extract league name and ID from league param
    const leagueNameWithHyphens = removeLastIntegerPart(leagueParam); // "premier-league"
    const leagueId = parseInt(leagueParam.match(/-(\d+)$/)[1], 10); // 39
    
    // For API calls, replace hyphens with spaces
    const countryNameForApi = extractedCountry.replace(/-/g, ' '); // "england"
    const leagueNameForApi = leagueNameWithHyphens.replace(/-/g, ' '); // "premier league"
    
    // For display, capitalize each word
    const displayCountryName = extractedCountry
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // "England"
    
    const displayLeagueName = leagueNameWithHyphens
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // "Premier League"
    
    // If no country or league name found, or no league ID, return error
    if (!countryNameForApi || !leagueNameForApi || !leagueId) {
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: "Invalid league or country parameters",
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_results",
                leagueName: leagueNameForApi || "",
                countryName: countryNameForApi || "",
                displayLeagueName: displayLeagueName || "",
                displayCountryName: displayCountryName || "",
                leagueId: leagueId || 0,
                initialTopLeaguesData: []
            }
        };
    }
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };
    
    try {
        // Fetch top leagues data using league_id
        let topLeaguesData = [];
        try {
            const topUrl = `https://api.pitchpredictions.com/api/fetch_leagues_data?league_id=${leagueId}`;
            
            const topResponse = await fetch(topUrl, { headers });
            const topData = await topResponse.json();
            
            if (topData.status === true) {
                topLeaguesData = topData.data || [];
            }
        } catch (topError) {
            console.error('Error fetching leagues top data:', topError);
        }
        
        // Fetch league results
        const resultsUrl = `https://api.pitchpredictions.com/api/fetch_league_results?league_name=${encodeURIComponent(leagueNameForApi)}&country_name=${encodeURIComponent(countryNameForApi)}`;
        
        const resultsResponse = await fetch(resultsUrl, { headers });
        
        if (!resultsResponse.ok) {
            throw new Error(`HTTP error! status: ${resultsResponse.status}`);
        }
        
        const resultsData = await resultsResponse.json();
        
        return {
            props: {
                initialData: resultsData.data || [],
                endpointStatus: resultsData.status === true ? "success" : "error",
                error: resultsData.status === true ? null : (resultsData.message || "Failed to load league results"),
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_results",
                leagueName: leagueNameForApi,
                countryName: countryNameForApi,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                initialTopLeaguesData: topLeaguesData
            }
        };
    } catch (error) {
        console.error('Error fetching league results:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_results",
                leagueName: leagueNameForApi,
                countryName: countryNameForApi,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                initialTopLeaguesData: []
            }
        };
    }
}

export default FootballPredictionsByLeagueResults;