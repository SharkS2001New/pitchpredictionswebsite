// pages/league/[country-name]/[football-prediction-for-league]/results.js
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
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
    leagueName,
    countryName,
    displayLeagueName,
    displayCountryName,
    leagueId,
    initialTopLeaguesData,
    hasMoreResults
}) {
    const router = useRouter();
    const [topLeaguesData, setTopLeaguesData] = useState(initialTopLeaguesData || []);
    const [resultsData, setResultsData] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
    const [hasMore, setHasMore] = useState(hasMoreResults);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };

    // Fetch more results with pagination
    const loadMoreResults = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const chunkSize = 50;
        const startIndex = currentStartIndex;
        const endIndex = currentStartIndex + chunkSize - 1;
        
        try {
            const url = `https://api.pitchpredictions.com/api/fetch_league_results?league_id=${leagueId}&start_index=${startIndex}&end_index=${endIndex}`;
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
        } finally {
            setLoadingMore(false);
        }
    };

    // Process the data
    const renderPredictions = resultsData.length > 0 
        ? PagesMatchPredictionDetails({ gamesData: resultsData })
        : [];

    // Form the dynamic URL for filters
    const league_url = `${countryName}/${leagueName}-${leagueId}`;

    // Helper to safely get league data from new API structure
    const getLeagueData = (data) => {
        if (!data || data.length === 0) return {};
        const item = data[0];
        return {
            league_name: item.league?.name || item.league_name,
            country_name: item.league?.country || item.country_name,
            league_id: item.league?.id || item.league_id,
            country_logo: item.league?.country_logo || item.downloaded_country_flag,
            league_logo: item.league?.logo || item.downloaded_league_logo,
            league_type: item.league?.type || item.league_type
        };
    };

    const leagueData = getLeagueData(topLeaguesData);

    // Handle loading state
    if (!router.isReady) {
        return <PreLoader />;
    }

    // Handle error state
    if (endpointStatus === "error" && resultsData.length === 0) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <LeaguesDetailsTop 
                        league_name={leagueData.league_name || displayLeagueName} 
                        country_name={leagueData.country_name || displayCountryName} 
                        leagueId={leagueData.league_id || leagueId} 
                        country_logo={leagueData.country_logo || ""} 
                        league_logo={leagueData.league_logo || ""} 
                    />
                    <div className="border-top"></div> 
                    <FiltersLeagueDetails 
                        url_filter={router.pathname.substring(1)} 
                        league_url={league_url} 
                        league_type={leagueData.league_type || ""} 
                    />
                </div>
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
    if (renderPredictions.length === 0 && !loadingMore) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <LeaguesDetailsTop 
                        league_name={leagueData.league_name || displayLeagueName} 
                        country_name={leagueData.country_name || displayCountryName} 
                        leagueId={leagueData.league_id || leagueId} 
                        country_logo={leagueData.country_logo || ""} 
                        league_logo={leagueData.league_logo || ""} 
                    />
                    <div className="border-top"></div>
                    <FiltersLeagueDetails 
                        url_filter={router.pathname.substring(1)} 
                        league_url={league_url} 
                        league_type={leagueData.league_type || ""}
                    />
                    <div className="border-top"></div>
                    <FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 
                        url_filter={router.pathname.substring(1)}  
                        my_dynamic_url={encodeURI(`/league/football-predictions-for-${countryName.replace(/\s+/g, "-").toLowerCase()}/${leagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/results`)} 
                    />               
                </div>
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
                        league_name={leagueData.league_name || displayLeagueName} 
                        country_name={leagueData.country_name || displayCountryName} 
                        leagueId={leagueData.league_id || leagueId} 
                        country_logo={leagueData.country_logo || ""} 
                        league_logo={leagueData.league_logo || ""} 
                    />
                    <div className="border-top"></div>
                    <FiltersLeagueDetails 
                        url_filter={router.pathname.substring(1)} 
                        league_url={league_url} 
                        league_type={leagueData.league_type || ""}
                    />
                    <div className="border-top"></div>
                    <FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2 
                        url_filter={router.pathname.substring(1)}  
                        my_dynamic_url={encodeURI(`/league/football-predictions-for-${countryName.replace(/\s+/g, "-").toLowerCase()}/${leagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/results`)} 
                    />               
                </div>
                
                <div className="sites-card">  
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">
                                Results - {displayCountryName}, {displayLeagueName}
                            </h2>
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

// Helper function to remove last integer part
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
    const countryParam = context.params?.["country-name"] || '';
    const leagueParam = context.params?.["football-prediction-for-league"] || '';
    
    // Validate that leagueParam has an ID
    if (!leagueParam.match(/-\d+$/)) {
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
        extractedCountry = countryParam.substring(countryPrefix.length);
    }
    
    // Extract league name and ID from league param
    const leagueNameWithHyphens = removeLastIntegerPart(leagueParam);
    const leagueId = parseInt(leagueParam.match(/-(\d+)$/)[1], 10);
    
    // For display, capitalize each word
    const displayCountryName = extractedCountry
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    const displayLeagueName = leagueNameWithHyphens
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };
    
    // Initialize data variables
    let topLeaguesData = [];
    let resultsData = [];
    let hasMoreResults = false;
    
    try {
        // 1. Fetch top leagues data using league_id
        try {
            const topUrl = `https://api.pitchpredictions.com/api/fetch_leagues_top_data?league_id=${leagueId}`;
            const topResponse = await fetch(topUrl, { headers });
            const topData = await topResponse.json();
            
            if (topData.status === true) {
                topLeaguesData = topData.data || [];
            }
        } catch (topError) {
            console.error('Error fetching leagues top data:', topError);
        }
        
        // 2. Fetch league results using league_id
        try {
            const resultsUrl = `https://api.pitchpredictions.com/api/fetch_league_results?league_id=${leagueId}&start_index=0&end_index=50`;
            const resultsResponse = await fetch(resultsUrl, { headers });
            const resultsDataResponse = await resultsResponse.json();
            
            if (resultsDataResponse.status === true && resultsDataResponse.data && resultsDataResponse.data.length > 0) {
                resultsData = resultsDataResponse.data;
                hasMoreResults = resultsDataResponse.data.length === 50;
            }
        } catch (resultsError) {
            console.error('Error fetching league results:', resultsError);
        }
        
        // Determine endpoint status
        let endpointStatus = "error";
        let errorMessage = null;
        
        if (resultsData.length > 0) {
            endpointStatus = "success";
            errorMessage = null;
        } else {
            endpointStatus = "error";
            errorMessage = "No results found for this league";
        }
        
        return {
            props: {
                initialData: resultsData,
                endpointStatus: endpointStatus,
                error: errorMessage,
                leagueName: leagueNameWithHyphens,
                countryName: extractedCountry,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                initialTopLeaguesData: topLeaguesData,
                hasMoreResults: hasMoreResults
            }
        };
        
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message || "Failed to load league results",
                leagueName: leagueNameWithHyphens,
                countryName: extractedCountry,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                initialTopLeaguesData: [],
                hasMoreResults: false
            }
        };
    }
}

export default FootballPredictionsByLeagueResults;