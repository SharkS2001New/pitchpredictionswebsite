// components/matchdetails/h2h_fixtures.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import { Adsense } from "@/components/shared/client-adsense";
import InPagePreLoader from "../includes/inpagepreloader";
import DataNotFoundPage from "../includes/datanotfound";

function H2HFixturesData({ 
    home_team_id, 
    away_team_id, 
    fixture_date,
    initialH2HMatches = [], 
    initialH2HLeagues = []  
}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [postNum, setPostNum] = useState(10);
    const [loading, setLoading] = useState(false);
    const [h2h_match_details, setH2HMatchDetails] = useState(initialH2HMatches);
    const [h2h_leagues_data, setH2HLeagues] = useState(initialH2HLeagues);
    const [activeLeagueIdH2H, setActiveLeagueIdH2H] = useState("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };

    const h2h_url = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures";
    const h2h_url_by_league = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures_by_league";

    useEffect(() => {
        if (router.isReady && initialH2HMatches.length > 0 && mounted) {
            const storedLeagueId = typeof window !== 'undefined' ? localStorage.getItem("active_league_id_h2h") : null;
            const hasLeagueId = initialH2HMatches.some(
                item => item.league_id == storedLeagueId
            );

            if (storedLeagueId && hasLeagueId) {
                setActiveLeagueIdH2H(storedLeagueId);
            }
        }
    }, [router.isReady, initialH2HMatches, mounted]);

    const filterByLeagues = async (leagueId) => {
        setLoading(true);
        try {
            const response = await fetch(h2h_url_by_league, {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id, 
                    away_team_id, 
                    league_id: leagueId, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setH2HMatchDetails(data.data);
            }

            localStorage.setItem("active_league_id_h2h", leagueId);
            setActiveLeagueIdH2H(leagueId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const allFixturesFilter = async () => {
        setLoading(true);
        try {
            const response = await fetch(h2h_url, {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id, 
                    away_team_id, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setH2HMatchDetails(data.data);
            }

            localStorage.setItem("active_league_id_h2h", "all");
            setActiveLeagueIdH2H("all");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    let h2hmatchdetailslist = [];
    let leaguesdisplayList = [];

    if (h2h_match_details.length > 0) {
        h2h_match_details.slice(0, postNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                (match.home_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                (match.away_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            const homeTeamStyle = {};
            const awayTeamStyle = {};
            
            if (mounted) {
                if (match.ft_goals_home > match.ft_goals_away) {
                    homeTeamStyle.color = "black";
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.ft_goals_away > match.ft_goals_home) {
                    awayTeamStyle.color = "black";
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            h2hmatchdetailslist.push(
                <React.Fragment key={match.fixture_id || index}>
                    <a href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                        <div className="responsive-row fixturesTextSize matchDetailsLink">
                            <div className="responsive-cell team-link-probability">
                                {match.match_date ? DateTimeToUsersTimezone(match.match_date).split(' ')[0] : '-'}
                            </div>
                            <div className="responsive-cell team-link-probability">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {match.downloaded_league_logo && (
                                        <img
                                            src={match.downloaded_league_logo}
                                            className="h2h_image_logo"
                                            alt={match.league_name ? match.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions" : "league"}
                                            style={{ backgroundColor: "whitesmoke", marginRight: "10px", width: "20px", height: "20px" }}
                                            loading="lazy"
                                        />
                                    )}
                                    <span>{match.league_short_name || match.league_name}</span>
                                </div>
                            </div>
                            <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                                <div style={{ whiteSpace: "pre-wrap", ...homeTeamStyle }}>
                                    {match.home_team_name}
                                </div>
                                <div style={{ whiteSpace: "pre-wrap", ...awayTeamStyle }}>
                                    {match.away_team_name}
                                </div>
                            </div>
                            <div className="responsive-cell" style={{ textAlign: "center" }}>
                                {match.ft_goals_home !== undefined && match.ft_goals_away !== undefined 
                                    ? `${match.ft_goals_home}-${match.ft_goals_away}` 
                                    : '-'}
                            </div>
                        </div>
                    </a>
                </React.Fragment>
            );
        });
    }

    if (h2h_leagues_data.length > 0) {
        h2h_leagues_data.forEach((league, index) => {
            const isActive = league.league_id == activeLeagueIdH2H;
            leaguesdisplayList.push(
                <li className="nav-item ullinks" key={league.league_id || index}
                    style={{ color: "white", backgroundColor: isActive ? '#eb4d68' : 'transparent', cursor: "pointer" }} 
                    onClick={() => filterByLeagues(league.league_id)}>
                    <a className="nav-link link-light last6mhovereffects">{league.league_name}</a>
                </li>
            );
        });
    }

    const handleClick = () => {
        if (h2h_match_details.length > postNum) {
            setPostNum(prev => prev + 6);
        } else {
            setPostNum(6);
        }
    };

    if (h2h_match_details.length === 0) {
        if (loading) {
            return (
                <div className="sites-card mb-2">
                    <div className="row">
                        <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
                    </div>
                    <InPagePreLoader />
                </div>
            );
        }

        return (
            <div className="sites-card mb-2">
                <div className="row">
                    <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
                </div>
                <DataNotFoundPage props="No Head To Head Fixtures Found" />
            </div>
        );
    }

    return (
        <div className="sites-card mb-2">
            <div className="row">
                <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
            </div>
            
            {leaguesdisplayList.length > 1 && (
                <div className="responsive-row header matchdetailsheader">
                    <div className="flex-grow-1 w-100 o-hidden">
                        <ul className="nav nav-fill position-relative flex-nowrap myUlLinks">
                            <li className="nav-item ullinks" 
                                style={{ textAlign: "left", maxWidth: "20%", backgroundColor: activeLeagueIdH2H == "all" ? "#eb4d68" : "", cursor: "pointer" }}>
                                <a onClick={allFixturesFilter} className="nav-link link-light last6mhovereffects">All</a>
                            </li>
                            {leaguesdisplayList}
                        </ul>
                    </div>
                </div>
            )}
            
            <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                <div className="responsive-cell team-link-probability">Date</div>
                <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>League</div>
                <div className="responsive-cell team-link" style={{ textAlign: "left" }}>Match</div>
                <div className="responsive-cell">Score</div>
            </div>
            
            {loading ? <InPagePreLoader /> : h2hmatchdetailslist}
            
            {!loading && h2h_match_details.length > 10 && (
                <div className="text-center mb-2">
                    <button className="btn btn-link btn-sm fixturesTextSize" 
                        style={{ color: "#B11111", fontWeight: "bold" }} 
                        onClick={handleClick}>
                        {h2h_match_details.length > postNum ? "Show More Matches" : "Show Less Matches"}
                    </button>
                </div>
            )}
            
            <br/>
            <div className="text-center mb-2">
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />
            </div>
        </div>
    );
}

export default H2HFixturesData;