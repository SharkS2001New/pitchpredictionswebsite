import React from 'react';
import MatchOutcomesHome from './match_outcomes_home_drawings';
import MatchOutcomesAway from './match_outcomes_away_drawings';
import {
  formatFixtureDateTime,
  formatFixtureTime,
  resolveFixtureDateTime,
} from '../functions/DatetimeToUsersTimezone';
import DetermineLiveScores from '../functions/determine_live_scores';

function MatchDetailsTop(props) {    
    let game_details = props.props;
    const fixture = game_details[0];

    // Safely extract data from new API structure
    const homeTeam = fixture.home_team || {};
    const awayTeam = fixture.away_team || {};
    const match = fixture.match || {};
    const score = fixture.score || {};
    const predictions = fixture.predictions || {};
    const odds = fixture.odds || {};
    const league = fixture.league || {};

    // Get prediction probabilities directly from API
    const prediction1x2 = predictions["1x2"] || {};
    const homeProb = prediction1x2.home?.toString() || "-";
    const drawProb = prediction1x2.draw?.toString() || "-";
    const awayProb = prediction1x2.away?.toString() || "-";

    // Get double chance prediction
    const doubleChance = predictions.double_chance || {};
    const dcWinningTeam = doubleChance.type || "-";
    const dcProbability = doubleChance.probability ? `${doubleChance.probability}%` : "-";

    // Get BTTS prediction
    const btts = predictions.both_teams_to_score || {};
    const bttsPrediction = btts.prediction ? btts.prediction.toUpperCase() : "-";

    // Determine winning team for 1x2 (highest probability)
    const getWinningTeam = () => {
        const home = parseInt(homeProb) || 0;
        const draw = parseInt(drawProb) || 0;
        const away = parseInt(awayProb) || 0;
        if (home > draw && home > away) return "1";
        if (draw > home && draw > away) return "X";
        if (away > home && away > draw) return "2";
        return "-";
    };
    
    const winningTeam = getWinningTeam();
    const winningProbability = winningTeam === "1" ? homeProb : winningTeam === "X" ? drawProb : winningTeam === "2" ? awayProb : "-";

    // Format probability results display
    const probabilityResults = (
        <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
            {winningTeam}
        </span>
    );

    const dcProbabilityResults = (
        <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
            {dcWinningTeam}
        </span>
    );

    const bothTeamToScore = (
        <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
            {bttsPrediction}
        </span>
    );

    // Get live scores status
    let livescores_results = DetermineLiveScores(fixture);
    let livescores = livescores_results?.[1] || "";

    // Extract scores data from new structure
    const halftimeData = score.half_time;
    const halftime_data = (halftimeData?.home !== null && halftimeData?.home !== undefined && 
                           halftimeData?.away !== null && halftimeData?.away !== undefined)
        ? `(${halftimeData.home} - ${halftimeData.away})` 
        : "";
    
    const extratimeData = score.extra_time;
    const extratime_data = (extratimeData?.home !== null && extratimeData?.home !== undefined && 
                             extratimeData?.away !== null && extratimeData?.away !== undefined)
        ? `${extratimeData.home} - ${extratimeData.away}`
        : "";
    
    const penaltyData = score.penalties;
    const penalty_data = (penaltyData?.home !== null && penaltyData?.home !== undefined && 
                          penaltyData?.away !== null && penaltyData?.away !== undefined)
        ? `${penaltyData.home} - ${penaltyData.away}`
        : "";

    const matchStatus = match.status || "";
    const statusLong = match.status_long || "";
    const matchDatetime = resolveFixtureDateTime(fixture);
    const venue = match.venue || "";

    return (
        <React.Fragment>
            <div className="mb-2"> 
                <div className="col-sm-12 text-left text-nowrap">
                    <div className='container'>
                        <img 
                            src={league.country_logo || fixture.downloaded_country_flag} 
                            className="img-fluid league-logo" 
                            alt={league.country + "-football-predictions"} 
                            loading="lazy" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />&nbsp;
                            
                        <span style={{fontWeight:"bold", whiteSpace:"break-spaces"}} className="fixturesTextSize">
                            <a href={encodeURI("/country/football-predictions-for-" + (league.country || "").toLowerCase()) + "/fixtures"} className="ml-2 aTxt">
                                {(league.country || "").toUpperCase()}
                            </a>
                            &nbsp;:&nbsp;
                            <a href={encodeURI("/league/football-predictions-for-" + (league.country || "").toLowerCase() + "/" + (league.name || "").replace(/\s+/g, '-').toLowerCase() + "-" + league.id + "/fixtures")} className="ml-2 aTxt">
                                {(league.name || "").toUpperCase()}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="row mb-2">
                <div className="col-3"></div>
                <div className="col-6 text-center">
                    <span className="text-center matchdetailsTextSize" style={{fontFamily: "Arial", fontWeight: "bold"}}>
                        {formatFixtureDateTime(matchDatetime)}
                    </span>
                </div>  
                <div className="col-3"></div>          
            </div>
            
            <div className="row">
                <div className="col-4 text-center">
                    <span className="matchdetailsTextSize mb-2" style={{fontWeight:"bold", whiteSpace:"nowrap"}}>
                        <a href={encodeURI("/team/" + (homeTeam.name || "").toLowerCase().replace(/\s+/g, '-') + "-" + homeTeam.id) + "/results"} className="ml-2 aTxt">
                            {homeTeam.name}
                        </a>
                    </span>
                    <div>
                        <a href={encodeURI("/team/" + (homeTeam.name || "").toLowerCase().replace(/\s+/g, '-') + "-" + homeTeam.id) + "/results"} className="ml-2 aTxt">
                            <img className="image_class" src={homeTeam.logo} alt={homeTeam.name + "-predictions-and-fixtures"} onError={(e) => { e.target.src = '/placeholder.png'; }} />
                        </a>
                    </div>
                </div>
                
                <div className="col-4 text-center">
                    <span style={{fontWeight:"bold", marginBottom: "10px"}}>
                        {probabilityResults}&nbsp;|&nbsp;{dcProbabilityResults}&nbsp;|&nbsp;{bothTeamToScore}
                    </span>
                    <br/>
                    <span style={{fontWeight:"bold"}}>
                        {winningProbability !== "-" ? winningProbability + "%" : " - "}
                    </span>
                    
                    <span style={{ fontWeight: "bold" }}>
                        {matchStatus === "AET" && extratime_data ? <><br />{extratime_data}</> : matchStatus === "PEN" && penalty_data ? <><br />{penalty_data}</> : ""}
                    </span>
                    <br/>
                    {livescores}
                    <br/>
                    <br className="hide-on-mobile" />
                    <span className="fixturesTextSize" style={{color:"#B11111", fontWeight:"bold"}}>
                        {matchStatus === "PEN" || matchStatus === "P" ? "AFTER PENALTIES" : 
                         matchStatus === "AET" ? "AFTER EXTRA TIME" : 
                         matchStatus === "NS" ? formatFixtureTime(matchDatetime) :
                         statusLong}
                    </span>
                    <br/>
                </div>
                
                <div className="col-4 text-center">
                    <span className="matchdetailsTextSize mb-2" style={{fontWeight:"bold", whiteSpace:"pre-wrap"}}>
                        <a href={encodeURI("/team/" + (awayTeam.name || "").toLowerCase().replace(/\s+/g, '-') + "-" + awayTeam.id) + "/results"} className="ml-2 aTxt">
                            {awayTeam.name}
                        </a>
                    </span>
                    <div>
                        <a href={encodeURI("/team/" + (awayTeam.name || "").toLowerCase().replace(/\s+/g, '-') + "-" + awayTeam.id) + "/results"} className="ml-2 aTxt">
                            <img className="image_class" src={awayTeam.logo} alt={awayTeam.name + "-predictions-and-fixtures"} onError={(e) => { e.target.src = '/placeholder.png'; }} />
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
                    <span style={{fontWeight:"bold", whiteSpace:"break-spaces"}}>Venue: {venue || "TBD"}</span>
                    <br/>
                </div>
            </div>
            <br/>
        </React.Fragment>
    );
}

export default MatchDetailsTop;