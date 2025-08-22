function WinningTeamAndOdd(hometeamodd,drawodd,awayteamodd,game_details){
    let winning_team = "";
    let winning_odd = 0;

    var winning_preds_array = [];

    let winning_odd_home  = game_details.bets_home;

    let winning_odd_draw = game_details.bets_draw;  
    
    let winnig_odd_away  = game_details.bets_away;

     //determine prediction
     if(hometeamodd > drawodd && hometeamodd > awayteamodd)
     {
         winning_team = "1";
         winning_odd = winning_odd_home;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(drawodd > hometeamodd && drawodd > awayteamodd){
     
         winning_team = "X";
         winning_odd = winning_odd_draw;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(awayteamodd > drawodd && awayteamodd > hometeamodd){
 
         winning_team = "2";
         winning_odd = winnig_odd_away;

         winning_preds_array.push(winning_team,winning_odd);

     } else if(drawodd == hometeamodd && awayteamodd < hometeamodd)
     {
         winning_team = "1";
         winning_odd = winning_odd_home;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(drawodd == hometeamodd && awayteamodd > drawodd)
     {
         winning_team = "2";
         winning_odd = winnig_odd_away;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(drawodd == awayteamodd && hometeamodd < awayteamodd)
     {
         winning_team = "X";
         winning_odd = winnig_odd_away;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(hometeamodd == awayteamodd && hometeamodd > drawodd)
     {
         winning_team = "1";
         winning_odd = winning_odd_home;

         winning_preds_array.push(winning_team,winning_odd);
 
     } else if(hometeamodd == drawodd &&  drawodd == awayteamodd)
     {
         winning_team = "X";
         winning_odd = winning_odd_draw;

         winning_preds_array.push(winning_team,winning_odd);
 
     }

     return winning_preds_array;
}

export default WinningTeamAndOdd;