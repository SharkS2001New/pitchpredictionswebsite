// components/teamdetails/upcoming_matches_by_team.js
import React, { useState, useEffect } from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import DataNotFoundPage from "../includes/datanotfound";
import InPagePreLoader from "../includes/inpagepreloader";

function FetchUpcomingMatchesByTeam({ 
    team_id, 
    filter_date,
    initialMatches = [],
    status = "success"
}) {
    const [mounted, setMounted] = useState(false);
    const [upcoming_matches, setUpcomingTeamMatches] = useState(initialMatches);
    const [matchesByTeamNum, setUpcomingMNum] = useState(15);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const upcoming_matchesarray = [];

    let url_name = "";

    if (upcoming_matches.length > 0 && mounted) {
        upcoming_matches.slice(0, matchesByTeamNum).forEach((match, index) => {
            url_name = encodeURIComponent(
                match.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                match.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            // Determine styles based on team IDs
            const homeTeamStyle = {};
            const awayTeamStyle = {};
            
            if (mounted) {
                if (match.home_team_id == team_id) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_id == team_id) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            upcoming_matchesarray.push(
                <a key={index} href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                    <div className="responsive-row fixturesTextSize matchDetailsLink">
                        <div className="responsive-cell team-link-probability">
                            {DateTimeToUsersTimezone(match.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}
                        </div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...homeTeamStyle }}>
                            {match.home_team_name}
                        </div>
                        <div className="responsive-cell" style={{ textAlign: "left" }}>-</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left", whiteSpace: "pre-wrap", ...awayTeamStyle }}>
                            {match.away_team_name}
                        </div>
                        <div className="responsive-cell team-link-probability">{match.league_name}</div>
                    </div>
                </a>
            );
        });
    }

    function handleClick() {
        if (upcoming_matches.length > matchesByTeamNum) {
            setUpcomingMNum(prev => prev + 12);
        } else {
            setUpcomingMNum(12);
        }
    }

    // Loading state
    if (!mounted || (status === "" && upcoming_matches.length === 0)) {
        return <InPagePreLoader />;
    }

    // Error state
    if (status === "error" && upcoming_matches.length === 0) {
        return (
            <>
                <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
                <br />
            </>
        );
    }

    // Success state
    if (upcoming_matches.length === 0) {
        return null;
    }

    return (
        <div className="row">
            <div className="col-md-12 col-lg-12 col-xl-12 align-items-center">
                <div className="text-center fw-bold sectionTitle">
                    <span>UPCOMING MATCHES</span>
                </div>
                <div className="col-md-12 col-lg-12 col-xl-12 align-items-center mb-3">
                    <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>Match</div>
                        <div className="responsive-cell"></div>
                        <div className="responsive-cell team-link-probability"></div>
                        <div className="responsive-cell team-link-probability">League</div>
                    </div>
                    
                    {upcoming_matchesarray}
                    
                    {upcoming_matches.length > 15 && (
                        <div className="text-center mb-2">
                            <button className="btn btn-link btn-sm fixturesTextSize" 
                                style={{ color: "#B11111", fontWeight: "bold" }} 
                                onClick={handleClick}>
                                {upcoming_matches.length > matchesByTeamNum ? "Show More Matches" : "Show Less Matches"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <br />
        </div>
    );
}

export default FetchUpcomingMatchesByTeam;