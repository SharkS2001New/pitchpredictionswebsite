// components/teamdetails/games_played_by_team.js
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import ComputedWinDrawings from "../functions/computed_win_lose_draw_drawing";
import Teamwinsdrawsloses from "../functions/Teamswinsdrawsloses";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import InPagePreLoader from "../includes/inpagepreloader";

function GamesPlayedByTeam({ 
    props: initialMatches = [], 
    team_id, 
    filter_date, 
    title, 
    team_name,
    initialLeagues = [], // Add this prop for server-fetched leagues
    isLoading = false // Add loading prop
}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    const [team_matches, setTeamMatches] = useState(initialMatches);
    const [teams_last6_matches_leagues, setTeamLast6MatchesLeagues] = useState(initialLeagues);
    const [loading, setLoading] = useState(false);
    const [teamMatchesNum, setTeamMatchesNum] = useState(10);
    const [activeLeagueIdTeams, setActiveLeagueIdTeams] = useState("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    const last_6matches_leagues_url = "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues";

    useEffect(() => {
        if (router.isReady && mounted && initialLeagues.length === 0) {
            fetchLeaguesForLast6MByTeamId();
        }
    }, [router.isReady, mounted, initialLeagues]);

    useEffect(() => {
        if (mounted && initialLeagues.length > 0) {
            const storedLeagueId = localStorage.getItem("active_league_id_teams");
            const hasLeagueId = initialLeagues.some(item => item.league_id == storedLeagueId);

            if (storedLeagueId && hasLeagueId) {
                setActiveLeagueIdTeams(storedLeagueId);
            }
        }
    }, [mounted, initialLeagues]);

    const fetchLeaguesForLast6MByTeamId = async () => {
        setLoading(true);
        try {
            const response = await fetch(last_6matches_leagues_url, {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id: team_id, 
                    fixture_date: filter_date 
                }),
                headers: headers
            });

            const data = await response.json();

            if (data.status === true) {
                const leaguesData = data.data || [];
                setTeamLast6MatchesLeagues(leaguesData);

                const storedLeagueId = localStorage.getItem("active_league_id_teams");
                const hasLeagueId = leaguesData.some(item => item.league_id == storedLeagueId);

                if (storedLeagueId && hasLeagueId) {
                    setActiveLeagueIdTeams(storedLeagueId);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterMatchesByLeagues = async (leagueId) => {
        setLoading(true);
        try {
            const response = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league", {
                method: 'POST',
                body: JSON.stringify({ 
                    home_team_id: team_id, 
                    league_id: leagueId,
                    fixture_date: filter_date 
                }),
                headers: headers
            });

            const data = await response.json();

            if (data.status === true) {
                setTeamMatches(data.data || []);
            }

            localStorage.setItem("active_league_id_teams", leagueId);
            setActiveLeagueIdTeams(leagueId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const allFixturesTeamMatches = () => {
        setTeamMatches(initialMatches);
        localStorage.setItem("active_league_id_teams", "all");
        setActiveLeagueIdTeams("all");
    };

    // Show loading state
    if (isLoading || (loading && team_matches.length === 0)) {
        return (
            <div className="col-md-12">
                <InPagePreLoader />
            </div>
        );
    }

    if (team_matches.length === 0) {
        return null;
    }

    const res_ = Teamwinsdrawsloses(team_matches, team_id);
    
    const total_wins = res_[0]["won"] + res_[0]["draw"] + res_[0]["lost"];
    const home_wins = total_wins > 0 ? Math.round(((res_[0]["won"]) / total_wins) * 100) + "%" : "0%";
    const draw_wins = total_wins > 0 ? Math.round(((res_[0]["draw"]) / total_wins) * 100) + "%" : "0%";
    const away_wins = total_wins > 0 ? Math.round(((res_[0]["lost"]) / total_wins) * 100) + "%" : "0%";

    let team_matches_array = [];
    let team_matches_leagues_display_array = [];

    if (team_matches.length > 0) {
        team_matches.slice(0, teamMatchesNum).forEach((match, index) => {
            const url_name = encodeURIComponent(
                match.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' +
                match.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' +
                match.fixture_id
            );

            // Determine styles based on team IDs
            const homeTeamStyle = {};
            const awayTeamStyle = {};
            
            if (mounted) {
                if (team_id == match.home_team_id) {
                    homeTeamStyle.fontWeight = "bold";
                }
                if (match.away_team_id == team_id) {
                    awayTeamStyle.fontWeight = "bold";
                }
            }

            team_matches_array.push(
                <React.Fragment key={index}>
                    <a href={'/match/football-predictions-' + url_name + "/matches"} title="Click to View Match details">
                        <div className="responsive-row fixturesTextSize matchDetailsLink">
                            <div className="responsive-cell team-link-probability">
                                {DateTimeToUsersTimezone(match.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}
                            </div>
                            <div className="responsive-cell team-link-probability">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img
                                        src={match.downloaded_league_logo}
                                        className="league_image_logo"
                                        alt={match.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions"}
                                        style={{ backgroundColor: "whitesmoke", marginRight: "10px" }}
                                        loading="lazy"
                                    />
                                    <span>{match.league_short_name}</span>
                                </div>
                            </div>
                            <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                                <div style={homeTeamStyle}>{match.home_team_name}</div>
                                <div style={awayTeamStyle}>{match.away_team_name}</div>
                            </div>
                            <div className="responsive-cell team-link-probability" style={{ whiteSpace: "nowrap" }}>
                                <span>{match.goals_home} - {match.goals_away}</span>
                                <br />
                                <span>({JSON.parse(match.scores).halftime.home} - {JSON.parse(match.scores).halftime.away})</span>
                            </div>
                            <div className="responsive-cell team-link-probability">
                                {ComputedWinDrawings(team_id, match.home_team_id, match.away_team_id, match.goals_home, match.goals_away, index)}
                            </div>
                        </div>
                    </a>
                </React.Fragment>
            );
        });
    }

    // Build leagues filter
    const leaguesToDisplay = teams_last6_matches_leagues.length > 0 ? teams_last6_matches_leagues : initialLeagues;
    
    if (leaguesToDisplay.length > 1) {
        leaguesToDisplay.forEach((league, index) => {
            const isActive = league.league_id == activeLeagueIdTeams;
            team_matches_leagues_display_array.push(
                <React.Fragment key={index}>
                    <li className="nav-item" 
                        style={{ color: "white", backgroundColor: isActive ? '#eb4d68' : 'transparent' }}
                        onClick={() => filterMatchesByLeagues(league.league_id)}>
                        <a className="nav-link link-light last6mhovereffects">{league.league_name}</a>
                    </li>
                </React.Fragment>
            );
        });
    }

    const handleClick = () => {
        if (team_matches.length > teamMatchesNum) {
            setTeamMatchesNum(prev => prev + 10);
        } else {
            setTeamMatchesNum(10);
        }
    };

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center fw-bold sectionTitle">
                        <span>{title}</span>
                    </div>

                    {/* League filters */}
                    {leaguesToDisplay.length > 1 && (
                        <div className="responsive-row header matchdetailsheader">
                            <div className="flex-grow-1 w-100 o-hidden">
                                <ul className="nav nav-fill position-relative flex-nowrap">
                                    <li className="nav-item" 
                                        style={{ 
                                            textAlign: "left", 
                                            maxWidth: "15%", 
                                            backgroundColor: activeLeagueIdTeams == "all" ? "#eb4d68" : "" 
                                        }} 
                                        onClick={allFixturesTeamMatches}>
                                        <a className="nav-link link-light last6mhovereffects">All</a>
                                    </li>
                                    {team_matches_leagues_display_array}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Table headers */}
                    <div className="responsive-row header matchdetailsheader" style={{ cursor: "auto" }}>
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{ textAlign: "left" }}>League</div>
                        <div className="responsive-cell team-link" style={{ textAlign: "left" }}>Match</div>
                        <div className="responsive-cell team-link-probability">Score</div>
                        <div className="responsive-cell team-link-probability"></div>
                    </div>

                    {/* Match list */}
                    {loading ? <InPagePreLoader /> : team_matches_array}

                    {/* Show more/less button */}
                    {!loading && team_matches.length > 10 && (
                        <div className="text-center">
                            <button 
                                className="btn btn-link btn-sm fixturesTextSize" 
                                style={{ color: "#B11111", fontWeight: "bold" }} 
                                onClick={handleClick}>
                                {team_matches.length > teamMatchesNum ? "Show More Matches" : "Show Less Matches"}
                            </button>
                        </div>
                    )}

                    <br />

                    {/* Progress bars */}
                    {!loading && (
                        <div className="container mt-0">
                            <div className="progress">
                                <div className="progress-bar bg-success" style={{ width: home_wins }}></div>
                                <div className="progress-bar bg-warning" style={{ width: draw_wins }}></div>
                                <div className="progress-bar bg-danger" style={{ width: away_wins }}></div>
                            </div>
                            <div className="progress fixturesTextSize" style={{ backgroundColor: "white", height: "75px", fontWeight: "bold" }}>
                                <div style={{ width: home_wins }}>
                                    <p className="text-center" style={{ whiteSpace: "nowrap" }}>Win ({res_[0]["won"]})</p>
                                    <p className="text-center font-weight-bold">{home_wins}</p>
                                </div>
                                <div style={{ width: draw_wins }}>
                                    <p className="text-center" style={{ whiteSpace: "nowrap" }}>Draw ({res_[0]["draw"]})</p>
                                    <p className="text-center">{draw_wins}</p>
                                </div>
                                <div style={{ width: away_wins }}>
                                    <p className="text-center" style={{ whiteSpace: "nowrap" }}>Lost ({res_[0]["lost"]})</p>
                                    <p className="text-center">{away_wins}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

export default GamesPlayedByTeam;