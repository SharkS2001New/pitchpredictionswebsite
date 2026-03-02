// pages/league/[country-name]/[football-prediction-for-league]/fixtures.js
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { Adsense } from "@ctrl/react-adsense";
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
    baseUrl,
    leagueName,
    countryName,
    displayLeagueName,
    displayCountryName,
    leagueId,
    todaysDate,
    initialTopLeaguesData,
    initialTodaysMatches
}) {
    const router = useRouter();
    const [topLeaguesData, setTopLeaguesData] = useState(initialTopLeaguesData || []);
    const [todaysMatchesByLeague, setTodaysMatchesByLeague] = useState(initialTodaysMatches || []);
    
    const mounted = useRef(false);
    const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Fetch today's data by league (for live updates)
    async function fetchTodaysFixturesByLeague() {
        try {
            const response = await fetch(
                `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_league_id?league_id=${leagueId}&fixture_date=${todaysDate}`,
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

    // Live updates every 30 seconds (client-side only)
    useEffect(() => {
        let count = 0;
        const intervalId = setInterval(() => {
            count++;
            setLiveUpdateCounter(count);
        }, 30000);

        if (mounted.current) {
            fetchTodaysFixturesByLeague().then(data => {
                if (data.status === true) {
                    setTodaysMatchesByLeague(data.data);
                }
            });
        } else {
            mounted.current = true;
        }

        return () => clearInterval(intervalId);
    }, [liveUpdateCounter]);

    // Process the data - PagesMatchPredictionDetails now receives gamesData
    const renderPredictions = PagesMatchPredictionDetails({ 
        gamesData: initialData, // Use initialData directly since no pagination needed
    });

    // Form the dynamic URL for filters
    const league_url = `${countryName}/${leagueName}-${leagueId}`;

    // Handle loading state
    if (!router.isReady) {
        return <PreLoader />;
    }

    // Handle initial data loading state
    if (!initialData && !error) {
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
                    <DataNotFoundPage props={`No upcoming matches available for ${displayCountryName}, ${displayLeagueName}`}/>
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
                    <FilterLeaguesOverallDoubleChanceUnderOverHTFTPred1x2 
                        url_filter={router.pathname.substring(1)}  
                        my_dynamic_url={encodeURI(`/league/football-predictions-for-${countryName.replace(/\s+/g, "-").toLowerCase()}/${leagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/fixtures`)} 
                    />        
                </div>
                
                {todaysMatchesByLeague.length > 0 && (
                    <TodaysFixturesByLeague  
                        todays_matches={todaysMatchesByLeague} 
                        country_name={topLeaguesData.length > 0 ? topLeaguesData[0].country_name : displayCountryName}  
                        league_name={topLeaguesData.length > 0 ? topLeaguesData[0].league_name : displayLeagueName} 
                        // isMobile prop removed - handled by CSS
                    />
                )}
                
                <div className="sites-card">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Upcoming Fixtures - {displayCountryName}, {displayLeagueName}</h2>
                        </div>
                    </div> 
                    
                    <RenderData renderPredictions={renderPredictions} />
                    
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
    // URL example: /league/football-predictions-for-england/premier-league-39/fixtures
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
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_fixtures",
                leagueName: leagueNameForApi || "",
                countryName: countryNameForApi || "",
                displayLeagueName: displayLeagueName || "",
                displayCountryName: displayCountryName || "",
                leagueId: leagueId || 0,
                todaysDate: getFormattedCurrentDate(),
                initialTopLeaguesData: [],
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
        // Fetch top leagues data using league_id
        let topLeaguesData = [];
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
        
        // Fetch today's fixtures by league
        let todaysMatchesData = [];
        try {
            const todaysUrl = `https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_league_id?league_id=${leagueId}&fixture_date=${todaysDate}`;
            
            const todaysResponse = await fetch(todaysUrl, { headers });
            const todaysData = await todaysResponse.json();
            
            if (todaysData.status === true) {
                todaysMatchesData = todaysData.data || [];
            }
        } catch (todaysError) {
            console.error('Error fetching today\'s fixtures:', todaysError);
        }
        
        // Fetch league fixtures
        const fixturesUrl = `https://api.pitchpredictions.com/api/fetch_league_fixtures?league_name=${encodeURIComponent(leagueNameForApi)}&country_name=${encodeURIComponent(countryNameForApi)}`;
        
        const fixturesResponse = await fetch(fixturesUrl, { headers });
        
        if (!fixturesResponse.ok) {
            throw new Error(`HTTP error! status: ${fixturesResponse.status}`);
        }
        
        const fixturesData = await fixturesResponse.json();
        
        return {
            props: {
                initialData: fixturesData.data || [],
                endpointStatus: fixturesData.status === true ? "success" : "error",
                error: fixturesData.status === true ? null : (fixturesData.message || "Failed to load league fixtures"),
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_fixtures",
                leagueName: leagueNameForApi,
                countryName: countryNameForApi,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                todaysDate: todaysDate,
                initialTopLeaguesData: topLeaguesData,
                initialTodaysMatches: todaysMatchesData
            }
        };
    } catch (error) {
        console.error('Error fetching league fixtures:', error);
        
        return {
            props: {
                initialData: [],
                endpointStatus: "error",
                error: error.message,
                baseUrl: "https://api.pitchpredictions.com/api/fetch_league_fixtures",
                leagueName: leagueNameForApi,
                countryName: countryNameForApi,
                displayLeagueName: displayLeagueName,
                displayCountryName: displayCountryName,
                leagueId: leagueId,
                todaysDate: todaysDate,
                initialTopLeaguesData: [],
                initialTodaysMatches: []
            }
        };
    }
}

export default FootballPredictionsByLeague;