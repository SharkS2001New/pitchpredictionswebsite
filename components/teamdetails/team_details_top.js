import React from 'react';
import PreLoader from '../includes/loader';
import MatchOutcomesHome from '../matchdetails/match_outcomes_home_drawings';

function TeamDetailsTop(props) {    
    let team_details = props.props;

    if (team_details != undefined) {
        return (
            <React.Fragment>
                <div className="col-sm-12 text-left text-nowrap pb-1 pt-1 mb-3">
                    <div className='container'>
                        <img 
                            src={team_details.downloaded_country_flag ? team_details.downloaded_country_flag : team_details.game_details.downloaded_league_logo} 
                            className="img-fluid league-logo" 
                            alt={team_details.country_name + "-football-predictions"} 
                            loading="lazy" 
                        />&nbsp;

                        <span style={{ fontWeight: "bold", whiteSpace: "break-spaces" }} className="fixturesTextSize">
                            <a 
                                href={encodeURI("/country/football-predictions-for-" + team_details.country_name.toLowerCase()) + "/fixtures"} 
                                className="ml-2 linkTxt"
                            >
                                {team_details.country_name.toUpperCase()}
                            </a>
                            &nbsp;:&nbsp;
                            <a 
                                href={encodeURI("/league/football-predictions-for-" + team_details.country_name.toLowerCase() + "/" + team_details.league_name.replace(/\s+/g, '-').toLowerCase() + "-" + team_details.league_id + "/fixtures")} 
                                className="ml-2 linkTxt"
                            >
                                {team_details.league_name.toUpperCase()}
                            </a>
                        </span>
                    </div>
                </div>
                <div className="row fixturesTextSize">
                    <div className="col-md-6 col-sm-12" style={{ textAlign: "left" }}>
                        <div className="row container">
                            <div className="col-4">
                                <img 
                                    className="teamimage_class" 
                                    src={props.team_id === team_details.home_team_id ? team_details.home_team_logo : team_details.away_team_logo} 
                                    alt={team_details.away_team_name + "-predictions-and-fixtures"}
                                />
                            </div>
                            <div className="col-8 fixturesTextSize">
                                <h6 style={{ fontWeight: "bold", whiteSpace: "pre-wrap" }}>
                                    {props.team_id === team_details.home_team_id ? team_details.home_team_name : team_details.away_team_name}
                                </h6>
                                <br />
                                
                                <MatchOutcomesHome props={props.last_6_matches} home_team_id={props.team_id} />
                                <br />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-0"></div>
                </div>
                <br />
                {/* Add a break point spacing if the device size if mobile */}
            </React.Fragment>
        );
    } else {
        return <PreLoader />;
    }
}

export default TeamDetailsTop;