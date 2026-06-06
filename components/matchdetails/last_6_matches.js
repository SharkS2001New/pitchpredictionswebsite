// components/matchdetails/last_6_matches.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import ComputedWinDrawings from "../functions/computed_win_lose_draw_drawing";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import { Adsense } from "@ctrl/react-adsense";
import InPagePreLoader from "../includes/inpagepreloader";

function Last6Matches({ 
    home_team,
    away_team,
    home_team_id,
    away_team_id,
    fixture_date,
    home_team_data = [],
    away_team_data = [],
    initialHomeLeagues = [],
    initialAwayLeagues = []
}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    const [home_team_matches, setHomeTeamMatches] = useState(home_team_data);
    const [away_team_matches, setAwayTeamMatches] = useState(away_team_data);
    const [home_team_last6_matches_leagues, setHomeTeamLast6MatchesLeagues] = useState(initialHomeLeagues);
    const [away_team_last6_matches_leagues, setAwayTeamLast6MatchesLeagues] = useState(initialAwayLeagues);
    
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [homeTeamNum, setHomeTeamNum] = useState(10);
    const [awayTeamNum, setAwayTeamNum] = useState(10);
    const [activeLeagueIdHome, setActiveLeagueIdHome] = useState("all");
    const [activeLeagueIdAway, setActiveLeagueIdAway] = useState("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    const last_6matches_leagues_url = "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues";

    useEffect(() => {
        if (router.isReady && mounted) {
            const storedHomeLeague = typeof window !== 'undefined' ? localStorage.getItem("active_league_id_home") : null;
            const storedAwayLeague = typeof window !== 'undefined' ? localStorage.getItem("active_league_id_away") : null;
            
            if (storedHomeLeague && initialHomeLeagues.some(l => l.league_id == storedHomeLeague)) {
                setActiveLeagueIdHome(storedHomeLeague);
            }
            
            if (storedAwayLeague && initialAwayLeagues.some(l => l.league_id == storedAwayLeague)) {
                setActiveLeagueIdAway(storedAwayLeague);
            }

            if (initialHomeLeagues.length === 0 && home_team_id) {
                fetchHomeLast6MatchesLeagues();
            }
            if (initialAwayLeagues.length === 0 && away_team_id) {
                fetchAwayLast6MatchesLeagues();
            }
        }
    }, [router.isReady, initialHomeLeagues, initialAwayLeagues, mounted]);

    const fetchHomeLast6MatchesLeagues = async () => {
        setLoading1(true);
        try {
            const response = await fetch(last_6matches_leagues_url, {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setHomeTeamLast6MatchesLeagues(data.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading1(false);
        }
    };

    const fetchAwayLast6MatchesLeagues = async () => {
        setLoading2(true);
        try {
            const response = await fetch(last_6matches_leagues_url, {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id: away_team_id, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setAwayTeamLast6MatchesLeagues(data.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading2(false);
        }
    };

    const filterHomeMatchesByLeagues = async (leagueId) => {
        setLoading1(true);
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league", {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id, 
                    league_id: leagueId, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setHomeTeamMatches(data.data);
            }

            localStorage.setItem("active_league_id_home", leagueId);
            setActiveLeagueIdHome(leagueId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading1(false);
        }
    };

    const filterAwayMatchesByLeagues = async (leagueId) => {
        setLoading2(true);
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league", {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id: away_team_id, 
                    league_id: leagueId, 
                    fixture_date 
                }),
                headers: headers,
            });

            const data = await response.json();

            if (data.status === true) {
                setAwayTeamMatches(data.data);
            }

            localStorage.setItem("active_league_id_away", leagueId);
            setActiveLeagueIdAway(leagueId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading2(false);
        }
    };

    const allHomeFixtures = () => {
        setHomeTeamMatches(home_team_data);
        localStorage.setItem("active_league_id_home", "all");
        setActiveLeagueIdHome("all");
    };

    const allAwayFixtures = () => {
        setAwayTeamMatches(away_team_data);
        localStorage.setItem("active_league_id_away", "all");
        setActiveLeagueIdAway("all");
    };

    // Parse scores safely
    const parseScores = (match) => {
        if (match?.ht_goals_home != null && match?.ht_goals_away != null) {
            return {
                halftime: { home: match.ht_goals_home, away: match.ht_goals_away },
            };
        }

        if (!match?.scores) {
            return { halftime: { home: "-", away: "-" } };
        }

        try {
            const parsed =
                typeof match.scores === "string"
                    ? JSON.parse(match.scores)
                    : match.scores;
            return parsed?.halftime
                ? parsed
                : { halftime: { home: "-", away: "-" } };
        } catch {
            return { halftime: { home: "-", away: "-" } };
        }
    };

    // Build home matches list
    const home_team_matches_array = [];
    if (home_team_matches.length > 0) {
        home_team_matches.slice(0, homeTeamNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                (match.home_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                (match.away_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            const homeTeamStyle = {};
            const awayTeamStyle = {};
            const scores = parseScores(match);
            
            if (mounted) {
                if (home_team_id === match.home_team_id) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_id == home_team_id) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            home_team_matches_array.push(
                <React.Fragment key={match.fixture_id || index}>
                    <a href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                        <div className="responsive-row fixturesTextSize matchDetailsLink">
                            <div className="responsive-cell team-link-probability">
                                {match.date ? DateTimeToUsersTimezone(match.date).split(' ')[0] : '-'}
                            </div>
                            <div className="responsive-cell team-link-probability">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {match.downloaded_league_logo && (
                                        <img
                                            src={match.downloaded_league_logo}
                                            className="league_image_logo"
                                            alt={match.league_name ? match.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions" : "league"}
                                            style={{ backgroundColor: "whitesmoke", marginRight: "10px", width: "20px", height: "20px" }}
                                            loading="lazy"
                                        />
                                    )}
                                    <span>{match.league_short_name || match.league_name}</span>
                                </div>
                            </div>
                            <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                                <div style={homeTeamStyle}>
                                    {match.home_team_name}
                                </div>
                                <div style={awayTeamStyle}>
                                    {match.away_team_name}
                                </div>
                            </div>
                            <div className="responsive-cell team-link-probability" style={{ whiteSpace: "nowrap" }}>
                                <span>{match.goals_home !== undefined ? `${match.goals_home} - ${match.goals_away}` : '-'}</span>
                                <br />
                                <span>({scores.halftime.home} - {scores.halftime.away})</span>
                            </div>
                            <div className="responsive-cell team-link-probability">
                                {ComputedWinDrawings(home_team_id, match.home_team_id, match.away_team_id, match.goals_home, match.goals_away, index)}
                            </div>
                        </div>
                    </a>
                </React.Fragment>
            );
        });
    }

    // Build away matches list
    const away_team_matches_array = [];
    if (away_team_matches.length > 0) {
        away_team_matches.slice(0, awayTeamNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                (match.home_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                (match.away_team_name || '').replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            const homeTeamStyle = {};
            const awayTeamStyle = {};
            const scores = parseScores(match);
            
            if (mounted) {
                if (away_team_id === match.home_team_id) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_id == away_team_id) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            away_team_matches_array.push(
                <React.Fragment key={match.fixture_id || index}>
                    <a href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                        <div className="responsive-row fixturesTextSize matchDetailsLink">
                            <div className="responsive-cell team-link-probability">
                                {match.date ? DateTimeToUsersTimezone(match.date).split(' ')[0] : '-'}
                            </div>
                            <div className="responsive-cell team-link-probability">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {match.downloaded_league_logo && (
                                        <img
                                            src={match.downloaded_league_logo}
                                            className="league_image_logo"
                                            alt={match.league_name ? match.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions" : "league"}
                                            style={{ backgroundColor: "whitesmoke", marginRight: "10px", width: "20px", height: "20px" }}
                                            loading="lazy"
                                        />
                                    )}
                                    <span>{match.league_short_name || match.league_name}</span>
                                </div>
                            </div>
                            <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                                <div style={homeTeamStyle}>
                                    {match.home_team_name}
                                </div>
                                <div style={awayTeamStyle}>
                                    {match.away_team_name}
                                </div>
                            </div>
                            <div className="responsive-cell team-link-probability" style={{ whiteSpace: "nowrap" }}>
                                <span>{match.goals_home !== undefined ? `${match.goals_home} - ${match.goals_away}` : '-'}</span>
                                <br />
                                <span>({scores.halftime.home} - {scores.halftime.away})</span>
                            </div>
                            <div className="responsive-cell team-link-probability">
                                {ComputedWinDrawings(away_team_id, match.home_team_id, match.away_team_id, match.goals_home, match.goals_away, index)}
                            </div>
                        </div>
                    </a>
                </React.Fragment>
            );
        });
    }

    // Build home leagues filter
    const homeLeaguesDisplay = [];
    if (home_team_last6_matches_leagues.length > 0) {
        home_team_last6_matches_leagues.forEach((league, index) => {
            const isActive = league.league_id == activeLeagueIdHome;
            homeLeaguesDisplay.push(
                <li key={league.league_id || index} className="nav-item" 
                    style={{ color: 'white', backgroundColor: isActive ? '#eb4d68' : 'transparent', cursor: "pointer" }}
                    onClick={() => filterHomeMatchesByLeagues(league.league_id)}>
                    <a className="nav-link link-light last6mhovereffects">{league.league_name}</a>
                </li>
            );
        });
    }

    // Build away leagues filter
    const awayLeaguesDisplay = [];
    if (away_team_last6_matches_leagues.length > 0) {
        away_team_last6_matches_leagues.forEach((league, index) => {
            const isActive = league.league_id == activeLeagueIdAway;
            awayLeaguesDisplay.push(
                <li key={league.league_id || index} className="nav-item"
                    style={{ color: "white", backgroundColor: isActive ? '#eb4d68' : 'transparent', cursor: "pointer" }}
                    onClick={() => filterAwayMatchesByLeagues(league.league_id)}>
                    <a className="nav-link link-light last6mhovereffects">{league.league_name}</a>
                </li>
            );
        });
    }

    const handleHomeClick = () => {
        if (home_team_matches.length > homeTeamNum) {
            setHomeTeamNum(prev => prev + 10);
        } else {
            setHomeTeamNum(6);
        }
    };

    const handleAwayClick = () => {
        if (away_team_matches.length > awayTeamNum) {
            setAwayTeamNum(prev => prev + 10);
        } else {
            setAwayTeamNum(6);
        }
    };

    if (home_team_matches.length === 0 && away_team_matches.length === 0) {
        return null;
    }

    return (
        <div className="row">
            {home_team_matches.length > 0 && (
                <div className="col-md-12 mb-2">
                    <div className="text-center fw-bold sectionTitle">
                        <span>LAST MATCHES: {home_team?.toUpperCase() || 'HOME TEAM'}</span>
                    </div>
                    
                    {homeLeaguesDisplay.length > 1 && (
                        <div className="responsive-row header matchdetailsheader">
                            <div className="flex-grow-1 w-100 o-hidden">
                                <ul className="nav nav-fill position-relative flex-nowrap">
                                    <li className="nav-item" 
                                        style={{ textAlign: "left", maxWidth: "15%", backgroundColor: activeLeagueIdHome == "all" ? "#eb4d68" : "", cursor: "pointer" }}
                                        onClick={allHomeFixtures}>
                                        <a className="nav-link link-light last6mhovereffects">All</a>
                                    </li>
                                    {homeLeaguesDisplay}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>League</div>
                        <div className="responsive-cell team-link" style={{ textAlign: "left" }}>Match</div>
                        <div className="responsive-cell team-link-probability" style={{ whiteSpace: "nowrap" }}>Score</div>
                        <div className="responsive-cell team-link-probability"></div>
                    </div>
                    
                    {loading1 ? <InPagePreLoader /> : home_team_matches_array}
                    
                    {!loading1 && home_team_matches.length > 10 && (
                        <div className="text-center">
                            <button className="btn btn-link btn-sm fixturesTextSize" 
                                style={{ color: "#B11111", fontWeight: "bold" }} 
                                onClick={handleHomeClick}>
                                {home_team_matches.length > homeTeamNum ? "Show More Matches" : "Show Less Matches"}
                            </button>
                        </div>
                    )}
                    
                    <br/>
                    <div className="text-center">
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7856848919"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        />
                    </div>
                </div>
            )}
            
            {away_team_matches.length > 0 && (
                <div className="col-md-12 mb-2">
                    <div className="text-center fw-bold sectionTitle">
                        <span>LAST MATCHES: {away_team?.toUpperCase() || 'AWAY TEAM'}</span>
                    </div>
                    
                    {awayLeaguesDisplay.length > 1 && (
                        <div className="responsive-row header matchdetailsheader">
                            <div className="flex-grow-1 w-100 o-hidden">
                                <ul className="nav scrollable nav-fill position-relative flex-nowrap">
                                    <li className="nav-item"
                                        style={{ textAlign: "left", maxWidth: "15%", backgroundColor: activeLeagueIdAway == "all" ? "#eb4d68" : "", cursor: "pointer" }}
                                        onClick={allAwayFixtures}>
                                        <a className="nav-link link-light last6mhovereffects">All</a>
                                    </li>
                                    {awayLeaguesDisplay}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    <div className="responsive-row header fixturesTextSize" style={{ cursor: "auto" }}>
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>League</div>
                        <div className="responsive-cell team-link" style={{ textAlign: "left" }}>Match</div>
                        <div className="responsive-cell team-link-probability">Score</div>
                        <div className="responsive-cell team-link-probability"></div>
                    </div>
                    
                    {loading2 ? <InPagePreLoader /> : away_team_matches_array}
                    
                    {!loading2 && away_team_matches.length > 10 && (
                        <div className="text-center">
                            <button className="btn btn-link btn-sm fixturesTextSize" 
                                style={{ color: "#B11111", fontWeight: "bold" }} 
                                onClick={handleAwayClick}>
                                {away_team_matches.length > awayTeamNum ? "Show More Matches" : "Show Less Matches"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Last6Matches;