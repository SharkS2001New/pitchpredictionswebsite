function Teamwinsdrawsloses(team_matches, team_id){
    let team_stats_array =[];
    // let team_id = team_id; // Replace with the ID of the team you're interested in
    let games_won = 0;
    let games_lost = 0;
    let games_drawn = 0;
    
    for(let i = 0; i < team_matches.length; i++) {
      let match = team_matches[i];
      if((match.home_team_id === team_id && match.goals_home > match.goals_away) ||
         (match.away_team_id === team_id && match.goals_away > match.goals_home)) {
        // Team won the match
        games_won++;
      } else if((match.home_team_id === team_id && match.goals_home < match.goals_away) ||
                (match.away_team_id === team_id && match.goals_away < match.goals_home)) {
        // Team lost the match
        games_lost++;
      } else {
        // Match was drawn
        games_drawn++;
      }
    }

    team_stats_array.push({"won":games_won,"draw":games_drawn,"lost":games_lost});

    return team_stats_array;
}
export default Teamwinsdrawsloses;