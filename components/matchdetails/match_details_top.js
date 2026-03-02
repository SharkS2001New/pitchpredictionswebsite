import React from 'react';
import MatchOutcomesHome from './match_outcomes_home_drawings';
import MatchOutcomesAway from './match_outcomes_away_drawings'; 
import WinningTeamAndOdd from '../functions/determine_winning_team_and_odd';
import ProbabilityResults from '../functions/determine_probability_results';
import DateTimeToUsersTimezone from '../functions/DatetimeToUsersTimezone';
import DetermineLiveScores from '../functions/determine_live_scores';
import DoubleChanceWinningTeamAndOdd from '../functions/double_chance_winning_team_and_odd';
import DoubleChanceProbabilityResults from '../functions/double_chance_probability_results';
import BothTeamsToScore from '../functions/BothTeamsToScore';

function MatchDetailsTop(props) {    
    let game_details = props.props;

    let home_odd  = "";
    let draw_odd =  "";
    let away_odd = "";

    if(game_details[0].percent_pred_home != null && game_details[0].percent_pred_draw !=null && game_details[0].percent_pred_away  != null)
    {
        home_odd = game_details[0].percent_pred_home.slice(0, -1);
        draw_odd = game_details[0].percent_pred_draw.slice(0, -1);
        away_odd = game_details[0].percent_pred_away.slice(0, -1);  
    }

    let computed_winning_preds = WinningTeamAndOdd(home_odd, draw_odd, away_odd, game_details[0]);

    let winning_team = computed_winning_preds[0];

    let probability_results = ProbabilityResults(game_details[0], winning_team);

    let dc_computed_winning_preds = DoubleChanceWinningTeamAndOdd(home_odd, draw_odd, away_odd, game_details[0], "");
    let dc_winning_team = dc_computed_winning_preds[0];

    let dc_probability_results = DoubleChanceProbabilityResults(game_details[0], dc_winning_team, "");

    let both_team_to_score  = BothTeamsToScore(game_details[0]);

    // isMobile parameter removed - now handled by CSS in DetermineLiveScores
    let livescores_results = DetermineLiveScores(game_details[0]);

    //Decode halftime data stored as a json in mysql
    var scores_data = JSON.parse(game_details[0].scores);
    var halftime_data = "";
    var extratime_data = "";
    var penalty_data = "";

    if(game_details[0].scores != null){
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
    
    return (
        <React.Fragment>
            <div className="mb-2"> 
                <div className="col-sm-12 text-left text-nowrap">
                    <div className='container'>
                        <img 
                            src={game_details[0].downloaded_country_flag ? game_details[0].downloaded_country_flag : game_details[0].game_details.downloaded_league_logo} 
                            className="img-fluid league-logo" 
                            alt={game_details[0].country_name + "-football-predictions"} 
                            loading="lazy" 
                        />&nbsp;
                            
                        <span style={{fontWeight:"bold", whiteSpace:"break-spaces"}} className="fixturesTextSize">
                            <a href={encodeURI("/country/football-predictions-for-" + game_details[0].country_name.toLowerCase()) + "/fixtures"} className="ml-2 aTxt">
                                {game_details[0].country_name.toUpperCase()}
                            </a>
                            &nbsp;:&nbsp;
                            <a href={encodeURI("/league/football-predictions-for-" + game_details[0].country_name.toLowerCase() + "/" + game_details[0].league_name.replace(/\s+/g, '-').toLowerCase() + "-" + game_details[0].league_id + "/fixtures")} className="ml-2 aTxt">
                                {game_details[0].league_name.toUpperCase()}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="row mb-2">
                <div className="col-3"></div>
                <div className="col-6 text-center">
                    <span className="text-center matchdetailsTextSize" style={{fontFamily: "Arial", fontWeight: "bold"}}>
                        {DateTimeToUsersTimezone(game_details[0].date)}
                    </span>
                </div>  
                <div className="col-3"></div>          
            </div>
            
            <div className="row">
                <div className="col-4 text-center">
                    <span className="matchdetailsTextSize mb-2" style={{fontWeight:"bold", whiteSpace:"nowrap"}}>
                        <a href={encodeURI("/team/" + game_details[0].home_team_name.toLowerCase().replace(/\s+/g, '-') + "-" + game_details[0].home_team_id) + "/results"} className="ml-2 aTxt">
                            {game_details[0].home_team_name}
                        </a>
                    </span>
                    <div>
                        <a href={encodeURI("/team/" + game_details[0].home_team_name.toLowerCase().replace(/\s+/g, '-') + "-" + game_details[0].home_team_id) + "/results"} className="ml-2 aTxt">
                            <img className="image_class" src={game_details[0].home_team_logo} alt={game_details[0].home_team_name + "-predictions-and-fixtures"} />
                        </a>
                    </div>
                </div>
                
                <div className="col-4 text-center">
                    <span style={{fontWeight:"bold", marginBottom: "10px"}}>
                        {probability_results}&nbsp;|&nbsp;{dc_probability_results}&nbsp;|&nbsp;{both_team_to_score}
                    </span>
                    <br/>
                    <span style={{fontWeight:"bold"}}>
                        {game_details[0].percent_pred_home != "" && game_details[0].percent_pred_draw != "" && game_details[0].percent_pred_away != "" ? " - " :
                            winning_team == '1' ? home_odd + "%" : winning_team == 'X' ? draw_odd + "%" : away_odd + "%"
                        }
                    </span>
                    
                    <span style={{ fontWeight: "bold" }}>
                        {game_details[0].status_short === "AET" || game_details[0].status_short ? <><br />{extratime_data}</> : game_details[0].status_short === "PEN" ? <><br />{penalty_data}</> : ""}
                    </span>
                    <br/>
                    {livescores_results[1]}
                    <br/>
                    {/* Removed conditional <br/> based on isMobile - now using CSS */}
                    <br className="hide-on-mobile" />
                    <span className="fixturesTextSize" style={{color:"#B11111", fontWeight:"bold"}}>
                        {game_details[0].status_short === "PEN" || game_details[0].status_short === "P" ? "AFTER PENALTIES" : 
                         game_details[0].status_short === "AET" ? "AFTER EXTRA TIME" : 
                         game_details[0].status_short === "NS" ? DateTimeToUsersTimezone(game_details[0].date).split(' ')[1] :  
                         game_details[0].status_long}
                    </span>
                    <br/>
                </div>
                
                <div className="col-4 text-center">
                    <span className="matchdetailsTextSize mb-2" style={{fontWeight:"bold", whiteSpace:"pre-wrap"}}>
                        <a href={encodeURI("/team/" + game_details[0].away_team_name.toLowerCase().replace(/\s+/g, '-') + "-" + game_details[0].away_team_id) + "/results"} className="ml-2 aTxt">
                            {game_details[0].away_team_name}
                        </a>
                    </span>
                    <div>
                        <a href={encodeURI("/team/" + game_details[0].away_team_name.toLowerCase().replace(/\s+/g, '-') + "-" + game_details[0].away_team_id) + "/results"} className="ml-2 aTxt">
                            <img className="image_class" src={game_details[0].away_team_logo} alt={game_details[0].away_team_name + "-predictions-and-fixtures"} />
                        </a>
                    </div>
                </div> 
            </div>
            
            <div className="row">
                <div className="col-4 text-center fixturesTextSize">
                    <MatchOutcomesHome props={props.home_team_data} home_team_id={props.home_team_id} />
                </div> 
                <div className="col-4"></div>
                <div className="col-4 text-center fixturesTextSize">
                    <MatchOutcomesAway props={props.away_team_data} away_team_id={props.away_team_id} />
                </div>
            </div>
            <br/>
            
            <div className="row">
                <div className="col-12 text-center fixturesTextSize">
                    <span style={{fontWeight:"bold", whiteSpace:"break-spaces"}}>Venue: {game_details[0].venue_name}</span>
                    <br/>
                </div>
            </div>
            <br/>
        </React.Fragment>
    );
}

export default MatchDetailsTop;