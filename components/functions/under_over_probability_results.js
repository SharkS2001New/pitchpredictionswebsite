function UnderOverProbabilityResults(game_details, winning_team){
    var probability_results = "";

    // Get status and scores from new API structure
    const statusShort = game_details.match?.status || game_details.status_short;
    const goalsHome = game_details.score?.home ?? game_details.goals_home;
    const goalsAway = game_details.score?.away ?? game_details.goals_away;

    if(winning_team === "-") {
        probability_results = "-";
    } else {
        // Determine if prediction was right or wrong
        if(statusShort === "NS" || statusShort === "HT" || statusShort === "2H" || statusShort === "1H" || 
           statusShort === "INT" || statusShort === "TBD" || statusShort === "LIVE" || statusShort === "BT" || 
           statusShort === "ABD"){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",border:"2px solid",borderColor:"#ffb400",color:"white"}}>{winning_team}</span>;

        } else if(statusShort === "CANC" || statusShort === "PST"){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",color:"black",fontWeight:"bold",fontSize:"12px",textTransform:"lowercase"}}>{statusShort}</span>;

        } else if(statusShort === "FT" || statusShort === "AWD" || statusShort === "PEN" || statusShort === "AET"){
            // Check if scores exist
            if(goalsHome !== null && goalsHome !== undefined && goalsAway !== null && goalsAway !== undefined){
                const totalGoals = parseInt(goalsHome) + parseInt(goalsAway);
                
                if((winning_team === "Un2.5" || winning_team === "UN25") && totalGoals < 3){
                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green",border:"2px solid",borderColor:"green",color:"white"}}>{winning_team}</span>;

                } else if((winning_team === "Ov2.5" || winning_team === "OV25") && totalGoals >= 3){
                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green",border:"2px solid",borderColor:"green",color:"white"}}>{winning_team}</span>;

                } else if((winning_team === "Un2.5" || winning_team === "UN25") && totalGoals >= 3){
                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"2px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

                } else if((winning_team === "Ov2.5" || winning_team === "OV25") && totalGoals < 3){
                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"2px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
                }
            } else {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",border:"2px solid",borderColor:"#ffb400",color:"white"}}>{winning_team}</span>;
            }                 
        }
    }

    return probability_results;
}

export default UnderOverProbabilityResults;