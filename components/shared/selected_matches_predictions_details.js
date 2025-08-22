import DetermineLiveScores from "../functions/determine_live_scores";
import WinningTeamAndOdd from "../functions/determine_winning_team_and_odd";
import ProbabilityResults from "../functions/determine_probability_results";
import FixturesTableDisplay from "./fixtures_table_display";
import ComputeFixtureAverage from "../functions/ComputefixtureAverage";
import { useRouter } from 'next/router';
import { useEffect,useState} from "react";

function SelectedMacthesPredDetails(props){   
    const [isMobile, setIsMobile] = useState(false); 
    const router = useRouter(); //access page link

    var predictionsList = [];

    let game_details = props.props;
    
    useEffect(()=>{
        if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);
        }
    })

    for(let i = 0; i <game_details.length;i++){  
        let winning_team = "";
        let winning_odd = 0;

        let home_odd  = "";
        let draw_odd = "";
        let away_odd = "";

        if(game_details[i].percent_pred_home != null){

            home_odd  = game_details[i].percent_pred_home.slice(0, -1);
            draw_odd = game_details[i].percent_pred_draw.slice(0, -1);
            away_odd = game_details[i].percent_pred_away.slice(0, -1);  
        }
                
        //Decode halftime data stored as a json in mysql
        var scores_data = JSON.parse(game_details[i].scores);

        var halftime_data = "";
        var extratime_data = "";
        var penalty_data = "";

        if(game_details[i].scores != null){
            if(scores_data.halftime.home != null){
                halftime_data = '('+ scores_data.halftime.home + ' - ' + scores_data.halftime.away +')';
            }                

            if(scores_data.extratime.home != null){
                extratime_data = scores_data.extratime.home + ' - ' + scores_data.extratime.away;
            }

            if(scores_data.penalty.home != null){
                penalty_data = scores_data.penalty.home + ' - ' + scores_data.penalty.away;
            }
        }

        let computed_winning_preds = WinningTeamAndOdd(home_odd,draw_odd,away_odd,game_details[i]);

        winning_team = computed_winning_preds[0];
        winning_odd = computed_winning_preds[1];
    
        let probability_results = ProbabilityResults(game_details[i],winning_team);

        let livescores_results = DetermineLiveScores(game_details[i],isMobile);

        let livestatus = livescores_results[0];
        let livescores = livescores_results[1];

        let fixturesAverage = ComputeFixtureAverage(game_details[i].teams_perfomance_home_for,game_details[i].teams_perfomance_home_aganist,game_details[i].teams_perfomance_away_for,game_details[i].teams_perfomance_away_aganist,game_details[i].teams_games_played_home,game_details[i].teams_games_played_away);

        var sharedTabledetailsArray = [];

        sharedTabledetailsArray.push(
            {
                game_details:game_details[i],
                home_odd : home_odd ,
                draw_odd: draw_odd,
                away_odd: away_odd,
                probability_results : probability_results,
                winning_odd : winning_odd,
                winning_team : winning_team,
                livestatus : livestatus,
                livescores : livescores,
                halftime_data : halftime_data,
                extratime_data : extratime_data,
                penalty_data : penalty_data,
                average : fixturesAverage
            }
        )

        predictionsList.push(
            <FixturesTableDisplay  props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
        )    
      
    }
    
    return predictionsList;

}

export default SelectedMacthesPredDetails;