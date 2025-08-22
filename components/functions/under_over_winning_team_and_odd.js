function UnderOverWinningTeamAndOdd(averageGoals, isMobile){
    let winning_team = "";
    let winning_odd = "";

    var winning_preds_array = [];

    if(averageGoals ==="-"){
      winning_team = "-";
    } else {
      //determine prediction
      if (averageGoals < 2.5) {
        if(isMobile === true){
          winning_team = "UN25"
        }else {
          winning_team = "Un2.5";
        }
      }else if (averageGoals >= 2.5) {
        if(isMobile === true){
          winning_team = "OV25";
        }else {
          winning_team = "Ov2.5"
        }
      } 
    }   

    winning_preds_array.push(winning_team, winning_odd);
      
    return winning_preds_array;
}

export default UnderOverWinningTeamAndOdd;