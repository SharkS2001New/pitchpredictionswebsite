function HalfTimeProbabilityResults(game_details,winning_team){
    var hf_probability_results = "";
    
    let ht_home_goals = JSON.parse(game_details.scores).halftime.home;
    let ht_away_goals = JSON.parse(game_details.scores).halftime.away;
    //Determine if prediction was right or wrong
    if(game_details.status_short == "NS" || game_details.status_short == "TBD" || game_details.status_short == "ABD"){

        hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400"}}>{winning_team}</span>;

    } else if(game_details.status_short === "CANC" || game_details.status_short == "PST"){

        hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"#ffb400",color:"white",fontWeight:"bold",textTransform:"lowercase"}}>{winning_team}</span>;

    } else if(game_details.status_short === "HT" || game_details.status_short === "1H" || game_details.status_short === "2H" || game_details.status_short === "LIVE" || game_details.status_short === "ET" || game_details.status_short === "BT" || game_details.status_short === "FT"){   
        if(winning_team == 1 && ht_home_goals > ht_away_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == 2 && ht_away_goals > ht_home_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == "Under2.5" &&  (parseInt(ht_home_goals) + parseInt(ht_away_goals)) <= 3){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if(winning_team == "Over2.5" &&  (parseInt(ht_home_goals) + parseInt(ht_away_goals)) >= 3){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;
            
        }else if(winning_team == 1 && ht_home_goals < ht_away_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 1  && ht_home_goals == ht_away_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 2 && ht_away_goals < ht_home_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 2 && ht_away_goals == ht_home_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        }else if(winning_team == 'X' && ht_away_goals == ht_home_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        }else if(winning_team == 'X' && ht_away_goals != ht_home_goals){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
        
        }else if(winning_team == "Under2.5" &&  (parseInt(ht_home_goals) + parseInt(ht_away_goals)) >= 3){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if(winning_team == "Over2.5" &&  (parseInt(ht_home_goals) + parseInt(ht_away_goals)) < 3){

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
                
        //Green
        }else if (winning_team === '1X' && (ht_home_goals > ht_away_goals || ht_home_goals === ht_away_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if (winning_team === '12' && (ht_home_goals > ht_away_goals || ht_away_goals > ht_home_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        } else if (winning_team === 'X2' && (ht_home_goals === ht_away_goals || ht_home_goals > ht_away_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"green"}}>{winning_team}</span>;

        //Red
        }else if (winning_team === '1X' && !(ht_home_goals > ht_away_goals || ht_home_goals === ht_away_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if (winning_team === '12' && !(ht_home_goals > ht_away_goals || ht_away_goals > ht_home_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;

        } else if (winning_team === 'X2' && !(ht_home_goals === ht_away_goals || ht_home_goals > ht_away_goals)) {

            hf_probability_results = <span className="number-circle rounded-square" style={{backgroundColor:"white",border:"1px solid",borderColor:"red",color:"red"}}>{winning_team}</span>;
        }       
    }

    return hf_probability_results;
}

export default HalfTimeProbabilityResults