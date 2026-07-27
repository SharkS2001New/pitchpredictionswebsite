import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import {
  formatFixtureDate,
  formatFixtureDateTime,
  formatFixtureTime,
  resolveFixtureDateTime,
} from "../functions/DatetimeToUsersTimezone";
import PopupProbabilityTooltip from "./popup-probability";
import CheckiffixtureIsSelected from "../functions/CheckIfFixtureisSelected";
import FetchFixtureByIdMyFav from "../functions/FetchfixturesById-Myfavourites";

function FixturesTableDisplay({ props: fixtureProps, marketRoute }) {
    const router = useRouter();
    const marketRoutePath = marketRoute;
    const [mounted, setMounted] = useState(false);

    var fixture_details = fixtureProps[0];
    const game = fixture_details.game_details;

    const [iconColor, setIconColor] = useState("currentColor");
    const [iconPath, setIconPath] = useState("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Convert date time to users timezone
    const matchDate = resolveFixtureDateTime(game);
    const myNewDateString = formatFixtureDate(matchDate);
    const myFullNewDateString = formatFixtureDateTime(matchDate);

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
    const bttsPrediction = btts?.prediction
        ? String(btts.prediction).trim().toLowerCase()
        : null;
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

    const getMatchResultToken = (home, away) => {
        if (home > away) return "1";
        if (home < away) return "2";
        return "X";
    };

    const getHalftimeScores = () => {
        const fromScore = game.score?.half_time;
        if (fromScore?.home != null && fromScore?.away != null) {
            return { home: fromScore.home, away: fromScore.away };
        }

        let scoresPayload = game.scores;
        if (typeof scoresPayload === "string") {
            try {
                scoresPayload = JSON.parse(scoresPayload);
            } catch (e) {
                return null;
            }
        }

        const htHome = scoresPayload?.halftime?.home;
        const htAway = scoresPayload?.halftime?.away;
        if (htHome == null || htAway == null) return null;

        return { home: htHome, away: htAway };
    };

    const get1x2PredictionOutcome = (predictedToken, home, away) => {
        if (!predictedToken || predictedToken === "-" || home == null || away == null) {
            return null;
        }

        return predictedToken === getMatchResultToken(home, away) ? "won" : "lost";
    };

    const getBadgeStyle = (outcome) => ({
        backgroundColor: outcome === "won" ? "#2e7d32" : outcome === "lost" ? "transparent" : "#ffb400",
        color: outcome === "lost" ? "#c62828" : "#fff",
        border: outcome === "lost" ? "2px solid #c62828" : "none"
    });
    
    // Helper function to get the winning probability value
    function getWinningProbabilityValue(probs, winningTeam) {
        if (!probs) return 0;
        if (winningTeam === "1") return probs.home || 0;
        if (winningTeam === "X") return probs.draw || 0;
        if (winningTeam === "2") return probs.away || 0;
        return 0;
    }
    
    const currentRoute = marketRoutePath || router.pathname.substring(1);
    const isDoubleChance = currentRoute.includes("double-chance-predictions");
    const isUnderOver = currentRoute.includes("predictions-under-over");
    const isBTTS = currentRoute.includes("predictions-both-to-score");
    const isHalftimeFulltime = currentRoute.includes("predictions-halftime-fulltime");
    const isAccumulator = currentRoute === "" || 
                          currentRoute.includes("tips/") || 
                          currentRoute === "top-football-tips-and-predictions/today" ||
                          currentRoute === "top-football-tips-and-predictions/yesterday" || 
                          currentRoute === "top-football-tips-and-predictions/tomorrow";
    
    // Get odds from API
    const homeOdds = game.odds?.home;
    const drawOdds = game.odds?.draw;
    const awayOdds = game.odds?.away;
    const doubleChanceOdds = game.odds?.double_chance;
    const overUnderOdds = game.odds?.over_under;
    const bttsOdds = game.odds?.btts;
    const htFtOdds = game.odds?.ht_ft;
    
    // For accumulator/landing page - smart prediction selection
    let finalDisplayPrediction = "";
    let finalDisplayProbability = "";
    let finalWinningOdd = null;
    let finalOddsToShow = {};
    let showPopup = false;
    let htPrediction = "-";
    let ftPrediction = "-";
    if (isAccumulator) {
        // Get 1x2 data
        const winningTeam = getHighestProbabilityTeam(prediction1x2);
        const winningProb = getWinningProbabilityValue(prediction1x2, winningTeam);
        
        // Check BTTS Yes odds
        const bttsYesOdds = bttsOdds?.yes ? parseFloat(bttsOdds.yes) : null;
        const isBTTSFavorable = bttsYesOdds && bttsYesOdds < 1.40 && bttsPrediction === "yes";
        
        // Check if avg goals is extreme
        const isAvgGoalsExtreme = avgGoals !== "-" && (avgGoals < 2.0 || avgGoals > 3.0);
        
        // Check if winning probability is low (less than 50%)
        const isWinningProbLow = winningProb < 50;
        
        // Decision tree for accumulator predictions
        if (isBTTSFavorable) {
            // Show BTTS prediction
            finalDisplayPrediction = "YES";
            finalDisplayProbability = btts?.probability ? `${btts.probability}%` : "-";
            finalWinningOdd = "BTTS_Yes";
            finalOddsToShow = { option1: bttsOdds?.yes, option2: bttsOdds?.no };
            showPopup = false;
        } else if (isAvgGoalsExtreme) {
            // Show Over/Under 2.5 prediction
            finalDisplayPrediction = overUnder?.prediction || "-";
            finalDisplayProbability = overUnder?.probability ? `${overUnder.probability}%` : "-";
            if (overUnder?.prediction === "Over 2.5" || overUnder?.prediction === "Ov2.5") {
                finalWinningOdd = "Over2.5";
                finalOddsToShow = { option1: overUnderOdds?.over_2_5, option2: overUnderOdds?.under_2_5 };
            } else if (overUnder?.prediction === "Under 2.5" || overUnder?.prediction === "Un2.5") {
                finalWinningOdd = "Under2.5";
                finalOddsToShow = { option1: overUnderOdds?.over_2_5, option2: overUnderOdds?.under_2_5 };
            }
            showPopup = false;
        } else if (isWinningProbLow) {
            // Show Double Chance prediction
            finalDisplayPrediction = doubleChance?.type || "-";
            finalDisplayProbability = doubleChance?.probability ? `${doubleChance.probability}%` : "-";
            if (doubleChance?.type === "1X") {
                finalWinningOdd = "1X";
                finalOddsToShow = { option1: doubleChanceOdds?.home_draw, option2: doubleChanceOdds?.draw_away, option3: doubleChanceOdds?.home_away };
            } else if (doubleChance?.type === "X2") {
                finalWinningOdd = "X2";
                finalOddsToShow = { option1: doubleChanceOdds?.home_draw, option2: doubleChanceOdds?.draw_away, option3: doubleChanceOdds?.home_away };
            } else if (doubleChance?.type === "12") {
                finalWinningOdd = "12";
                finalOddsToShow = { option1: doubleChanceOdds?.home_draw, option2: doubleChanceOdds?.draw_away, option3: doubleChanceOdds?.home_away };
            }
            showPopup = false;
        } else {
            // Show 1X2 prediction
            finalDisplayPrediction = winningTeam;
            finalDisplayProbability = `${winningProb}%`;
            if (winningTeam === "1") finalWinningOdd = "1";
            else if (winningTeam === "X") finalWinningOdd = "X";
            else if (winningTeam === "2") finalWinningOdd = "2";
            finalOddsToShow = { option1: homeOdds, option2: drawOdds, option3: awayOdds };
            showPopup = true;
        }
    } else if (isDoubleChance) {
        finalDisplayPrediction = doubleChance?.type || "-";
        finalDisplayProbability = doubleChance?.probability ? `${doubleChance.probability}%` : "-";
        if (doubleChance?.type === "1X") finalWinningOdd = "1X";
        else if (doubleChance?.type === "X2") finalWinningOdd = "X2";
        else if (doubleChance?.type === "12") finalWinningOdd = "12";
        finalOddsToShow = { option1: doubleChanceOdds?.home_draw, option2: doubleChanceOdds?.draw_away, option3: doubleChanceOdds?.home_away };
        showPopup = false;
    } else if (isUnderOver) {
        finalDisplayPrediction = overUnder?.prediction || "-";
        finalDisplayProbability = overUnder?.probability ? `${overUnder.probability}%` : "-";
        if (overUnder?.prediction === "Over 2.5" || overUnder?.prediction === "Ov2.5") finalWinningOdd = "Over2.5";
        else if (overUnder?.prediction === "Under 2.5" || overUnder?.prediction === "Un2.5") finalWinningOdd = "Under2.5";
        finalOddsToShow = { option1: overUnderOdds?.over_2_5, option2: overUnderOdds?.under_2_5 };
        showPopup = false;
    } else if (isBTTS) {
        finalDisplayPrediction = bttsPrediction ? bttsPrediction.toUpperCase() : "-";
        finalDisplayProbability = btts?.probability ? `${btts.probability}%` : "-";
        if (bttsPrediction === "yes") finalWinningOdd = "BTTS_Yes";
        else if (bttsPrediction === "no") finalWinningOdd = "BTTS_No";
        finalOddsToShow = { option1: bttsOdds?.yes, option2: bttsOdds?.no };
        showPopup = false;
    } else if (isHalftimeFulltime) {
        htPrediction = halfTime ? getHighestProbabilityTeam(halfTime) : "-";
        ftPrediction = prediction1x2 ? getHighestProbabilityTeam(prediction1x2) : "-";
        finalDisplayPrediction = ftPrediction;
        finalDisplayProbability = prediction1x2
            ? `${Math.max(prediction1x2.home || 0, prediction1x2.draw || 0, prediction1x2.away || 0)}%`
            : "-";
        if (htPrediction === "1" || htPrediction === "X" || htPrediction === "2") {
            finalWinningOdd = htPrediction;
        }
        finalOddsToShow = { option1: htFtOdds?.ht_home, option2: htFtOdds?.ht_draw, option3: htFtOdds?.ht_away };
        showPopup = false;
    } else {
        // Regular 1x2 page
        finalDisplayPrediction = getHighestProbabilityTeam(prediction1x2);
        finalDisplayProbability = prediction1x2 ? `${Math.max(prediction1x2.home || 0, prediction1x2.draw || 0, prediction1x2.away || 0)}%` : "-";
        if (finalDisplayPrediction === "1") finalWinningOdd = "1";
        else if (finalDisplayPrediction === "X") finalWinningOdd = "X";
        else if (finalDisplayPrediction === "2") finalWinningOdd = "2";
        finalOddsToShow = { option1: homeOdds, option2: drawOdds, option3: awayOdds };
        showPopup = true;
    }

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
            case "Over2.5":
                return oddType === "over" && value === overUnderOdds?.over_2_5;
            case "Under2.5":
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
    
    const getScorePredictionOutcome = () => {
        const matchFinishedStatuses = ["FT", "AET", "PEN", "AWD", "WO"];
        const status = game.match?.status;
        const homeScore = game.score?.home;
        const awayScore = game.score?.away;
        
        if (!matchFinishedStatuses.includes(status) || homeScore == null || awayScore == null || !finalWinningOdd) {
            return null;
        }

        const finalResult = getMatchResultToken(homeScore, awayScore);
        const totalGoals = homeScore + awayScore;

        if (finalWinningOdd === "1" || finalWinningOdd === "X" || finalWinningOdd === "2") {
            return finalWinningOdd === finalResult ? "won" : "lost";
        }

        if (finalWinningOdd === "1X") {
            return finalResult === "1" || finalResult === "X" ? "won" : "lost";
        }

        if (finalWinningOdd === "X2") {
            return finalResult === "X" || finalResult === "2" ? "won" : "lost";
        }

        if (finalWinningOdd === "12") {
            return finalResult === "1" || finalResult === "2" ? "won" : "lost";
        }

        if (finalWinningOdd === "Over2.5") {
            return totalGoals > 2.5 ? "won" : "lost";
        }

        if (finalWinningOdd === "Under2.5") {
            return totalGoals < 2.5 ? "won" : "lost";
        }

        if (finalWinningOdd === "BTTS_Yes") {
            return homeScore > 0 && awayScore > 0 ? "won" : "lost";
        }

        if (finalWinningOdd === "BTTS_No") {
            return homeScore === 0 || awayScore === 0 ? "won" : "lost";
        }

        return null;
    };

    const matchFinishedStatuses = ["FT", "AET", "PEN", "AWD", "WO"];
    const homeScore = game.score?.home;
    const awayScore = game.score?.away;

    let htPredictionOutcome = null;
    let ftPredictionOutcome = null;

    if (isHalftimeFulltime) {
        const htScores = getHalftimeScores();
        if (htScores) {
            htPredictionOutcome = get1x2PredictionOutcome(htPrediction, htScores.home, htScores.away);
        }

        if (matchFinishedStatuses.includes(game.match?.status) && homeScore != null && awayScore != null) {
            ftPredictionOutcome = get1x2PredictionOutcome(ftPrediction, homeScore, awayScore);
        }
    }

    const predictionOutcome = isHalftimeFulltime ? null : getScorePredictionOutcome();
    const htBadgeStyle = getBadgeStyle(htPredictionOutcome);
    const ftBadgeStyle = getBadgeStyle(isHalftimeFulltime ? ftPredictionOutcome : predictionOutcome);
    const predictionBadgeStyle = isHalftimeFulltime ? ftBadgeStyle : getBadgeStyle(predictionOutcome);

    const shouldUseClientStyles = mounted && typeof window !== 'undefined';
    
    const homeTeamName = game.home_team?.name || '';
    const awayTeamName = game.away_team?.name || '';
    const matchStatus = game.match?.status || '';
    
    return (
        <div className="responsive-row fixturesTextSize fixturesWholeRow" style={{cursor : "auto"}}>
            {/* Star icon */}
            <div className="responsive-cell star-cell" onClick={() => selectMyMatches(game)} style={{cursor : "pointer"}}>
                <br/>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={iconColor} className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d={iconPath} />
                </svg> 
            </div>
            
            {/* Team names and date */}
            <div className="responsive-cell team-link" style={{ textAlign: "left", fontWeight:"bold", whiteSpace: "pre-wrap" }} title={toottiptitle}>                
                {currentRoute !== "match/[match-details]" ?
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
            
            {/* Desktop odds */}
            <div className="responsive-cell team-link-y hide-on-mobile" title="Odds">
                <br/>
                {isDoubleChance || (isAccumulator && finalWinningOdd && ["1X", "X2", "12"].includes(finalWinningOdd)) ? (
                    // Double Chance odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home_draw", finalOddsToShow.option1)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option1 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("draw_away", finalOddsToShow.option2)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option2 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home_away", finalOddsToShow.option3)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option3 || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : isUnderOver || (isAccumulator && finalWinningOdd && ["Over2.5", "Under2.5"].includes(finalWinningOdd)) ? (
                    // Over/Under odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("over", finalOddsToShow.option1)) : {}}>
                            &nbsp;&nbsp; {finalOddsToShow.option1 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("under", finalOddsToShow.option2)) : {}}>
                            &nbsp;&nbsp; {finalOddsToShow.option2 || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : isBTTS || (isAccumulator && finalWinningOdd && ["BTTS_Yes", "BTTS_No"].includes(finalWinningOdd)) ? (
                    // BTTS odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("btts_yes", finalOddsToShow.option1)) : {}}>
                            &nbsp;&nbsp; {finalOddsToShow.option1 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("btts_no", finalOddsToShow.option2)) : {}}>
                            &nbsp;&nbsp; {finalOddsToShow.option2 || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : isHalftimeFulltime ? (
                    // HT/FT odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(htPrediction === "1") : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option1 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(htPrediction === "X") : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option2 || "-"} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(htPrediction === "2") : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option3 || "-"} &nbsp;&nbsp;
                        </span>
                    </>
                ) : (
                    // 1X2 odds
                    <>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("home", finalOddsToShow.option1)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option1 === null ? "-" : finalOddsToShow.option1} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("draw", finalOddsToShow.option2)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option2 === null ? "-" : finalOddsToShow.option2} &nbsp;&nbsp;
                        </span>
                        <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(shouldHighlightOdd("away", finalOddsToShow.option3)) : {}}>
                            &nbsp;&nbsp;{finalOddsToShow.option3 === null || finalOddsToShow.option3 === "-" ? "-" : finalOddsToShow.option3} &nbsp;&nbsp;
                        </span>
                    </>
                )}
            </div>
            
            {/* Mobile odds - simplified version */}
            <div className="responsive-cell team-link-probability hide-on-desktop" title="Odds"> 
                <div className="row fixturesTextSize">
                    {isDoubleChance || (isAccumulator && finalWinningOdd && ["1X", "X2", "12"].includes(finalWinningOdd)) ? (
                        // Double Chance mobile
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("home_draw", finalOddsToShow.option1) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option1 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("draw_away", finalOddsToShow.option2) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option2 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("home_away", finalOddsToShow.option3) ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option3 || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : isUnderOver || (isAccumulator && finalWinningOdd && ["Over2.5", "Under2.5"].includes(finalWinningOdd)) ? (
                        // Over/Under mobile
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("over", finalOddsToShow.option1) ? "1px solid green" : ""} : {}}>
                                    &nbsp; {finalOddsToShow.option1 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("under", finalOddsToShow.option2) ? "1px solid green" : ""} : {}}>
                                    &nbsp; {finalOddsToShow.option2 || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : isBTTS || (isAccumulator && finalWinningOdd && ["BTTS_Yes", "BTTS_No"].includes(finalWinningOdd)) ? (
                        // BTTS mobile
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("btts_yes", finalOddsToShow.option1) ? "1px solid green" : ""} : {}}>
                                    &nbsp; {finalOddsToShow.option1 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: shouldHighlightOdd("btts_no", finalOddsToShow.option2) ? "1px solid green" : ""} : {}}>
                                    &nbsp; {finalOddsToShow.option2 || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : isHalftimeFulltime ? (
                        // HT/FT mobile
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: htPrediction === "1" ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option1 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: htPrediction === "X" ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option2 || "-"}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: htPrediction === "2" ? "1px solid green" : ""} : {}}>
                                    &nbsp;{finalOddsToShow.option3 || "-"}&nbsp;
                                </span>
                            </div>
                        </>
                    ) : (
                        // 1X2 mobile
                        <>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.home > game.score.away && shouldHighlightOdd("home", finalOddsToShow.option1)) ? "1px solid green" : "" : (shouldHighlightOdd("home", finalOddsToShow.option1) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{finalOddsToShow.option1 === null ? "-" : finalOddsToShow.option1}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.home === game.score.away && shouldHighlightOdd("draw", finalOddsToShow.option2)) ? "1px solid green" : "" : (shouldHighlightOdd("draw", finalOddsToShow.option2) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{finalOddsToShow.option2 === null ? "-" : finalOddsToShow.option2}&nbsp;
                                </span>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                                <span className="odds-card" style={shouldUseClientStyles ? {border: game.score?.home != null ? (game.score.away > game.score.home && shouldHighlightOdd("away", finalOddsToShow.option3)) ? "1px solid green" : "" : (shouldHighlightOdd("away", finalOddsToShow.option3) ? "1px solid green" : "")} : {}}>
                                    &nbsp;{finalOddsToShow.option3 === null || finalOddsToShow.option3 === "-" ? "-" : finalOddsToShow.option3}&nbsp;
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
                {isHalftimeFulltime && halfTime ?
                    <><span className="number-circle rounded-square" style={htBadgeStyle}>
                        {htPrediction}
                    </span> &nbsp;|&nbsp;</>
                : <></>
                }                   
                <span className="number-circle rounded-square" style={isHalftimeFulltime ? ftBadgeStyle : predictionBadgeStyle}>
                    {finalDisplayPrediction}
                </span>
            </div>
            
            {/* Mobile prediction */}
            <div className="responsive-cell team-link-standings hide-on-desktop" title="Prediction" style={{fontWeight:"bold", textAlign: "center"}}>
                <br/>
                {isHalftimeFulltime && halfTime ?
                    <><span className="number-circle rounded-square" style={htBadgeStyle}>
                        {htPrediction}
                    </span>&nbsp;|&nbsp;</>
                : <></>
                }
                <span className="number-circle rounded-square" style={isHalftimeFulltime ? ftBadgeStyle : predictionBadgeStyle}>
                    {finalDisplayPrediction}
                </span>
                <br/><br/>
                <span style={{fontWeight: "bold"}} className="hide-on-desktop">
                    {finalDisplayProbability}
                </span>
            </div>
            
            {/* Desktop winning probability */}
            <div className="responsive-cell hide-on-mobile" title="Winning Probability" style={{fontWeight:"bold"}}>
                {showPopup ? (
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
}

export default FixturesTableDisplay;