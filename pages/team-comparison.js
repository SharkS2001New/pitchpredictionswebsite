// pages/team-comparison.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Adsense } from "@/components/shared/client-adsense";
import Head from 'next/head';
import FetchSearchResultsForTeamComparison from "../components/functions/search-by-team-comparison";
import fetchTeamsLast6Matches from "../components/teamdetails/functions/fetch_last_6_matches";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import TeamComparisonDataPage from "../components/team-comparisons/team-comparison-page";
import H2HTeamComparisons from "../components/team-comparisons/head-to-head-team-comparison";
import InPagePreLoader from "../components/includes/inpagepreloader";

function TeamComparison() {
    const [homeSearchResults, setHomeSearchResults] = useState([]);
    const [awaySearchResults, setAwaySearchResults] = useState([]);
    const [teamLast6MatchesHome, setTeamLast6MatchesHome] = useState([]);
    const [teamLast6MatchesAway, setTeamLast6MatchesAway] = useState([]);

    const [homeSearchQuery, setHomeSearchQuery] = useState("");
    const [awaySearchQuery, setAwaySearchQuery] = useState("");

    const [homeTeamSelectedName, setHomeTeamSelectedName] = useState("");
    const [awayTeamSelectedName, setAwayTeamSelectedName] = useState("");

    const [homeTeamId, setHomeTeamId] = useState(0);
    const [awayTeamId, setAwayTeamId] = useState(0);
  
    const [h2hMatchDetails, setH2HMatchDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [compareClicked, setCompareClicked] = useState(false);

    // Use ref for abort controller to persist across renders
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // Create abort controller on mount
        abortControllerRef.current = new AbortController();
        
        // Clean up on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const closeHomeForm = useCallback(() => {
        setHomeSearchResults([]);
    }, []);
  
    const closeAwayForm = useCallback(() => {
        setAwaySearchResults([]);
    }, []);
  
    const searchHomeTeamOnChange = useCallback(async (inputedSearchQuery) => {
        setHomeSearchQuery(inputedSearchQuery);
        
        if (inputedSearchQuery.length >= 3) {
            try {
                const response = await FetchSearchResultsForTeamComparison(inputedSearchQuery);
                setHomeSearchResults(response || []);
            } catch (error) {
                console.error('Error searching home team:', error);
                setHomeSearchResults([]);
            }
        } else {
            setHomeSearchResults([]);
        }
    }, []);

    const searchAwayTeamOnChange = useCallback(async (inputedSearchQuery) => {
        setAwaySearchQuery(inputedSearchQuery);
        
        if (inputedSearchQuery.length >= 3) {
            try {
                const response = await FetchSearchResultsForTeamComparison(inputedSearchQuery);
                setAwaySearchResults(response || []);
            } catch (error) {
                console.error('Error searching away team:', error);
                setAwaySearchResults([]);
            }
        } else {
            setAwaySearchResults([]);
        }
    }, []);

    const homeTeamClick = useCallback((homeTeamNameSelected, homeTeamIdSelected) => {
        // Set the value of the input text element
        const txtHomeTeamNameElement = document.getElementById('homeSearchInput');
        const txtHomeTeamIdElement = document.getElementById('txtHomeTeamId');

        if (txtHomeTeamNameElement) {
            txtHomeTeamNameElement.value = homeTeamNameSelected;
        }

        if (txtHomeTeamIdElement) {
            txtHomeTeamIdElement.value = homeTeamIdSelected;
        }

        setHomeTeamSelectedName(homeTeamNameSelected);
        setHomeTeamId(homeTeamIdSelected);
        closeHomeForm();
    }, [closeHomeForm]);

    const awayTeamClick = useCallback((awayTeamNameSelected, awayTeamIdSelected) => {
        const txtAwayTeamNameElement = document.getElementById('awaySearchInput');
        const txtAwayTeamIdElement = document.getElementById('txtAwayTeamId');

        if (txtAwayTeamNameElement) {
            txtAwayTeamNameElement.value = awayTeamNameSelected;
        }

        if (txtAwayTeamIdElement) {
            txtAwayTeamIdElement.value = awayTeamIdSelected;
        }

        setAwayTeamSelectedName(awayTeamNameSelected);
        setAwayTeamId(awayTeamIdSelected);
        closeAwayForm();
    }, [closeAwayForm]);

    const getH2HData = useCallback(async (homeTeamIdVal, awayTeamIdVal, currentDate) => {
        const url = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures";
        
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    home_team_id: homeTeamIdVal,
                    away_team_id: awayTeamIdVal,
                    fixture_date: currentDate
                }),
                headers: headers,
                signal: abortControllerRef.current?.signal
            });

            const data = await response.json();

            if (data.status === true) {
                setH2HMatchDetails(data.data || []);
            } else {
                setH2HMatchDetails([]);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching H2H data:', error);
                setH2HMatchDetails([]);
            }
        }
    }, []);

    const btnCompareTeams = useCallback(async () => {
        const homeInput = document.getElementById('homeSearchInput');
        const awayInput = document.getElementById('awaySearchInput');
        const txtHomeTeamIdElement = document.getElementById('txtHomeTeamId');
        const txtAwayTeamIdElement = document.getElementById('txtAwayTeamId');
        const currentDate = getFormattedCurrentDate();

        // Validate inputs
        if (!homeInput?.value || !awayInput?.value) {
            if (!homeInput?.value) {
                alert("Team A is required");
            } else if (!awayInput?.value) {
                alert("Team B is required");
            }
            return;
        }

        if (!txtHomeTeamIdElement?.value || !txtAwayTeamIdElement?.value) {
            alert("Please select valid teams from the search results");
            return;
        }

        // Set loading state and compare clicked flag
        setLoading(true);
        setCompareClicked(true);

        try {
            // Fetch H2H data
            await getH2HData(
                txtHomeTeamIdElement.value,
                txtAwayTeamIdElement.value,
                currentDate
            );

            // Fetch last 6 matches for home team
            const homeMatchesData = await fetchTeamsLast6Matches(
                txtHomeTeamIdElement.value,
                currentDate
            );
            
            if (homeMatchesData?.status === true) {
                setTeamLast6MatchesHome(homeMatchesData.data || []);
            } else {
                setTeamLast6MatchesHome([]);
            }

            // Fetch last 6 matches for away team
            const awayMatchesData = await fetchTeamsLast6Matches(
                txtAwayTeamIdElement.value,
                currentDate
            );
            
            if (awayMatchesData?.status === true) {
                setTeamLast6MatchesAway(awayMatchesData.data || []);
            } else {
                setTeamLast6MatchesAway([]);
            }

        } catch (error) {
            console.error('Error comparing teams:', error);
            alert('An error occurred while comparing teams. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [getH2HData]);

    const hasData = teamLast6MatchesAway.length > 0 || 
                    teamLast6MatchesHome.length > 0 || 
                    h2hMatchDetails.length > 0;

    return (
        <>
            <Head>
                <title>Team Comparison | Compare Football Teams Head-to-Head | PitchPredictions</title>
                <meta name="description" content="Compare football teams head-to-head. Analyze recent form, head-to-head matches, and performance statistics. Make informed betting decisions with our team comparison tool." />
                <meta name="keywords" content="team comparison, football teams head to head, h2h comparison, team form analysis" />
            </Head>
            
            <div className="sites-card">
                {/* Instructions Section - Only show when no data */}
                {!hasData && !compareClicked && (
                    <>
                        <div className="row container">
                            <h2 className="sectionTitle text-center">How to Compare Teams Performances</h2>
                            <div>
                                <ol>
                                    <li>Type the team name in the "Team A" input field, ensuring it is at least 3 letters long. As you type, suggestions will appear, and you should select the desired team from the suggestions.</li>
                                    <li>Type a keyword in the "Team B" input field. Again, suggestions will appear as you type, and you should select the desired team from the suggestions.</li>
                                    <li>After selecting teams for both "Team A" and "Team B," click on the "Compare Teams" button.</li>
                                    <li>Wait for the results to appear below.</li>
                                </ol>
                            </div>
                        </div>
                        <hr/>
                    </>
                )}

                {/* Search Forms */}
                <div className="row container">
                    <div className="col-md-6 mb-2">
                        <HomeSearchForm
                            label="Team A"
                            onChange={searchHomeTeamOnChange}
                            searchResults={homeSearchResults}
                            closeForm={closeHomeForm}
                            searchQuery={homeSearchQuery}
                            onClick={homeTeamClick}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <AwaySearchForm
                            label="Team B"
                            onChange={searchAwayTeamOnChange}
                            searchResults={awaySearchResults}
                            closeForm={closeAwayForm}
                            searchQuery={awaySearchQuery}
                            onClick={awayTeamClick}
                        />
                    </div>
                </div>

                {/* Compare Button */}
                <div className="row container">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 text-center">
                        <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={btnCompareTeams}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Compare Teams'}
                        </button>
                    </div>
                    <div className="col-md-3"></div>
                </div>
                
                <br/>

                {/* H2H Results Section */}
                {loading ? (
                    <>
                        <div className="row">
                            <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
                        </div> 
                        <div className="responsive-row header matchdetailsheader" style={{cursor: "auto"}}>
                            <div className="responsive-cell team-link-probability">Date</div>
                            <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
                            <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
                            <div className="responsive-cell">Score</div>
                        </div>
                        <InPagePreLoader />
                    </>
                ) : (
                    h2hMatchDetails.length > 0 && (
                        <div className="center container-fluid">
                            <H2HTeamComparisons 
                                props={h2hMatchDetails} 
                                home_team_id={homeTeamId} 
                                away_team_id={awayTeamId}
                            />
                        </div>
                    )
                )}

                <br/>

                {/* Team Performance Sections */}
                <div className="row text-center">
                    <div className="col-md-6 col-12">
                        {teamLast6MatchesHome.length > 0 ? (
                            <TeamComparisonDataPage
                                props={teamLast6MatchesHome}
                                team_id={homeTeamId}
                                filter_date={getFormattedCurrentDate()}
                                title={"Games Played By - " + homeTeamSelectedName}
                                team_name={homeTeamSelectedName}
                            />
                        ) : (
                            homeTeamSelectedName !== "" && compareClicked && !loading && (
                                <div className="alert alert-info">
                                    No recent matches found for {homeTeamSelectedName}
                                </div>
                            )
                        )}
                    </div>
                    
                    <div className="col-md-6 col-12">
                        {teamLast6MatchesAway.length > 0 ? (
                            <TeamComparisonDataPage
                                props={teamLast6MatchesAway}
                                team_id={awayTeamId}
                                filter_date={getFormattedCurrentDate()}
                                title={"Games Played By - " + awayTeamSelectedName}
                                team_name={awayTeamSelectedName}
                            />
                        ) : (
                            awayTeamSelectedName !== "" && compareClicked && !loading && (
                                <div className="alert alert-info">
                                    No recent matches found for {awayTeamSelectedName}
                                </div>
                            )
                        )}
                    </div>
                </div>

                <br/> 

                {/* AdSense */}
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                /> 
                
                <br/>         
                <br/>
            </div>
        </>
    );
}

// Search Form Component for Home Team
const HomeSearchForm = React.memo(({ label, onChange, searchResults, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        onChange(e.target.value);
        setIsOpen(true);
    };

    const handleResultClick = (teamName, teamId) => {
        onClick(teamName, teamId);
        setIsOpen(false);
    };

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="mb-3">
                <label className="form-label" style={{fontWeight: "bold"}}>{label}</label>
                <input
                    className="form-control h-100"
                    type="text"
                    onChange={handleInputChange}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onFocus={() => searchResults.length > 0 && setIsOpen(true)}
                    placeholder="Type Min. 3 characters to search..."
                    id="homeSearchInput"
                    style={{borderColor: "black"}}
                    autoComplete="off"
                />
                <input type="hidden" className="form-control" id="txtHomeTeamId" />
            </div>
            
            {isOpen && searchResults.length > 0 && (
                <div 
                    id="homeSearchResultsForm"
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        width: 'calc(100% - 30px)'
                    }}
                >
                    {searchResults.slice(0, 10).map((result, index) => (
                        <div key={`home-${result.search_team_id || index}`}>
                            <div 
                                className="responsive-row searchboxTxt2 fixturesTextSize m-2"
                                style={{cursor: 'pointer'}}
                                onClick={() => handleResultClick(result.search_team_name, result.search_team_id)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <div className="col-10">
                                    {result.search_team_name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )} 
        </form>
    );
});

HomeSearchForm.displayName = 'HomeSearchForm';

// Search Form Component for Away Team
const AwaySearchForm = React.memo(({ label, onChange, searchResults, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        onChange(e.target.value);
        setIsOpen(true);
    };

    const handleResultClick = (teamName, teamId) => {
        onClick(teamName, teamId);
        setIsOpen(false);
    };

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="mb-3">
                <label className="form-label" style={{fontWeight: "bold"}}>{label}</label>
                <input
                    className="form-control h-100"
                    type="text"
                    onChange={handleInputChange}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onFocus={() => searchResults.length > 0 && setIsOpen(true)}
                    placeholder="Type Min. 3 characters to search..."
                    id="awaySearchInput"
                    style={{borderColor: "black"}}
                    autoComplete="off"
                />
                <input type="hidden" className="form-control" id="txtAwayTeamId" /> 
            </div>
            
            {isOpen && searchResults.length > 0 && (
                <div 
                    id="awaySearchResultsForm"
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        width: 'calc(100% - 30px)'
                    }}
                >
                    {searchResults.slice(0, 10).map((result, index) => (
                        <div key={`away-${result.search_team_id || index}`}>
                            <div 
                                className="responsive-row searchboxTxt2 fixturesTextSize m-2"
                                style={{cursor: 'pointer'}}
                                onClick={() => handleResultClick(result.search_team_name, result.search_team_id)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <div className="col-10">
                                    {result.search_team_name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
});

AwaySearchForm.displayName = 'AwaySearchForm';

export default TeamComparison;