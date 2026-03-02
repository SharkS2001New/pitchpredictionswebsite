// components/matchdetails/fetch_upcoming_matches.js
import React, { useEffect, useState } from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import DataNotFoundPage from "../includes/datanotfound";
import { Adsense } from "@ctrl/react-adsense";
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
    const [loading, setLoading] = useState(false);
    const [endpointStatus, setEndPointStatus] = useState(
        (homeStatus === "success" || awayStatus === "success") ? "success" : "error"
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    // Fetch additional data if needed (pagination, filtering, etc.)
    const fetchMoreHomeMatches = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team", {
                method: 'POST',
                body: JSON.stringify({
                    home_team_id,
                    fixture_date
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setUpcomingHomeTeamMatches(data.data || []);
                setEndPointStatus("success");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const upcoming_home_matchesarray = [];
    const upcoming_away_matchesarray = [];

    let url_name = "";

    if (upcoming_home_matches.length > 0 && mounted) {
        upcoming_home_matches.slice(0, homeTeamNum).forEach((match, index) => {
            url_name = encodeURIComponent(
                match.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                match.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            // Determine styles based on team names
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
                <a key={index} href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                    <div className="responsive-row fixturesTextSize matchDetailsLink">
                        <div className="responsive-cell team-link-probability">
                            {DateTimeToUsersTimezone(match.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}
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

    if (upcoming_away_matches.length > 0 && mounted) {
        upcoming_away_matches.slice(0, awayTeamNum).forEach((match, index) => {
            url_name = encodeURIComponent(
                match.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                match.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            // Determine styles based on team names
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
                <a key={index} href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                    <div className="responsive-row fixturesTextSize matchDetailsLink">
                        <div className="responsive-cell team-link-probability">
                            {DateTimeToUsersTimezone(match.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}
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

    const handleClick = () => {
        if (upcoming_home_matches.length > homeTeamNum) {
            setHomeTeamNum(prev => prev + 12);
        } else {
            setHomeTeamNum(12);
            if (upcoming_home_matches.length === 0) {
                fetchMoreHomeMatches();
            }
        }
    };

    const handleClickAway = () => {
        if (upcoming_away_matches.length > awayTeamNum) {
            setAwayTeamNum(prev => prev + 8);
        } else {
            setAwayTeamNum(12);
        }
    };

    // Loading state
    if (!mounted || (endpointStatus === "" && upcoming_home_matches.length === 0 && upcoming_away_matches.length === 0)) {
        return <InPagePreLoader />;
    }

    // Error state
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
                        {upcoming_home_matchesarray}
                        
                        {upcoming_home_matches.length > 15 && (
                            <div className="text-center mb-2">
                                <button className="btn btn-link btn-sm fixturesTextSize" 
                                    style={{ color: "#B11111", fontWeight: "bold" }} 
                                    onClick={handleClick}>
                                    {upcoming_home_matches.length > homeTeamNum ? "Show More Matches" : "Show Less Matches"}
                                </button>
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
                        {upcoming_away_matchesarray}
                        
                        {upcoming_away_matches.length > 15 && (
                            <div className="text-center">
                                <button className="btn btn-link btn-sm fixturesTextSize" 
                                    style={{ color: "#B11111", fontWeight: "bold" }} 
                                    onClick={handleClickAway}>
                                    {upcoming_away_matches.length > awayTeamNum ? "Show More Matches" : "Show Less Matches"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default FetchUpcomingMatches;