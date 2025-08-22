function DoubleChanceWinningTeamAndOdd(hometeamodd,drawodd,awayteamodd,game_details,url){
    let winning_team = "";
    let winning_odd = 0;

    var winning_preds_array = [];

    let winning_odd_home = "";
    let winning_odd_draw = "";
    let winning_odd_away = "";

    let double_chance_odds = JSON.parse(game_details.double_chance_goals);

    if(double_chance_odds  != null){
      if(double_chance_odds.length >= 3){
          if(double_chance_odds[0] != null){
            winning_odd_home  = double_chance_odds[0]["odd"];
          }else{
            winning_odd_home = "-";
          }

          if(double_chance_odds[0] != null){
            winning_odd_draw  = double_chance_odds[1]["odd"];
          }else{
            winning_odd_draw = "-";
          }

          if(double_chance_odds[0] != null){
            winning_odd_away  = double_chance_odds[2]["odd"];
          }else{
            winning_odd_away = "-";
          }
      }
    }

     //determine prediction
     if ((hometeamodd > drawodd && hometeamodd > awayteamodd) && drawodd > awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_home;

      }else if ((hometeamodd > drawodd && hometeamodd > awayteamodd) && drawodd === awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_home;

      } else if ((awayteamodd > drawodd && awayteamodd > hometeamodd) && drawodd === hometeamodd) {
        winning_team = "X2";
        winning_odd = winning_odd_away;

      } else if ((drawodd > hometeamodd && drawodd > awayteamodd) && awayteamodd > hometeamodd) {
        winning_team = "X2";
        winning_odd = winning_odd_away;

      } else if ((drawodd > hometeamodd && drawodd > awayteamodd) && hometeamodd > awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_away;

      } else if ((awayteamodd > hometeamodd && awayteamodd > drawodd) && hometeamodd > drawodd) {
        winning_team = "12";
        winning_odd = winning_odd_away;

      } else if ((awayteamodd > hometeamodd && awayteamodd > drawodd) && drawodd > hometeamodd) {
        winning_team = "X2";
        winning_odd = winning_odd_away;

      } else if ((hometeamodd > drawodd && hometeamodd > awayteamodd) && awayteamodd > drawodd) {
        winning_team = "12";
        winning_odd = winning_odd_draw;

      } else if (hometeamodd == drawodd && drawodd == awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_home;

      } else if (hometeamodd == drawodd && hometeamodd > awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_home;

      } else if (hometeamodd == awayteamodd && hometeamodd > drawodd) {
        winning_team = "12";
        winning_odd = winning_odd_home;

      } else if (awayteamodd == drawodd && awayteamodd > hometeamodd) {
        winning_team = "X2";
        winning_odd = winning_odd_away;

      } else if (hometeamodd == awayteamodd && drawodd > hometeamodd) {
        winning_team = "X2";
        winning_odd = winning_odd_home;

      }else if (hometeamodd == awayteamodd && drawodd > awayteamodd) {
        winning_team = "1X";
        winning_odd = winning_odd_home;
      }

      winning_preds_array.push(winning_team, winning_odd);
      

     return winning_preds_array;
}

export default DoubleChanceWinningTeamAndOdd;