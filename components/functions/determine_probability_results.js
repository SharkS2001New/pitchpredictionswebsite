function ProbabilityResults(game_details,winning_team){
    var probability_results = "";
    
    //Determine if prediction was right or wrong
    if(game_details.status_short == "NS" || game_details.status_short == "HT" || game_details.status_short == "2H" || game_details.status_short == "1H" || game_details.status_short == "INT" || game_details.status_short == "ET" || game_details.status_short == "TBD" || game_details.status_short == "LIVE" || game_details.status_short == "BT" || game_details.status_short == "ABD"){

        probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400"}}>{winning_team}</span>;

    }else if(game_details.status_short === "CANC" || game_details.status_short == "PST"){

        probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",color:"white",fontWeight:"bold",textTransform:"lowercase"}}>{winning_team}</span>;

    }else if(game_details.status_short === "FT" || game_details.status_short === "AWD" || game_details.status_short==="PEN" || game_details.status_short ==="AET"){
        
        if(winning_team == 1 && game_details.goals_home > game_details.goals_away){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == 2 && game_details.goals_away > game_details.goals_home){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == "Under2.5" &&  (parseInt(game_details.goals_home) + parseInt(game_details.goals_away)) <= 3){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if(winning_team == "Over2.5" &&  (parseInt(game_details.goals_home) + parseInt(game_details.goals_away)) >= 3){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;
            
        }else if(winning_team == 1 && game_details.goals_home < game_details.goals_away){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 1  && game_details.goals_home == game_details.goals_away){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 2 && game_details.goals_away < game_details.goals_home){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 2 && game_details.goals_away == game_details.goals_home){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 'X' && game_details.goals_away == game_details.goals_home){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == 'X' && game_details.goals_away != game_details.goals_home){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
        
        }else if(winning_team == "Under2.5" &&  (parseInt(game_details.goals_home) + parseInt(game_details.goals_away)) >= 3){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if(winning_team == "Over2.5" &&  (parseInt(game_details.goals_home) + parseInt(game_details.goals_away)) < 3){

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
                
        //Green
        }else if (winning_team === '1X' && (game_details.goals_home > game_details.goals_away || game_details.goals_home === game_details.goals_away)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if (winning_team === '12' && (game_details.goals_home > game_details.goals_away || game_details.goals_away > game_details.goals_home)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if (winning_team === 'X2' && (game_details.goals_home === game_details.goals_away || game_details.goals_home > game_details.goals_away)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        //Red
        }else if (winning_team === '1X' && !(game_details.goals_home > game_details.goals_away || game_details.goals_home === game_details.goals_away)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if (winning_team === '12' && !(game_details.goals_home > game_details.goals_away || game_details.goals_away > game_details.goals_home)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if (winning_team === 'X2' && !(game_details.goals_home === game_details.goals_away || game_details.goals_home > game_details.goals_away)) {

            probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } 
    }

    return probability_results;
}

export default ProbabilityResults