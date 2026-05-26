function UnderOverWinningTeamAndOdd(averageGoals, isMobile){
  let winning_team = "";
  let winning_odd = "";

  var winning_preds_array = [];

  if(averageGoals === "-" || averageGoals === null || averageGoals === undefined){
    winning_team = "-";
  } else {
    // Convert to number if it's a string
    const avgGoals = typeof averageGoals === 'string' ? parseFloat(averageGoals) : averageGoals;
    
    // Determine prediction
    if (avgGoals < 2.5) {
      winning_team = isMobile === true ? "UN25" : "Un2.5";
    } else if (avgGoals >= 2.5) {
      winning_team = isMobile === true ? "OV25" : "Ov2.5";
    } 
  }   

  winning_preds_array.push(winning_team, winning_odd);
    
  return winning_preds_array;
}

export default UnderOverWinningTeamAndOdd;