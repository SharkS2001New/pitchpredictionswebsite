function TeamStatsComputations(team_matches, team_id){
    let team_stats_computations_array =[];

    // initialize variables
    let goalsScored = 0;
    let goalsConceded = 0;
    let totalMatches = 0;
    let under15 = 0;
    let over15 = 0;
    let under25 = 0;
    let over25 = 0;
    let under35 = 0;
    let over35 = 0;
    let bttsYes = 0;
    let bttsNo = 0;
    let cleanSheetYes = 0;
    let cleanSheetNo = 0;
    let scoredAGoalYes = 0;
    let scoredAGoalNo = 0;

    // iterate over matches
    for (let i = 0; i < team_matches.length; i++) {
        let match = team_matches[i];
            // compute total goals scored and conceded
        if (match.home_team_id === team_id) {
            goalsScored += match.ft_goals_home;
            goalsConceded += match.ft_goals_away;
        } else if (match.away_team_id === team_id) {
            goalsScored += match.ft_goals_away;
            goalsConceded += match.ft_goals_home;
        }

        // compute match outcome variables
        let totalGoals = match.ft_goals_home + match.ft_goals_away;
        if (totalGoals < 1.5) {
            under15++;
        } else if (totalGoals > 1.5) {
            over15++;
        }
        if (totalGoals < 2.5) {
            under25++;
        } else if (totalGoals > 2.5) {
            over25++;
        }
        if (totalGoals < 3.5) {
            under35++;
        } else if (totalGoals > 3.5) {
            over35++;
        }
        //both teams scored a gola
        if (match.ft_goals_home > 0 && match.ft_goals_away > 0) {
            bttsYes++;
        } else {
            bttsNo++;
        }
        if (match.ft_goals_home === 0 || match.ft_goals_away === 0) {
            cleanSheetYes++;
        } else {
            cleanSheetNo++;
        }
        if (match.ft_goals_home > 0 && match.ft_goals_away > 0 && totalGoals > 1) {
            scoredAGoalYes++;
        } else {
            scoredAGoalNo++;
        }

        totalMatches++;
    }

    // compute average of goals scored and conceded
    let avgGoalsScored = (goalsScored / totalMatches).toFixed(2);
    let avgGoalsConceded = (goalsConceded / totalMatches).toFixed(2);
    let avgTotalGoals = ((goalsScored + goalsConceded) / totalMatches).toFixed(2);
    let avgGoalsRatio = avgTotalGoals / (avgGoalsScored + avgGoalsConceded);
    
    //push results to array
    team_stats_computations_array.push({"goalsScored":goalsScored,"goalsConceded":goalsConceded,"totalMatches":totalMatches,"under15":under15,"over15":over15,"under25":under25,"over25":over25,
    "under35":under35,"over35":over35,"bttsYes":bttsYes,"bttsNo":bttsNo,"cleanSheetYes":cleanSheetYes,"cleanSheetNo":cleanSheetNo,"scoredAGoalYes":scoredAGoalYes,"scoredAGoalNo":scoredAGoalNo,
    "avgGoalsScored":avgGoalsScored,"avgGoalsConceded":avgGoalsConceded,"avgTotalGoals":avgTotalGoals,"avgGoalsRatio":avgGoalsRatio});

    return team_stats_computations_array;
}

export default TeamStatsComputations;