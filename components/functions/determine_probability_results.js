function ProbabilityResults(game_details, winning_team){
    var probability_results = "";
    
    // Get data from new API structure
    const statusShort = game_details.match?.status || game_details.status_short;
    const homeScore = game_details.score?.home ?? game_details.goals_home;
    const awayScore = game_details.score?.away ?? game_details.goals_away;
    
    // Determine if prediction was right or wrong
    if(statusShort === "NS" || statusShort === "HT" || statusShort === "2H" || statusShort === "1H" || 
       statusShort === "INT" || statusShort === "ET" || statusShort === "TBD" || statusShort === "LIVE" || 
       statusShort === "BT" || statusShort === "ABD"){

        probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400"}}>{winning_team}</span>;

    } else if(statusShort === "CANC" || statusShort === "PST"){

        probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",color:"white",fontWeight:"bold",textTransform:"lowercase"}}>{winning_team}</span>;

    } else if(statusShort === "FT" || statusShort === "AWD" || statusShort === "P" || statusShort === "ET" || 
              statusShort === "PEN" || statusShort === "AET"){
        
        // Check if scores exist
        if (homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined) {
            const totalGoals = parseInt(homeScore) + parseInt(awayScore);
            
            // 1X2 predictions
            if(winning_team === 1 && homeScore > awayScore){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if(winning_team === 2 && awayScore > homeScore){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if(winning_team === 'X' && awayScore === homeScore){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if(winning_team === 1 && (homeScore < awayScore || homeScore === awayScore)){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

            } else if(winning_team === 2 && (awayScore < homeScore || awayScore === homeScore)){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

            } else if(winning_team === 'X' && awayScore !== homeScore){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
            
            // Double Chance predictions
            } else if (winning_team === '1X' && (homeScore > awayScore || homeScore === awayScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if (winning_team === '12' && (homeScore > awayScore || awayScore > homeScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if (winning_team === 'X2' && (awayScore > homeScore || homeScore === awayScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if (winning_team === '1X' && !(homeScore > awayScore || homeScore === awayScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

            } else if (winning_team === '12' && !(homeScore > awayScore || awayScore > homeScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

            } else if (winning_team === 'X2' && !(awayScore > homeScore || homeScore === awayScore)) {
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
            
            // Over/Under predictions
            } else if(winning_team === "Under2.5" && totalGoals <= 2){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if(winning_team === "Over2.5" && totalGoals >= 3){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

            } else if(winning_team === "Under2.5" && totalGoals >= 3){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

            } else if(winning_team === "Over2.5" && totalGoals <= 2){
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
            }
        } else {
            // Scores not available yet
            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400"}}>{winning_team}</span>;
        }
    }

    return probability_results;
}

export default ProbabilityResults;