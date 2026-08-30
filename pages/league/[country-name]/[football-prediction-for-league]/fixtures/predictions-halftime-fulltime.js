// pages/league/[country-name]/[football-prediction-for-league]/fixtures.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@/components/shared/client-adsense";
import PreLoader from "../../../../../components/includes/loader";
import RenderData from "../../../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../../../../components/includes/datanotfound";
import LeaguesDetailsTop from "../../../../../components/leaguesdetails/leagues_top_details";
import FiltersLeagueDetails from "../../../../../components/leaguesdetails/filters-league-details";
import TodaysFixturesByLeague from "../../../../../components/leaguesdetails/todays-fixtures";
import FilterLeaguesOverallDoubleChanceUnderOverHTFTPred1x2 from "../../../../../components/leaguesdetails/fixtures/filter-pred1x2-ov-un-dc-ht-ft";
import getFormattedCurrentDate from "../../../../../components/functions/GetTodaysDate";

function FootballPredictionsByLeague({ 
    initialData, 
    endpointStatus, 
    error,
    leagueName,
    countryName,
    displayLeagueName,
    displayCountryName,
    leagueId,
    todaysDate,
    initialTopLeaguesData,
    initialTodaysMatches,
    hasUpcomingFixtures,
    hasTodaysFixtures,
    hasMoreUpcoming
}) {
    const router = useRouter();
    const [topLeaguesData, setTopLeaguesData] = useState(initialTopLeaguesData || []);
    const [todaysMatchesByLeague, setTodaysMatchesByLeague] = useState(initialTodaysMatches || []);
    const [upcomingFixtures, setUpcomingFixtures] = useState(initialData || []);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentStartIndex, setCurrentStartIndex] = useState(initialData.length);
    const [hasMore, setHasMore] = useState(hasMoreUpcoming);
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };

    // Fetch today's data by league (for live updates)
    async function fetchTodaysFixturesByLeague() {
        try {
            const response = await fetch(
                `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_league_id?league_id=${leagueId}&fixture_date=${todaysDate}&start_index=0&end_index=50`,
                {
                    method: 'GET',
                    headers: headers,
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching today\'s fixtures by league:', error);
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
            const url = `https://api.pitchpredictions.com/api/fetch_league_fixtures?league_id=${leagueId}&start_index=${startIndex}&end_index=${endIndex}`;
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
    }, [loadingMore, hasMore, currentStartIndex, leagueId]);

    // Live updates every 30 seconds (client-side only)
    useEffect(() => {
        let intervalId;
        
        if (hasTodaysFixtures) {
            intervalId = setInterval(() => {
                fetchTodaysFixturesByLeague().then(data => {
                    if (data.status === true && data.data) {
                        setTodaysMatchesByLeague(data.data);
                    }
                });
            }, 30000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [hasTodaysFixtures, leagueId, todaysDate]);

    // Process the data - only for upcoming fixtures
    const renderPredictions = hasUpcomingFixtures && upcomingFixtures.length > 0 
        ? PagesMatchPredictionDetails({ gamesData: upcomingFixtures })
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

    // Handle error state - only when BOTH upcoming AND today's fixtures are empty
    if (endpointStatus === "error" && !hasUpcomingFixtures && !hasTodaysFixtures) {
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
                    <DataNotFoundPage props="We don't have any matches for this league to show you right now, please try again later."/>
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
                    <FilterLeaguesOverallDoubleChanceUnderOverHTFTPred1x2 
                        url_filter={router.pathname.substring(1)}  
                        my_dynamic_url={encodeURI(`/league/football-predictions-for-${countryName.replace(/\s+/g, "-").toLowerCase()}/${leagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/fixtures`)} 
                    />        
                </div>
                
                {/* TODAY'S FIXTURES SECTION - Show only once */}
                {hasTodaysFixtures && todaysMatchesByLeague.length > 0 && (
                    <>
                        {hasUpcomingFixtures ? (
                            <TodaysFixturesByLeague  
                                todays_matches={todaysMatchesByLeague} 
                                country_name={leagueData.country_name || displayCountryName}  
                                league_name={leagueData.league_name || displayLeagueName} 
                            />
                        ) : (
                            <div className="sites-card">
                                <div className="desktop-container-resize mb-1">
                                    <div className="col-sm-12 text-center bg-light pt-1">
                                        <h2 className="sectionTitle">
                                            Today's Fixtures - {displayCountryName}, {displayLeagueName}
                                        </h2>
                                    </div>
                                </div> 
                                
                                <RenderData renderPredictions={PagesMatchPredictionDetails({ gamesData: todaysMatchesByLeague })} />
                                
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
                        )}
                    </>
                )}
                
                {/* UPCOMING FIXTURES SECTION */}
                {hasUpcomingFixtures && renderPredictions.length > 0 && (
                    <div className="sites-card">
                        <div className="desktop-container-resize mb-1">
                            <div className="col-sm-12 text-center bg-light pt-1">
                                <h2 className="sectionTitle">
                                    Upcoming Fixtures - {displayCountryName}, {displayLeagueName}
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
                                    slot="7856848919"
                                    style={{ display: "block" }}
                                    layout="display"
                                    format="auto"
                                />
                            </div>
                        </div>
                    </div>
                )}
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
    
    const todaysDate = getFormattedCurrentDate();
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };
    
    // Initialize data variables
    let topLeaguesData = [];
    let todaysMatchesData = [];
    let upcomingFixturesData = [];
    let hasUpcomingFixtures = false;
    let hasTodaysFixtures = false;
    let hasMoreUpcoming = false;
    
    try {
        // 1. Fetch top leagues data
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
        
        // 2. Fetch today's fixtures (using league_id)
        try {
            const todaysUrl = `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_league_id?league_id=${leagueId}&fixture_date=${todaysDate}&start_index=0&end_index=50`;
            const todaysResponse = await fetch(todaysUrl, { headers });
            const todaysData = await todaysResponse.json();
            
            if (todaysData.status === true && todaysData.data && todaysData.data.length > 0) {
                todaysMatchesData = todaysData.data;
                hasTodaysFixtures = true;
            }
        } catch (todaysError) {
            console.error('Error fetching today\'s fixtures:', todaysError);
        }
        
        // 3. Fetch upcoming fixtures using league_id
        try {
            const upcomingUrl = `https://api.pitchpredictions.com/api/fetch_league_fixtures?league_id=${leagueId}&start_index=0&end_index=50`;
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
        
        // Determine which data to use
        let initialData = [];
        let endpointStatus = "error";
        let errorMessage = null;
        
        if (hasUpcomingFixtures && upcomingFixturesData.length > 0) {
            initialData = upcomingFixturesData;
            endpointStatus = "success";
            errorMessage = null;
        } else if (hasTodaysFixtures && todaysMatchesData.length > 0) {
            initialData = [];
            endpointStatus = "success";
            errorMessage = null;
        } else {
            endpointStatus = "error";
            errorMessage = "No fixtures found for this league";
        }
        
        return {
            props: {
                initialData: initialData,
                endpointStatus: endpointStatus,
                error: errorMessage,
                leagueName: leagueNameWithHyphens,
                countryName: extractedCountry,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                todaysDate: todaysDate,
                initialTopLeaguesData: topLeaguesData,
                initialTodaysMatches: todaysMatchesData,
                hasUpcomingFixtures: hasUpcomingFixtures,
                hasTodaysFixtures: hasTodaysFixtures,
                hasMoreUpcoming: hasMoreUpcoming
            }
        };
        
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message || "Failed to load league fixtures",
                leagueName: leagueNameWithHyphens,
                countryName: extractedCountry,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                todaysDate: todaysDate,
                initialTopLeaguesData: [],
                initialTodaysMatches: [],
                hasUpcomingFixtures: false,
                hasTodaysFixtures: false,
                hasMoreUpcoming: false
            }
        };
    }
}

export default FootballPredictionsByLeague;