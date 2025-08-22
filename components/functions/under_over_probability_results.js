function UnderOverProbabilityResults(game_details,winning_team){
    var probability_results = "";

    if(winning_team =="-") {
        probability_results = "-";
    } else {
        //Determine if prediction was right or wrong
        if(game_details.status_short == "NS" || game_details.status_short == "HT" || game_details.status_short == "2H" || game_details.status_short == "1H" || game_details.status_short == "INT" || game_details.status_short == "TBD" || game_details.status_short == "LIVE" || game_details.status_short == "BT" || game_details.status_short == "ABD"){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",border:"2px solid",borderColor:"#ffb400",color:"white"}}>{winning_team}</span>;

        }else if(game_details.status_short === "CANC" || game_details.status_short == "PST"){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",color:"black",fontWeight:"bold",fontSize:"12px",textTransform:"lowercase"}}>{game_details.status_short}</span>;

        }else if(game_details.status_short === "FT" || game_details.status_short === "AWD" || game_details.status_short==="PEN" || game_details.status_short ==="AET"){
            //greens start here
            if(game_details.goals_home !== null && game_details.goals_away !== null){
                if((winning_team == "Un2.5" || winning_team=="UN25") &&  (parseInt(game_details.goals_home)+parseInt(game_details.goals_away))< 3){

                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green",border:"2px solid",borderColor:"green",color:"white"}}>{winning_team}</span>;

                }else if((winning_team == "Ov2.5" || winning_team =="OV25") &&  (parseInt(game_details.goals_home)+parseInt(game_details.goals_away)) >= 3){

                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green",border:"2px solid",borderColor:"green",color:"white"}}>{winning_team}</span>;

                }else if((winning_team == "Un2.5" || winning_team =="UN25") &&  (parseInt(game_details.goals_home)+parseInt(game_details.goals_away))>= 3){

                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"2px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

                }else if((winning_team == "Ov2.5" || winning_team =="OV25") &&  (parseInt(game_details.goals_home)+parseInt(game_details.goals_away)) < 3){

                    probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"2px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
                }
            }else{
                probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",border:"2px solid",borderColor:"#ffb400",color:"white"}}>{winning_team}</span>;
            }                 
        }
    }

    return probability_results;
}

export default UnderOverProbabilityResults