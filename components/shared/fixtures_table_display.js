import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import PopupProbabilityTooltip from "./popup-probability";
import CheckiffixtureIsSelected from "../functions/CheckIfFixtureisSelected";
import FetchFixtureByIdMyFav from "../functions/FetchfixturesById-Myfavourites";

function FixturesTableDisplay(props, key) {    
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const fixturestablearray = [];   
    var fixture_details = props.props[0];
    const game = fixture_details.game_details;

    const [iconColor, setIconColor] = useState("currentColor");
    const [iconPath, setIconPath] = useState("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Convert date time to users timezone
    const matchDate = game.match?.datetime || game.date;
    const myNewDateString = DateTimeToUsersTimezone(matchDate).split(' ')[0];
    const myFullNewDateString = DateTimeToUsersTimezone(matchDate);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if(CheckiffixtureIsSelected(game.fixture_id)){
                setIconColor("red");
                setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
            } else {
                setIconColor("currentColor");
                setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
            }
        }
    }, [game.fixture_id]);

    // Form the dynamic url
    let url_name = encodeURIComponent(
        (game.home_team?.name || '').replace(/\s+/g, '-').toLowerCase() + 
        '-vs-' + 
        (game.away_team?.name || '').replace(/\s+/g, '-').toLowerCase() + 
        '-' + 
        game.fixture_id
    );
   
    // Click to select matches
    const selectMyMatches = (game_details) => {
        if (typeof window === 'undefined') return;
        
        let existingData = localStorage.getItem("myselectedfavoritematchesdata");
        let dataArray = existingData ? JSON.parse(existingData) : [];
        
        const fixtureToStore = {
            fixture_id: game_details.fixture_id,
            home_team_name: game_details.home_team?.name,
            away_team_name: game_details.away_team?.name,
            date: game_details.match?.datetime,
            status_short: game_details.match?.status,
            goals_home: game_details.score?.home,
            goals_away: game_details.score?.away
        };
        
        if (CheckiffixtureIsSelected(game_details.fixture_id) !== undefined) {
            if (!CheckiffixtureIsSelected(game_details.fixture_id)) {
                setIconColor("red");
                setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
                dataArray.push(fixtureToStore);
                localStorage.setItem("myselectedfavoritematchesdata", JSON.stringify(dataArray));
            } else {
                setIconColor("currentColor");
                setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");

                const fixtureIdToRemove = parseInt(game_details.fixture_id);
                const index = dataArray.findIndex(item => item.fixture_id === fixtureIdToRemove);
                if (index !== -1) {
                    dataArray.splice(index, 1);
                }
                localStorage.setItem('myselectedfavoritematchesdata', JSON.stringify(dataArray));
            }
        } else {
            setIconColor("red");
            const existingIndex = dataArray.findIndex(fixture => fixture.fixture_id === parseInt(game_details.fixture_id));
            if (existingIndex !== -1) {
                dataArray[existingIndex] = fixtureToStore;
            } else {
                dataArray.push(fixtureToStore);
            }
            localStorage.setItem("myselectedfavoritematchesdata", JSON.stringify(dataArray));
        }

        const fixtureIds = dataArray.map(item => ({ fixture_id: item.fixture_id }));
        FetchFixtureByIdMyFav(fixtureIds);
    };  
    
    let toottiptitle = router.pathname.substring(1) === "match/[match-details]" ? "" : "Click to open match details";

    // Get prediction values directly from API
    const prediction1x2 = game.predictions?.["1x2"];
    const doubleChance = game.predictions?.double_chance;
    const overUnder = game.predictions?.over_under_2_5;
    const btts = game.predictions?.both_teams_to_score;
    const halfTime = game.predictions?.half_time;
    const avgGoals = game.predictions?.avg_goals || "-";
    
    // Helper function to get team based on highest probability
    function getHighestProbabilityTeam(probs) {
        if (!probs) return "-";
        const maxProb = Math.max(probs.home || 0, probs.draw || 0, probs.away || 0);
        if (maxProb === probs.home) return "1";
        if (maxProb === probs.draw) return "X";
        if (maxProb === probs.away) return "2";
        return "-";
    }
    
    // Get display prediction, probability, and winning odd based on route
    let displayPrediction = "";
    let displayProbability = "";
    let winningOdd = null; // This will be used to highlight the correct odds column
    
    if (router.pathname.substring(1).includes("double-chance-predictions")) {
        displayPrediction = doubleChance?.type || "-";
        displayProbability = doubleChance?.probability ? `${doubleChance.probability}%` : "-";
        
        // Set winning odd based on double chance prediction type for highlighting
        if (doubleChance?.type === "1X") winningOdd = "1X";
        else if (doubleChance?.type === "X2") winningOdd = "X2";
        else if (doubleChance?.type === "12") winningOdd = "12";
        
    } else if (router.pathname.substring(1).includes("predictions-under-over")) {
        displayPrediction = overUnder?.prediction || "-";
        displayProbability = overUnder?.probability ? `${overUnder.probability}%` : "-";
        
        // Set winning odd based on over/under prediction
        if (overUnder?.prediction === "Over 2.5") winningOdd = "Over2.5";
        else if (overUnder?.prediction === "Under 2.5") winningOdd = "Under2.5";
        
    } else if (router.pathname.substring(1).includes("predictions-both-to-score")) {
        displayPrediction = btts?.prediction?.toUpperCase() || "-";
        displayProbability = btts?.probability ? `${btts.probability}%` : "-";
        
        // Set winning odd based on BTTS prediction
        if (btts?.prediction === "yes") winningOdd = "BTTS_Yes";
        else if (btts?.prediction === "no") winningOdd = "BTTS_No";
        
    } else if (router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
        displayPrediction = halfTime ? getHighestProbabilityTeam(halfTime) : "-";
        displayProbability = halfTime ? `${Math.max(halfTime.home || 0, halfTime.draw || 0, halfTime.away || 0)}%` : "-";
        
    } else {
        // Default 1x2 prediction - has popup
        displayPrediction = getHighestProbabilityTeam(prediction1x2);
        displayProbability = prediction1x2 ? `${Math.max(prediction1x2.home || 0, prediction1x2.draw || 0, prediction1x2.away || 0)}%` : "-";
        
        // Set winning odd for 1x2 highlighting
        if (displayPrediction === "1") winningOdd = "1";
        else if (displayPrediction === "X") winningOdd = "X";
        else if (displayPrediction === "2") winningOdd = "2";
    }

    // For landing page special logic
    const isLandingPage = router.pathname.substring(1) === "" || 
                          router.pathname.substring(1).includes("tips/") || 
                          router.pathname.substring(1) === "top-football-tips-and-predictions/today" ||
                          router.pathname.substring(1) === "top-football-tips-and-predictions/yesterday" || 
                          router.pathname.substring(1) === "top-football-tips-and-predictions/tomorrow";
    
    let finalDisplayPrediction = displayPrediction;
    let finalDisplayProbability = displayProbability;
    let finalWinningOdd = winningOdd;
    
    if (isLandingPage && avgGoals !== "-" && (avgGoals < 2.0 || avgGoals > 3.0)) {
        finalDisplayPrediction = overUnder?.prediction || "-";
        finalDisplayProbability = overUnder?.probability ? `${overUnder.probability}%` : "-";
        // Update winning odd for landing page over/under
        if (overUnder?.prediction === "Over 2.5") finalWinningOdd = "Over2.5";
        else if (overUnder?.prediction === "Under 2.5") finalWinningOdd = "Under2.5";
    }

    // Get odds from API
    const homeOdds = game.odds?.home;
    const drawOdds = game.odds?.draw;
    const awayOdds = game.odds?.away;
    const doubleChanceOdds = game.odds?.double_chance;
    const overUnderOdds = game.odds?.over_under;
    const bttsOdds = game.odds?.btts;

    // Function to check if an odd should be highlighted
    const shouldHighlightOdd = (oddType, value) => {
        if (!finalWinningOdd) return false;
        
        switch(finalWinningOdd) {
            case "1":
                return oddType === "home";
            case "X":
                return oddType === "draw";
            case "2":
                return oddType === "away";
            case "1X":
                return oddType === "home_draw" && value === doubleChanceOdds?.home_draw;
            case "X2":
                return oddType === "draw_away" && value === doubleChanceOdds?.draw_away;
            case "12":
                return oddType === "home_away" && value === doubleChanceOdds?.home_away;
            case "Over 2.5":
                return oddType === "over" && value === overUnderOdds?.over_2_5;
            case "Under 2.5":
                return oddType === "under" && value === overUnderOdds?.under_2_5;
            case "BTTS_Yes":
                return oddType === "btts_yes" && value === bttsOdds?.yes;
            case "BTTS_No":
                return oddType === "btts_no" && value === bttsOdds?.no;
            default:
                return false;
        }
    };

    const getOddsCardStyle = (condition) => {
        return {
            fontWeight: condition ? "bold" : "normal",
            ...(condition && { border: "1px solid green" })
        };
    };

    const getAverageStyle = () => {
        const totalGoals = (game.score?.home || 0) + (game.score?.away || 0);
        const isCorrect = (totalGoals >= 3 && avgGoals >= 2.5) || (totalGoals < 3 && avgGoals < 2.5);
        
        return {
            color: isCorrect ? "green" : "",
            fontSize: isCorrect ? "15px" : "",
            fontWeight: isCorrect ? "bold" : ""
        };
    };

    const shouldUseClientStyles = mounted && typeof window !== 'undefined';
    
    // Get team names safely
    const homeTeamName = game.home_team?.name || '';
    const awayTeamName = game.away_team?.name || '';
    const matchStatus = game.match?.status || '';
    
    fixturestablearray.push(
        <div key={key} className="responsive-row fixturesTextSize fixturesWholeRow" style={{cursor : "auto"}}>  
            {/* Star icon */}
            <div className="responsive-cell star-cell" onClick={() => selectMyMatches(game)} style={{cursor : "pointer"}}>
                <br/>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={iconColor} className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d={iconPath} />
                </svg> 
            </div>
            
            {/* Team names and date */}
            <div className="responsive-cell team-link" style={{ textAlign: "left", fontWeight:"bold", whiteSpace: "pre-wrap" }} title={toottiptitle}>                
                {router.pathname.substring(1) !== "match/[match-details]" ?
                <a href={'/match/football-predictions-' + url_name + "/matches"}>
                    <div className="teamNameLink">
                        <span>{homeTeamName}</span><br/>
                        <span>{awayTeamName}</span><br/>
                        <span className="table-date-time">
                            {["FT", "AWD", "AET", "PEN", "WO", "ABD"].includes(matchStatus)
                            ? myFullNewDateString
                            : myNewDateString}
                        </span>
                    </div>
                </a>
                :
                <div className="">
                    <span>{homeTeamName}</span><br/>
                    <span>{awayTeamName}</span><br/>
                    <span className="table-date-time" style={{fontWeight: "normal" }}>{myNewDateString}</span>
                </div>
                }
            </div> 
            
            {/* Desktop odds - Show different odds based on route */}
            <div className="responsive-cell team-link-y hide-on-mobile" title="Odds">
                <br/>
                {router.pathname.substring(1).includes("double-chance-predictions") ? (
                    // Show Double Chance odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home_draw", doubleChanceOdds?.home_draw)) : {}}>
                            &nbsp;&nbsp;{doubleChanceOdds?.home_draw || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("draw_away", doubleChanceOdds?.draw_away)) : {}}>
                            &nbsp;&nbsp;{doubleChanceOdds?.draw_away || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home_away", doubleChanceOdds?.home_away)) : {}}>
                            &nbsp;&nbsp;{doubleChanceOdds?.home_away || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : router.pathname.substring(1).includes("predictions-under-over") ? (
                    // Show Over/Under odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("over", overUnderOdds?.over_2_5)) : {}}>
                            &nbsp;&nbsp;O {overUnderOdds?.over_2_5 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("under", overUnderOdds?.under_2_5)) : {}}>
                            &nbsp;&nbsp;U {overUnderOdds?.under_2_5 || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : router.pathname.substring(1).includes("predictions-both-to-score") ? (
                    // Show BTTS odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("btts_yes", bttsOdds?.yes)) : {}}>
                            &nbsp;&nbsp;YES {bttsOdds?.yes || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("btts_no", bttsOdds?.no)) : {}}>
                            &nbsp;&nbsp;NO {bttsOdds?.no || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : (
                    // Show 1X2 odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home", homeOdds)) : {}}>
                            &nbsp;&nbsp;{homeOdds === null ? "-" : homeOdds} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("draw", drawOdds)) : {}}>
                            &nbsp;&nbsp;{drawOdds === null ? "-" : drawOdds} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("away", awayOdds)) : {}}>
                            &nbsp;&nbsp;{awayOdds === null || awayOdds === "-" ? "-" : awayOdds} &nbsp;&nbsp;
                        </span>
                    </>
                )}
            </div>
            
            {/* Mobile odds */}
            <div className="responsive-cell team-link-probability hide-on-desktop" title="Odds"> 
                <div className="row fixturesTextSize">
                    {router.pathname.substring(1).includes("double-chance-predictions") ? (
                        // Double Chance mobile odds
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("home_draw", doubleChanceOdds?.home_draw) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{doubleChanceOdds?.home_draw || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("draw_away", doubleChanceOdds?.draw_away) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{doubleChanceOdds?.draw_away || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("home_away", doubleChanceOdds?.home_away) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{doubleChanceOdds?.home_away || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : router.pathname.substring(1).includes("predictions-under-over") ? (
                        // Over/Under mobile odds
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("over", overUnderOdds?.over_2_5) ? "1px solid green" : ""} : {}}>
                                    &nbsp;O {overUnderOdds?.over_2_5 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("under", overUnderOdds?.under_2_5) ? "1px solid green" : ""} : {}}>
                                    &nbsp;U {overUnderOdds?.under_2_5 || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : router.pathname.substring(1).includes("predictions-both-to-score") ? (
                        // BTTS mobile odds
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("btts_yes", bttsOdds?.yes) ? "1px solid green" : ""} : {}}>
                                    &nbsp;YES {bttsOdds?.yes || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("btts_no", bttsOdds?.no) ? "1px solid green" : ""} : {}}>
                                    &nbsp;NO {bttsOdds?.no || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : (
                        // 1X2 mobile odds
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.home > game.score.away && shouldHighlightOdd("home", homeOdds)) ? "1px solid green" : "" : (shouldHighlightOdd("home", homeOdds) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{homeOdds === null ? "-" : homeOdds}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.home === game.score.away && shouldHighlightOdd("draw", drawOdds)) ? "1px solid green" : "" : (shouldHighlightOdd("draw", drawOdds) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{drawOdds === null ? "-" : drawOdds}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.away > game.score.home && shouldHighlightOdd("away", awayOdds)) ? "1px solid green" : "" : (shouldHighlightOdd("away", awayOdds) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{awayOdds === null || awayOdds === "-" ? "-" : awayOdds}&nbsp;
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Average Goals */}
            <div className="responsive-cell team-link-average hide-on-mobile" title="Average Goals" style={shouldUseClientStyles ? getAverageStyle() : {}}>
                {avgGoals}
                {shouldUseClientStyles && (
                    ((game.score?.home || 0) + (game.score?.away || 0)) >= 3 && avgGoals >= 2.5 ? <i className="bi bi-arrow-up"></i> : 
                    ((game.score?.home || 0) + (game.score?.away || 0)) < 3 && avgGoals < 2.5 ? <i className="bi bi-arrow-down"></i> : ""
                )}
            </div>
            
            {/* Desktop prediction */}
            <div className="responsive-cell hide-on-mobile" title="Prediction">
                <br/>
                {router.pathname.substring(1).includes("predictions-halftime-fulltime") && halfTime ?
                    <><span className="number-circle rounded-square" style={{backgroundColor: "#ffb400"}}>
                        {getHighestProbabilityTeam(halfTime)}
                    </span> &nbsp;|&nbsp;</>
                : <></>
                }                   
                <span className="number-circle rounded-square" style={{backgroundColor: "#ffb400"}}>
                    {finalDisplayPrediction}
                </span>
            </div>
            
            {/* Mobile prediction */}
            <div className="responsive-cell team-link-standings hide-on-desktop" title="Prediction" style={{fontWeight:"bold", textAlign: "center"}}>
                <br/>
                {router.pathname.substring(1).includes("predictions-halftime-fulltime") && halfTime ?
                    <><span className="number-circle rounded-square" style={{backgroundColor: "#ffb400"}}>
                        {getHighestProbabilityTeam(halfTime)}
                    </span>&nbsp;|&nbsp;</>
                : <></>
                }
                <span className="number-circle rounded-square" style={{backgroundColor: "#ffb400"}}>
                    {finalDisplayPrediction}
                </span>
                <br/><br/>
                {/* Winning Probability % for mobile */}
                <span style={{fontWeight: "bold"}} className="hide-on-desktop">
                    {finalDisplayProbability}
                </span>
            </div>
            
            {/* Desktop winning probability */}
            <div className="responsive-cell hide-on-mobile" title="Winning Probability" style={{fontWeight:"bold"}}>
                {!router.pathname.substring(1).includes("double-chance-predictions") && 
                 !router.pathname.substring(1).includes("predictions-under-over") && 
                 !router.pathname.substring(1).includes("predictions-both-to-score") ? (
                    <span className="predictionHoverEffect">
                        <PopupProbabilityTooltip 
                            home_team_name={homeTeamName} 
                            away_team_name={awayTeamName} 
                            winning_team={finalDisplayPrediction} 
                            home_odd={prediction1x2?.home ? `${prediction1x2.home}%` : "-"} 
                            draw_odd={prediction1x2?.draw ? `${prediction1x2.draw}%` : "-"} 
                            away_odd={prediction1x2?.away ? `${prediction1x2.away}%` : "-"} 
                            pred_type="1X2"
                        />
                    </span>
                ) : (
                    <span style={{ fontWeight: "bold" }}>{finalDisplayProbability}</span>
                )}
            </div> 
            
            {/* Desktop status */}
            <div className="responsive-cell team-link-standings hide-on-mobile" style={{ color: "red", whiteSpace:"pre-wrap" }} title="Status">
                <span style={{whiteSpace:"pre-wrap"}}>{fixture_details.livestatus}</span>
            </div>
            
            {/* Mobile status */}
            <div className="responsive-cell team-link-l hide-on-desktop" style={{ color: "red", whiteSpace:"nowrap" }} title="Status">
                <span style={{whiteSpace:"nowrap"}}><br/>{fixture_details.livestatus}</span>
            </div>
            
            {/* Scores */}
            <div className="responsive-cell team-link-scores" style={{ color: "red" }} title="Scores">
                {fixture_details.extratime_data && fixture_details.extratime_data !== <br/> ? 
                    <><span style={{color:"black"}}>{fixture_details.extratime_data}</span><br/></> 
                    : null
                } 
                {fixture_details.livescores}<br/>
                <span className="halfTimeDataDisplay" style={{color:"black"}}>{fixture_details.halftime_data}</span>
            </div>          
        </div>
    );

    return fixturestablearray;        
}

export default FixturesTableDisplay;