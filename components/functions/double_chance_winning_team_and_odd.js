function DoubleChanceWinningTeamAndOdd(hometeamodd, drawodd, awayteamodd, game_details, url) {
  let winning_team = "";
  let winning_odd = 0;

  var winning_preds_array = [];

  let winning_odd_home = "";
  let winning_odd_draw = "";
  let winning_odd_away = "";

  // Get double chance odds from new API structure
  if (game_details.odds?.double_chance) {
      const dc = game_details.odds.double_chance;
      winning_odd_home = dc.home_draw || "-";
      winning_odd_draw = dc.draw_away || "-";
      winning_odd_away = dc.home_away || "-";
  } else {
      winning_odd_home = "-";
      winning_odd_draw = "-";
      winning_odd_away = "-";
  }

  // Convert probabilities to numbers for comparison
  const homeProb = parseFloat(hometeamodd);
  const drawProb = parseFloat(drawodd);
  const awayProb = parseFloat(awayteamodd);

  // Determine prediction based on probabilities
  if (homeProb > drawProb && homeProb > awayProb && drawProb > awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_home;

  } else if (homeProb > drawProb && homeProb > awayProb && drawProb === awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_home;

  } else if (awayProb > drawProb && awayProb > homeProb && drawProb === homeProb) {
      winning_team = "X2";
      winning_odd = winning_odd_away;

  } else if (drawProb > homeProb && drawProb > awayProb && awayProb > homeProb) {
      winning_team = "X2";
      winning_odd = winning_odd_away;

  } else if (drawProb > homeProb && drawProb > awayProb && homeProb > awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_away;

  } else if (awayProb > homeProb && awayProb > drawProb && homeProb > drawProb) {
      winning_team = "12";
      winning_odd = winning_odd_away;

  } else if (awayProb > homeProb && awayProb > drawProb && drawProb > homeProb) {
      winning_team = "X2";
      winning_odd = winning_odd_away;

  } else if (homeProb > drawProb && homeProb > awayProb && awayProb > drawProb) {
      winning_team = "12";
      winning_odd = winning_odd_draw;

  } else if (homeProb === drawProb && drawProb === awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_home;

  } else if (homeProb === drawProb && homeProb > awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_home;

  } else if (homeProb === awayProb && homeProb > drawProb) {
      winning_team = "12";
      winning_odd = winning_odd_home;

  } else if (awayProb === drawProb && awayProb > homeProb) {
      winning_team = "X2";
      winning_odd = winning_odd_away;

  } else if (homeProb === awayProb && drawProb > homeProb) {
      winning_team = "X2";
      winning_odd = winning_odd_home;

  } else if (homeProb === awayProb && drawProb > awayProb) {
      winning_team = "1X";
      winning_odd = winning_odd_home;
  }

  winning_preds_array.push(winning_team, winning_odd);

  return winning_preds_array;
}

export default DoubleChanceWinningTeamAndOdd;