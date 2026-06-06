// components/matchdetails/fetch_upcoming_matches.js
import React, { useEffect, useState } from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import DataNotFoundPage from "../includes/datanotfound";
import { Adsense } from "@/components/shared/client-adsense";
import InPagePreLoader from "../includes/inpagepreloader";

function FetchUpcomingMatches({ 
    home_team,
    away_team,
    home_team_id,
    away_team_id,
    fixture_date,
    initialHomeMatches = [],
    initialAwayMatches = [],
    homeStatus = "success",
    awayStatus = "success"
}) {
    const [mounted, setMounted] = useState(false);
    const [upcoming_home_matches, setUpcomingHomeTeamMatches] = useState(initialHomeMatches);
    const [upcoming_away_matches, setUpcomingAwayTeamMatches] = useState(initialAwayMatches);
    const [homeTeamNum, setHomeTeamNum] = useState(15);
    const [awayTeamNum, setAwayTeamNum] = useState(15);
    const [loadingHome, setLoadingHome] = useState(false);
    const [loadingAway, setLoadingAway] = useState(false);
    const [homeHasMore, setHomeHasMore] = useState(initialHomeMatches.length === 15);
    const [awayHasMore, setAwayHasMore] = useState(initialAwayMatches.length === 15);
    const [homeStartIndex, setHomeStartIndex] = useState(initialHomeMatches.length);
    const [awayStartIndex, setAwayStartIndex] = useState(initialAwayMatches.length);

    useEffect(() => {
        setMounted(true);
    }, []);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Fetch more home matches with pagination
    const fetchMoreHomeMatches = async () => {
        if (loadingHome || !homeHasMore) return;
        
        setLoadingHome(true);
        const chunkSize = 15;
        const startIndex = homeStartIndex;
        const endIndex = homeStartIndex + chunkSize - 1;
        
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team", {
                method: 'POST',
                body: JSON.stringify({
                    home_team_id,
                    fixture_date,
                    start_index: startIndex,
                    end_index: endIndex
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true && data.data && data.data.length > 0) {
                setUpcomingHomeTeamMatches(prev => [...prev, ...data.data]);
                setHomeStartIndex(prev => prev + data.data.length);
                
                if (data.data.length < chunkSize) {
                    setHomeHasMore(false);
                }
            } else {
                setHomeHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more home matches:', error);
        } finally {
            setLoadingHome(false);
        }
    };

    // Fetch more away matches with pagination
    const fetchMoreAwayMatches = async () => {
        if (loadingAway || !awayHasMore) return;
        
        setLoadingAway(true);
        const chunkSize = 15;
        const startIndex = awayStartIndex;
        const endIndex = awayStartIndex + chunkSize - 1;
        
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team", {
                method: 'POST',
                body: JSON.stringify({
                    away_team_id,
                    fixture_date,
                    start_index: startIndex,
                    end_index: endIndex
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true && data.data && data.data.length > 0) {
                setUpcomingAwayTeamMatches(prev => [...prev, ...data.data]);
                setAwayStartIndex(prev => prev + data.data.length);
                
                if (data.data.length < chunkSize) {
                    setAwayHasMore(false);
                }
            } else {
                setAwayHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more away matches:', error);
        } finally {
            setLoadingAway(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const formatted = DateTimeToUsersTimezone(dateString).split(' ')[0];
        return formatted.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$1.$2.$3');
    };

    // Build home matches list
    const upcoming_home_matchesarray = [];
    if (upcoming_home_matches.length > 0 && mounted) {
        upcoming_home_matches.slice(0, homeTeamNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                (match.home_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                (match.away_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            const homeTeamStyle = {};
            const awayTeamStyle = {};
            
            if (mounted) {
                if (match.home_team_name === home_team) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_name === home_team) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            upcoming_home_matchesarray.push(
                <a key={match.fixture_id || index} href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                    <div className="responsive-row fixturesTextSize matchDetailsLink">
                        <div className="responsive-cell team-link-probability">
                            {formatDate(match.date)}
                        </div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...homeTeamStyle }}>
                            {match.home_team_name}
                        </div>
                        <div className="responsive-cell" style={{ textAlign: "center" }}>-</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...awayTeamStyle }}>
                            {match.away_team_name}
                        </div>
                        <div className="responsive-cell team-link-probability">{match.league_name}</div>
                    </div>
                </a>
            );
        });
    }

    // Build away matches list
    const upcoming_away_matchesarray = [];
    if (upcoming_away_matches.length > 0 && mounted) {
        upcoming_away_matches.slice(0, awayTeamNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                (match.home_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                (match.away_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            const homeTeamStyle = {};
            const awayTeamStyle = {};
            
            if (mounted) {
                if (match.home_team_name === away_team) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_name === away_team) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            upcoming_away_matchesarray.push(
                <a key={match.fixture_id || index} href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                    <div className="responsive-row fixturesTextSize matchDetailsLink">
                        <div className="responsive-cell team-link-probability">
                            {formatDate(match.date)}
                        </div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...homeTeamStyle }}>
                            {match.home_team_name}
                        </div>
                        <div className="responsive-cell" style={{ textAlign: "center" }}>-</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...awayTeamStyle }}>
                            {match.away_team_name}
                        </div>
                        <div className="responsive-cell team-link-probability">{match.league_name}</div>
                    </div>
                </a>
            );
        });
    }

    const handleHomeShowMore = () => {
        if (upcoming_home_matches.length > homeTeamNum) {
            setHomeTeamNum(prev => prev + 15);
        } else if (homeHasMore) {
            fetchMoreHomeMatches();
            setHomeTeamNum(prev => prev + 15);
        }
    };

    const handleHomeShowLess = () => {
        setHomeTeamNum(15);
    };

    const handleAwayShowMore = () => {
        if (upcoming_away_matches.length > awayTeamNum) {
            setAwayTeamNum(prev => prev + 15);
        } else if (awayHasMore) {
            fetchMoreAwayMatches();
            setAwayTeamNum(prev => prev + 15);
        }
    };

    const handleAwayShowLess = () => {
        setAwayTeamNum(15);
    };

    // Error state
    const endpointStatus = (homeStatus === "success" || awayStatus === "success") ? "success" : "error";
    
    if (endpointStatus === "error" && upcoming_home_matches.length === 0 && upcoming_away_matches.length === 0) {
        return (
            <>
                <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
                <br />
            </>
        );
    }

    // Success state
    return (
        <React.Fragment>
            <div className="row">
                {(upcoming_home_matches.length > 0 || upcoming_away_matches.length > 0) && (
                    <div className="text-center fw-bold sectionTitle">
                        <span>UPCOMING MATCHES</span>
                    </div>
                )}
                
                {upcoming_home_matches.length > 0 && (
                    <div className="col-md-12 col-lg-12 col-xl-12 align-items-center mb-2">
                        <div className="text-center fw-bold sectionTitle">{home_team}</div>
                        <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                            <div className="responsive-cell team-link-probability">Date</div>
                            <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>Match</div>
                            <div className="responsive-cell"></div>
                            <div className="responsive-cell team-link-probability"></div>
                            <div className="responsive-cell team-link-probability">League</div>
                        </div>
                        {loadingHome ? <InPagePreLoader /> : upcoming_home_matchesarray}
                        
                        {(upcoming_home_matches.length > 15 || homeHasMore) && (
                            <div className="text-center mb-2">
                                {upcoming_home_matches.length > homeTeamNum ? (
                                    <button className="btn btn-link btn-sm fixturesTextSize" 
                                        style={{ color: "#B11111", fontWeight: "bold" }} 
                                        onClick={handleHomeShowLess}>
                                        Show Less Matches
                                    </button>
                                ) : (
                                    <button className="btn btn-link btn-sm fixturesTextSize" 
                                        style={{ color: "#B11111", fontWeight: "bold" }} 
                                        onClick={handleHomeShowMore}
                                        disabled={loadingHome}>
                                        {loadingHome ? "Loading..." : "Show More Matches"}
                                    </button>
                                )}
                            </div>
                        )}
                        <br />
                        <br />
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7856848919"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        />
                    </div>
                )}

                {upcoming_away_matches.length > 0 && (
                    <div className="col-md-12 col-lg-12 col-xl-12 align-items-center">
                        <div className="text-center fw-bold sectionTitle">{away_team}</div>
                        <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                            <div className="responsive-cell team-link-probability">Date</div>
                            <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>Match</div>
                            <div className="responsive-cell"></div>
                            <div className="responsive-cell team-link-probability"></div>
                            <div className="responsive-cell team-link-probability">League</div>
                        </div>
                        {loadingAway ? <InPagePreLoader /> : upcoming_away_matchesarray}
                        
                        {(upcoming_away_matches.length > 15 || awayHasMore) && (
                            <div className="text-center">
                                {upcoming_away_matches.length > awayTeamNum ? (
                                    <button className="btn btn-link btn-sm fixturesTextSize" 
                                        style={{ color: "#B11111", fontWeight: "bold" }} 
                                        onClick={handleAwayShowLess}>
                                        Show Less Matches
                                    </button>
                                ) : (
                                    <button className="btn btn-link btn-sm fixturesTextSize" 
                                        style={{ color: "#B11111", fontWeight: "bold" }} 
                                        onClick={handleAwayShowMore}
                                        disabled={loadingAway}>
                                        {loadingAway ? "Loading..." : "Show More Matches"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default FetchUpcomingMatches;