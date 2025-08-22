import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router'
import WinningTeamAndOdd from '../functions/determine_winning_team_and_odd';
import ProbabilityResults from '../functions/determine_probability_results';
import DetermineLiveScores from '../functions/determine_live_scores';
import ComputeFixtureAverage from '../functions/ComputefixtureAverage';
import FixturesTableDisplay from '../shared/fixtures_table_display';
import LeaguesPageRender from '../shared/renders/leagues-render';
import DoubleChanceWinningTeamAndOdd from '../functions/double_chance_winning_team_and_odd';
import DoubleChanceProbabilityResults from '../functions/double_chance_probability_results';
import UnderOverWinningTeamAndOdd from '../functions/under_over_winning_team_and_odd';
import UnderOverProbabilityResults from '../functions/under_over_probability_results';
import BothTeamsToScore from '../functions/BothTeamsToScore';
import HalfTimeWinningTeamAndOdd from '../functions/halftime_winning_team_and_odd';
import HalfTimeProbabilityResults from '../functions/halftime_probability_results';
import { Adsense } from "@ctrl/react-adsense";

function TodaysFixturesByLeague(props){
    const router = useRouter(); //fetch page link data
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(()=>{ 
        if(router.isReady){
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);
        } 
    },[router]);

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }
 
    var predictionsList = [];

    for(let i = 0; i <props.todays_matches.length;i++){  
        let winning_team = "";
        let winning_odd = 0;

        let home_odd  = "";
        let draw_odd = "";
        let away_odd = "";

        let ht_home_odd = "";
        let ht_draw_odd = "";
        let ht_away_odd = "";

        let computed_winning_preds = "";
        
        let probability_results = "";

        let ht_computed_winning_preds ="";
        let ht_probability_results = "";
        let ht_winning_team ="";
        let ht_winning_odd ="";

        if(props.todays_matches[i].percent_pred_home != null){
            home_odd  = props.todays_matches[i]["percent_pred_home"].slice(0, -1);
            draw_odd = props.todays_matches[i]["percent_pred_draw"].slice(0, -1);
            away_odd = props.todays_matches[i]["percent_pred_away"].slice(0, -1);
        }

        if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
            if(props.todays_matches[i].hf_percent_pred_home != null){
                ht_home_odd  = props.todays_matches[i]["hf_percent_pred_home"].slice(0, -1);
                ht_draw_odd = props.todays_matches[i]["hf_percent_pred_draw"].slice(0, -1);
                ht_away_odd = props.todays_matches[i]["hf_percent_pred_away"].slice(0, -1);
            }
        }
                
        //Decode halftime data stored as a json in mysql
        var scores_data = JSON.parse(props.todays_matches[i].scores);

        var halftime_data = "";
        var extratime_data = "";
        var penalty_data = "";

        if(props.todays_matches[i].scores != null){
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

        let fixturesAverage = ComputeFixtureAverage(props.todays_matches[i].teams_perfomance_home_for,props.todays_matches[i].teams_perfomance_home_aganist,props.todays_matches[i].teams_perfomance_away_for,props.todays_matches[i].teams_perfomance_away_aganist,props.todays_matches[i].teams_games_played_home,props.todays_matches[i].teams_games_played_away)
     
        if(router.pathname.substring(1).includes("double-chance-predictions")) {
            computed_winning_preds =  DoubleChanceWinningTeamAndOdd(home_odd,draw_odd,away_odd,props.todays_matches[i],router.pathname.substring(1));

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1]; 

            probability_results = DoubleChanceProbabilityResults(props.todays_matches[i],winning_team, router.pathname.substring(1));

        } else if(router.pathname.substring(1).includes("predictions-under-over")) {
            computed_winning_preds =  UnderOverWinningTeamAndOdd(fixturesAverage, isMobile);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = UnderOverProbabilityResults(props.todays_matches[i],winning_team);
            
        } else if(router.pathname.substring(1).includes("predictions-both-to-score")) {

            probability_results = BothTeamsToScore(props.todays_matches[i]);
        
        } else if(router.pathname.substring(1).includes("predictions-halftime-fulltime")) {
            ht_computed_winning_preds =  HalfTimeWinningTeamAndOdd(ht_home_odd,ht_draw_odd,ht_away_odd,props.todays_matches[i]);

            ht_winning_team = ht_computed_winning_preds[0];
            ht_winning_odd = ht_computed_winning_preds[1];

            ht_probability_results = HalfTimeProbabilityResults(props.todays_matches[i], ht_winning_team);

            computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,props.todays_matches[i]);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = ProbabilityResults(props.todays_matches[i],winning_team);
        } else {
            computed_winning_preds =  WinningTeamAndOdd(home_odd,draw_odd,away_odd,props.todays_matches[i]);

            winning_team = computed_winning_preds[0];
            winning_odd = computed_winning_preds[1];

            probability_results = ProbabilityResults(props.todays_matches[i],winning_team);
        }        
        let livescores_results = DetermineLiveScores(props.todays_matches[i],isMobile);

        let livestatus = livescores_results[0];
        let livescores = livescores_results[1];

        var sharedTabledetailsArray = [];

        sharedTabledetailsArray.push(
            {
                game_details:props.todays_matches[i],
                home_odd : home_odd,
                draw_odd: draw_odd,
                away_odd: away_odd,
                probability_results : probability_results,
                winning_odd : winning_odd,
                winning_team:winning_team,
                livestatus : livestatus,
                livescores : livescores,
                halftime_data : halftime_data,
                extratime_data : extratime_data,
                penalty_data:penalty_data,
                average : fixturesAverage,
                 // If it's halftime/fulltime page
                 ...(router.pathname.substring(1).includes("predictions-halftime-fulltime") && {
                    ht_home_odd: ht_home_odd,
                    ht_draw_odd: ht_draw_odd,
                    ht_away_odd: ht_away_odd,
                    ht_probability_results: ht_probability_results,
                    ht_winning_odd: ht_winning_odd,
                    ht_winning_team: ht_winning_team,
                }),
            }
        )
            
        //Form the array of Fixtures Table by league
        predictionsList.push(
            <FixturesTableDisplay  props={sharedTabledetailsArray} key={i} isMobile={isMobile}/>
        )
    } 

    if(predictionsList.length > 0){
        return(
            <React.Fragment>
                <div className="sites-card mb-2">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Todays Fixtures -  {props.country_name} , {props.league_name}</h2>
                        </div>
                    </div>   
                    {/**Display fixtures for todays matches for selected league */}
                    <LeaguesPageRender url_name={router.pathname.substring(1)} renderPredictions={predictionsList} isMobile={isMobile} />
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="7624930534"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                </div> 
            </React.Fragment>
        ) 
    }else {
        return <></>
    }
       
    
}

export default TodaysFixturesByLeague;