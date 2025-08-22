function ComputeFixtureAverage(goals_for_home,goals_aganist_home,goals_for_away,goals_aganist_away,total_games_played_by_home,total_games_played_by_away) {
    if(goals_for_home || goals_for_away && total_games_played_by_home || total_games_played_by_away != null){

        let total_average_goals = parseInt(goals_for_home) + parseInt(goals_aganist_home) + parseInt(goals_for_away) + parseInt(goals_aganist_away);
        let total_played = parseInt(total_games_played_by_home) + parseInt(total_games_played_by_away);
    
        let average_goals = parseFloat(total_average_goals)/parseFloat(total_played);
        
        if(average_goals > 0){
            return average_goals.toFixed(2);
        }else{
            return "-";
        }
    }else {
        return "-";
    }
}

export default ComputeFixtureAverage;