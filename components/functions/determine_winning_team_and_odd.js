function WinningTeamAndOdd(hometeamodd, drawodd, awayteamodd, game_details){
    let winning_team = "";
    let winning_odd = 0;

    var winning_preds_array = [];

    // Get odds from new API structure
    const winning_odd_home = game_details.odds?.home?.toString() || game_details.bets_home;
    const winning_odd_draw = game_details.odds?.draw?.toString() || game_details.bets_draw;  
    const winning_odd_away = game_details.odds?.away?.toString() || game_details.bets_away;

    // Convert probabilities to numbers for comparison
    const homeProb = parseFloat(hometeamodd);
    const drawProb = parseFloat(drawodd);
    const awayProb = parseFloat(awayteamodd);

    // Determine prediction based on probabilities
    if (homeProb > drawProb && homeProb > awayProb) {
        winning_team = "1";
        winning_odd = winning_odd_home;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (drawProb > homeProb && drawProb > awayProb) {
        winning_team = "X";
        winning_odd = winning_odd_draw;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (awayProb > drawProb && awayProb > homeProb) {
        winning_team = "2";
        winning_odd = winning_odd_away;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (drawProb === homeProb && awayProb < homeProb) {
        winning_team = "1";
        winning_odd = winning_odd_home;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (drawProb === homeProb && awayProb > drawProb) {
        winning_team = "2";
        winning_odd = winning_odd_away;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (drawProb === awayProb && homeProb < awayProb) {
        winning_team = "X";
        winning_odd = winning_odd_away;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (homeProb === awayProb && homeProb > drawProb) {
        winning_team = "1";
        winning_odd = winning_odd_home;
        winning_preds_array.push(winning_team, winning_odd);

    } else if (homeProb === drawProb && drawProb === awayProb) {
        winning_team = "X";
        winning_odd = winning_odd_draw;
        winning_preds_array.push(winning_team, winning_odd);
    }

    return winning_preds_array;
}

export default WinningTeamAndOdd;