import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import PopupProbabilityTooltip from "./popup-probability";
import CheckiffixtureIsSelected from "../functions/CheckIfFixtureisSelected";
import FetchFixtureByIdMyFav from "../functions/FetchfixturesById-Myfavourites";
import DoubleChanceProbabilityResults from "../functions/double_chance_probability_results";
import DoubleChanceWinningTeamAndOdd from "../functions/double_chance_winning_team_and_odd";
import UnderOverWinningTeamAndOdd from "../functions/under_over_winning_team_and_odd";
import UnderOverProbabilityResults from "../functions/under_over_probability_results";
import OverUnderProbabilitiesScale from "../functions/OverUnderProbabilitiesScale";

function FixturesTableDisplay(props,key){    
    const router = useRouter(); //access page route
    const [mounted, setMounted] = useState(false);

    const fixturestablearray = [];   
    var fixture_details  = props.props[0];

    const [iconColor,setIconColor] = useState("currentColor");
    const [iconPath, setIconPath] = useState("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z")
    
    useEffect(() => {
        setMounted(true);
    }, []);

    //Call function to convert date time to users timezone
    const myNewDateString = DateTimeToUsersTimezone(fixture_details.game_details.date).split(' ')[0];
    const myFullNewDateString = DateTimeToUsersTimezone(fixture_details.game_details.date);

    //on page load. Change color of icon
    useEffect(()=>{
        if (typeof window !== 'undefined') {
            if(CheckiffixtureIsSelected(fixture_details.game_details.fixture_id)){
                setIconColor("red");
                setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z")
            } else {
                setIconColor("currentColor");
                setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
            }
        }
    }, [fixture_details.game_details.fixture_id]);

    // form the dynamic url
    let url_name = encodeURIComponent(fixture_details.game_details.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+fixture_details.game_details.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+fixture_details.game_details.fixture_id);
   
    //Click to select matches
    const selectMyMatches = (game_details) => {
        if (typeof window === 'undefined') return;
        
        //Push the game details data of the selected fixture to session storage
        let existingData = localStorage.getItem("myselectedfavoritematchesdata");
        let dataArray = existingData ? JSON.parse(existingData) : [];
                
        if (CheckiffixtureIsSelected(game_details.fixture_id) != undefined) {
            if (!CheckiffixtureIsSelected(game_details.fixture_id)) { //check if item already exists  or not
                setIconColor("red");
                setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
                
                dataArray.push(game_details);
        
                localStorage.setItem("myselectedfavoritematchesdata", JSON.stringify(dataArray));
                
            } else { //Remove element from the array
                setIconColor("currentColor");
                setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");

                // Specify the fixture_id of the item to remove
                const fixtureIdToRemove = parseInt(game_details.fixture_id); 

                // Step 2: Find the index of the item with the specified fixture_id
                const index = dataArray.findIndex(item => item.fixture_id === fixtureIdToRemove);

                // Step 3: Remove the item from the array if found
                if (index !== -1) {
                    dataArray.splice(index, 1);
                }

                // Step 4: Convert the updated array back to JSON format
                const updatedArray = JSON.stringify(dataArray);

                // Step 5: Store the updated array in localStorage
                localStorage.setItem('myselectedfavoritematchesdata', updatedArray);//Update with the new array
            }
        } else {//Adding item for the first time
            setIconColor("red");
            
            // Find the index of the fixture with matching fixture_id
            const existingIndex = dataArray.findIndex(fixture => fixture.fixture_id === parseInt(game_details.fixture_id));

            if (existingIndex !== -1) {
                // Replace the existing fixture with the updated game_details
                dataArray[existingIndex] = game_details;
            } else {
                // Add the game_details to the array
                dataArray.push(game_details);
            }

             localStorage.setItem("myselectedfavoritematchesdata", JSON.stringify(dataArray));
        }

        //Fetch fixture ids from the localStorage data array
        const fixtureIds = dataArray.map(item => ({ fixture_id: item.fixture_id }));

        // function creates myselectedfavoritematchesdata on if its null
        FetchFixtureByIdMyFav(fixtureIds);
    };  
    
    //Match details page naviagtion, disable click when the table is on match details page already
    let toottiptitle = router.pathname.substring(1) == "match/[match-details]" ? "" : "Click to open match details";

    //Double chance and  Over under code being used in landing page
    let double_chance_probs = DoubleChanceWinningTeamAndOdd(fixture_details.home_odd, fixture_details.draw_odd, fixture_details.away_odd, fixture_details.game_details,router.pathname.substring(1));
        
    let dc_winning_pred_value = DoubleChanceProbabilityResults(fixture_details.game_details, double_chance_probs[0],router.pathname.substring(1));

    // Note: UnderOverWinningTeamAndOdd still needs isMobile parameter - we'll pass false as default
    let winning_team_probs = UnderOverWinningTeamAndOdd(fixture_details.average, false);
    let under_over_pred_value = UnderOverProbabilityResults(fixture_details.game_details, winning_team_probs[0]);
    let over_under_prob_scale = OverUnderProbabilitiesScale(fixture_details.average);

    // Helper function to get style objects that won't change between server and client
    const getOddsCardStyle = (condition) => {
        return {
            fontWeight: condition ? "bold" : "normal",
            border: condition ? "1px solid green" : "none"
        };
    };

    const getAverageStyle = () => {
        const totalGoals = parseInt(fixture_details.game_details.goals_home) + parseInt(fixture_details.game_details.goals_away);
        const isCorrect = (totalGoals >= 3 && fixture_details.average >= 2.5) || (totalGoals < 3 && fixture_details.average < 2.5);
        
        return {
            color: isCorrect ? "green" : "",
            fontSize: isCorrect ? "15px" : "",
            fontWeight: isCorrect ? "bold" : ""
        };
    };

    // Don't render dynamic styles on server to avoid hydration mismatch
    const shouldUseClientStyles = mounted && typeof window !== 'undefined';
        
    fixturestablearray.push(
        <div key={key} className="responsive-row fixturesTextSize fixturesWholeRow" style={{cursor : "auto"}}>  
            {/* Star icon - same for all devices */}
            <div className="responsive-cell star-cell" onClick={() => selectMyMatches(fixture_details.game_details)} style={{cursor : "pointer"}}>
                <br/>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={iconColor} className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d={iconPath} />
                </svg> 
            </div>
            
            {/* Team names and date */}
            <div className="responsive-cell team-link" style={{ textAlign: "left", fontWeight:"bold", whiteSpace: "pre-wrap" }} title={toottiptitle}>                
                {router.pathname.substring(1) !== "match/[match-details]" ?
                <a href={'/match/football-predictions-' + url_name+"/matches"}>
                    <div className="teamNameLink">
                        <span>{fixture_details.game_details.home_team_name}</span><br/>
                        <span>{fixture_details.game_details.away_team_name}</span><br/>
                        <span className="table-date-time">
                            {["FT", "AWD", "AET", "PEN", "WO", "ABD"].includes(fixture_details.game_details.status_short)
                            ? myFullNewDateString
                            : myNewDateString}
                        </span>
                    </div>
                </a>
                :
                <div className="">
                    <span>{fixture_details.game_details.home_team_name}</span><br/>
                    <span>{fixture_details.game_details.away_team_name}</span><br/>
                    <span className="table-date-time" style={{fontWeight: "normal" }}>{myNewDateString}</span>
                </div>
                }
            </div> 
            
            {/* Desktop odds */}
            <div className="responsive-cell team-link-y hide-on-mobile" title="Odds 1  X  2">
                <br/>
                <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(
                    fixture_details.winning_odd == fixture_details["game_details"]["bets_home"] && fixture_details["game_details"]["bets_home"] !==null
                ) : {}}> {fixture_details["game_details"]["bets_home"] === null ? "   -  " : fixture_details["game_details"]["bets_home"]} &nbsp;</span>

                <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(
                    fixture_details.winning_odd == fixture_details["game_details"]["bets_draw"] && fixture_details["game_details"]["bets_draw"] !==null
                ) : {}}> {fixture_details["game_details"]["bets_draw"] === null ? "   -  " : fixture_details["game_details"]["bets_draw"]} &nbsp;</span>

                <span className="odds-card" style={shouldUseClientStyles ? getOddsCardStyle(
                    fixture_details.winning_odd == fixture_details["game_details"]["bets_away"] && fixture_details["game_details"]["bets_away"] !==null
                ) : {}}>&nbsp;{fixture_details["game_details"]["bets_away"] === null || fixture_details["game_details"]["bets_away"]==="-" ? "   -  " : fixture_details["game_details"]["bets_away"]} &nbsp;</span>
            </div>
            
            {/* Mobile odds */}
            <div className="responsive-cell team-link-probability hide-on-desktop" title="Odds"> 
                <div className="row fixturesTextSize">
                    <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                        <span className="odds-card" style={shouldUseClientStyles ? {border: fixture_details.game_details.goals_home != null ? (fixture_details.game_details.goals_home > fixture_details.game_details.goals_away && fixture_details["game_details"]["bets_home"] !==null) ? "1px solid green" : "" : ""} : {}}>&nbsp;{fixture_details["game_details"]["bets_home"] === null ? "   -   " : fixture_details["game_details"]["bets_home"]}&nbsp;</span>
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                        <span className="odds-card" style={shouldUseClientStyles ? {border: fixture_details.game_details.goals_home != null ? (fixture_details.game_details.goals_home === fixture_details.game_details.goals_away && fixture_details["game_details"]["bets_draw"] !==null) ? "1px solid green" : "" : ""} : {}}>&nbsp;{fixture_details["game_details"]["bets_draw"] === null ? "   -   " : fixture_details["game_details"]["bets_draw"]}&nbsp;</span>
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12" style={{margin: "1px"}}>
                        <span className="odds-card" style={shouldUseClientStyles ? {border: fixture_details.game_details.goals_home != null ? (fixture_details.game_details.goals_away >
                            fixture_details.game_details.goals_home && fixture_details["game_details"]["bets_away"] !==null  && fixture_details["game_details"]["bets_away"]!=="-") ? "1px solid green" : "" : ""} : {}}>
                            &nbsp;{fixture_details["game_details"]["bets_away"] === null || fixture_details["game_details"]["bets_away"]==="-" ? "   -   " : fixture_details["game_details"]["bets_away"]}&nbsp;</span>
                    </div>                 
                </div>
            </div>
            
            {/* Average Goals */}
            <div className="responsive-cell team-link-average hide-on-mobile" title="Average Goals" style={shouldUseClientStyles ? getAverageStyle() : {}}>
                {fixture_details.average}
                {shouldUseClientStyles && (
                    (parseInt(fixture_details.game_details.goals_home) + parseInt(fixture_details.game_details.goals_away)) >=3 && fixture_details.average >= 2.5 ? <i className="bi bi-arrow-up"></i> : 
                    (parseInt(fixture_details.game_details.goals_home) + parseInt(fixture_details.game_details.goals_away)) < 3 && fixture_details.average < 2.5 ? <i className="bi bi-arrow-down"></i> : ""
                )}
            </div>
            
            {/* Desktop prediction */}
            <div className="responsive-cell hide-on-mobile" title="Prediction">
                <br/>
                {router.pathname.substring(1).includes("predictions-halftime-fulltime") && fixture_details.ht_probability_results != "" ?
                    <>{fixture_details.ht_probability_results} &nbsp;|&nbsp;</>
                : <></>
                }                   
                <React.Fragment>
                {(fixture_details.home_odd === "-" || fixture_details.home_odd === null || fixture_details.home_odd == "") && (fixture_details.draw_odd === "-" || fixture_details.draw_odd === null || fixture_details.draw_odd == "") && (fixture_details.away_odd === "-" || fixture_details.away_odd === null || fixture_details.away_odd == "") ? "-" :                      
                <>
                    {                       
                    router.pathname.substring(1) === "" || router.pathname.substring(1).includes("tips/") || router.pathname.substring(1) ==="top-football-tips-and-predictions/today" ||
                    router.pathname.substring(1) === "top-football-tips-and-predictions/yesterday" || router.pathname.substring(1) ==="top-football-tips-and-predictions/tomorrow" ?
                    fixture_details.average < 2.0  || fixture_details.average > 3.0 ?
                            under_over_pred_value
                        :
                        (fixture_details.winning_team ==="1" && fixture_details.home_odd < "50") || (fixture_details.winning_team ==="X" && fixture_details.draw_odd < "50") || (fixture_details.winning_team ==="2" && fixture_details.away_odd < "50")  ? 
                            dc_winning_pred_value
                        :
                            fixture_details.probability_results
                    :                          
                        fixture_details.probability_results                    
                    }
                </>
                }
                </React.Fragment>
            </div>
            
            {/* Mobile prediction */}
            <div className="responsive-cell team-link-standings hide-on-desktop" title="Prediction" style={{fontWeight:"bold", textAlign: "center"}}>
                <React.Fragment>
                    <br/>
                    {(fixture_details.home_odd === "-" || fixture_details.home_odd === null || fixture_details.home_odd == "") && (fixture_details.draw_odd === "-" || fixture_details.draw_odd === null || fixture_details.draw_odd == "") && (fixture_details.away_odd === "-" || fixture_details.away_odd === null || fixture_details.away_odd == "") ? "" :                      
                    <>
                    {(fixture_details.home_odd === "-" || fixture_details.home_odd === null || fixture_details.home_odd == "") && (fixture_details.draw_odd === "-" || fixture_details.draw_odd === null || fixture_details.draw_odd == "") && (fixture_details.away_odd === "-" || fixture_details.away_odd === null || fixture_details.away_odd == "") ? "-" :                      
                        router.pathname.substring(1) === "" || router.pathname.substring(1).includes("tips/") || router.pathname.substring(1) ==="top-football-tips-and-predictions/today" ||
                        router.pathname.substring(1) === "top-football-tips-and-predictions/yesterday" || router.pathname.substring(1) ==="top-football-tips-and-predictions/tomorrow" ?
                        fixture_details.average < 2.0  || fixture_details.average > 3.0 ?
                                under_over_pred_value
                            :
                            (fixture_details.winning_team ==="1" && fixture_details.home_odd < "50") || (fixture_details.winning_team ==="X" && fixture_details.draw_odd < "50") || (fixture_details.winning_team ==="2" && fixture_details.away_odd < "50")  ? 
                                dc_winning_pred_value
                            :
                            fixture_details.probability_results
                        :   
                        
                        router.pathname.substring(1).includes("predictions-halftime-fulltime") && fixture_details.ht_probability_results != "" ?
                            <>{fixture_details.ht_probability_results}&nbsp;|&nbsp;{fixture_details.probability_results}</>
                        :                     
                        fixture_details.probability_results
                    }
                    <br/><br/></>
                    }
                    </React.Fragment>
                    
                    {/* Winning Probability % for mobile */}
                    <span style={{fontWeight: "bold"}} className="hide-on-desktop">
                    {
                    fixture_details.home_odd == "-" | fixture_details.home_odd == null | fixture_details.home_odd == "" && fixture_details.draw_odd == "-" | fixture_details.draw_odd == null | fixture_details.draw_odd == "" && fixture_details.away_odd == "-" | fixture_details.away_odd == null | fixture_details.away_odd == "" ? "-"
                    :
                    router.pathname.substring(1).includes("double-chance-predictions") ? //Double chance Predictions
                        double_chance_probs[0] ==="1X"? (parseInt(fixture_details.home_odd)+parseInt(fixture_details.draw_odd)) + "%" : double_chance_probs[0] ==="X2" ? (parseInt(fixture_details.draw_odd)+parseInt(fixture_details.away_odd)) + "%" : (parseInt(fixture_details.home_odd)+parseInt(fixture_details.away_odd)) + "%"
                    :
                    router.pathname.substring(1).includes("predictions-under-over") ? //Over/Under 2.5 Predictions
                        fixture_details.average !="-" ? Math.max(...over_under_prob_scale) + "%" : "-"
                    :
                    router.pathname.substring(1).includes("predictions-both-to-score") ? //Predictions-both-to-score
                        fixture_details.game_details.both_team_to_score != null ? 
                            Math.max(parseInt(fixture_details.home_odd), parseInt(fixture_details.draw_odd), parseInt(fixture_details.away_odd)) + Math.min(parseInt(fixture_details.home_odd), parseInt(fixture_details.draw_odd), parseInt(fixture_details.away_odd)) + "%"
                        : ""
                    :
                    router.pathname.substring(1) ==="" ?
                    (fixture_details.average < 2.0  || fixture_details.average > 3.0) && fixture_details.average != "-" ?
                            Math.max(...over_under_prob_scale) + "%" //Selecting max value from array, eg[60, 40]
                        : (fixture_details.winning_team ==="1" && fixture_details.home_odd < "50") || (fixture_details.winning_team ==="X" && fixture_details.draw_odd < "50") || (fixture_details.winning_team ==="2" && fixture_details.away_odd < "50")  ? 
                            double_chance_probs[0] ==="1X"? (parseInt(fixture_details.home_odd)+parseInt(fixture_details.draw_odd)) + "%" : double_chance_probs[0] ==="X2" ? (parseInt(fixture_details.draw_odd)+parseInt(fixture_details.away_odd)) + "%" : (parseInt(fixture_details.home_odd)+parseInt(fixture_details.away_odd)) + "%"
                        :
                            fixture_details.winning_team === '1' ? fixture_details.home_odd + "%" : (fixture_details.winning_team === 'X' ? fixture_details.draw_odd + "%" : fixture_details.away_odd + "%")
                        : 
                            fixture_details.winning_team === '1' ? fixture_details.home_odd+"%" : (fixture_details.winning_team === 'X' ? fixture_details.draw_odd+"%" : fixture_details.away_odd+ "%")
                    }
                    </span>
                </div>
            
            {/* Desktop winning probability */}
            <div className="responsive-cell hide-on-mobile" title="Winning Probability" style={{fontWeight:"bold"}}>
                <span className= {fixture_details.home_odd == "-" | fixture_details.home_odd == null | fixture_details.home_odd == ""  && fixture_details.draw_odd == "-" | fixture_details.draw_odd == null | fixture_details.draw_odd == "" && fixture_details.away_odd == "-" | fixture_details.away_odd == null | fixture_details.away_odd == "" ? "": "predictionHoverEffect"}>
                    {
                        fixture_details.home_odd == "-" | fixture_details.home_odd == null | fixture_details.home_odd == "" && fixture_details.draw_odd == "-" | fixture_details.draw_odd == null | fixture_details.draw_odd == "" && fixture_details.away_odd == "-" | fixture_details.away_odd == null | fixture_details.away_odd == "" ? "-"
                    :
                    router.pathname.substring(1).includes("double-chance-predictions") ? //Double chance Predictions
                        double_chance_probs[0] ==="1X"? (parseInt(fixture_details.home_odd)+parseInt(fixture_details.draw_odd)) + "%" : double_chance_probs[0] ==="X2" ? (parseInt(fixture_details.draw_odd)+parseInt(fixture_details.away_odd)) + "%" : (parseInt(fixture_details.home_odd)+parseInt(fixture_details.away_odd)) + "%"
                    :
                    router.pathname.substring(1).includes("predictions-under-over") ? //Over/Under 2.5 Predictions
                        fixture_details.average !="-" ? Math.max(...over_under_prob_scale) + "%" : "-"
                    :
                    router.pathname.substring(1).includes("predictions-both-to-score") ? //Predictions-both-to-score
                        fixture_details.game_details.both_team_to_score != null ? 
                        Math.max(parseInt(fixture_details.home_odd), parseInt(fixture_details.draw_odd), parseInt(fixture_details.away_odd)) + Math.min(parseInt(fixture_details.home_odd), parseInt(fixture_details.draw_odd), parseInt(fixture_details.away_odd)) + "%" : "-"
                    :
                    router.pathname.substring(1) ===""  ? // Prediction 1x2, except for landing page
                    (fixture_details.average < 2.0  || fixture_details.average > 3.0) && fixture_details.average != "-" ?
                            Math.max(...over_under_prob_scale) + "%" //Selecting max value from array, eg[60, 40]
                        : (fixture_details.winning_team ==="1" && fixture_details.home_odd < "50") || (fixture_details.winning_team ==="X" && fixture_details.draw_odd < "50") || (fixture_details.winning_team ==="2" && fixture_details.away_odd < "50")  ? 
                            double_chance_probs[0] ==="1X"? (parseInt(fixture_details.home_odd)+parseInt(fixture_details.draw_odd)) + "%" : double_chance_probs[0] ==="X2" ? (parseInt(fixture_details.draw_odd)+parseInt(fixture_details.away_odd)) + "%" : (parseInt(fixture_details.home_odd)+parseInt(fixture_details.away_odd)) + "%"
                        :
                            <PopupProbabilityTooltip home_team_name= {fixture_details.game_details.home_team_name} away_team_name = {fixture_details.game_details.away_team_name} winning_team = {fixture_details.winning_team} home_odd= {fixture_details.home_odd + "%"} draw_odd= {fixture_details.draw_odd + "%"} away_odd={fixture_details.away_odd + "%"} pred_type="1X2"/>
                        : 
                        <PopupProbabilityTooltip home_team_name= {fixture_details.game_details.home_team_name} away_team_name = {fixture_details.game_details.away_team_name} winning_team = {fixture_details.winning_team} home_odd= {fixture_details.home_odd + "%"} draw_odd= {fixture_details.draw_odd + "%"} away_odd={fixture_details.away_odd + "%"} pred_type="1X2"/>
                    }
                </span>
            </div> 
            
            {/* Desktop status */}
            <div className="responsive-cell team-link-standings hide-on-mobile" style={{ color: "red", whiteSpace:"pre-wrap" }} title="Status">
                <span style={{whiteSpace:"pre-wrap"}}>{fixture_details.livestatus}</span>
            </div>
            
            {/* Mobile status */}
            <div className="responsive-cell team-link-l hide-on-desktop" style={{ color: "red", whiteSpace:"nowrap" }} title="Status">
                <span style={{whiteSpace:"nowrap"}}><br/>{fixture_details.livestatus}</span>
            </div>
            
            {/* Scores - same for all devices */}
            <div className="responsive-cell team-link-scores" style={{ color: "red" }} title="Scores">
                {fixture_details.extratime_data && fixture_details.extratime_data != <br/> ? 
                    <><span style={{color:"black"}}>{fixture_details.extratime_data}</span><br/></> 
                    : null
                } 
                {fixture_details.livescores}<br/>
                <span className="halfTimeDataDisplay" style={{color:"black"}}>{fixture_details.halftime_data}</span>
            </div>          
        </div>
    )

    return fixturestablearray;        
}

export default FixturesTableDisplay;