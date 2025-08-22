import React, { useEffect, useState } from 'react';
import withAuth from "../checkAuth";
import AuthPreloader from '../../auth/includes/auth_preLoader';
import DateTimeToUsersTimezone from '../../../components/functions/DatetimeToUsersTimezone';
import fetchFreePlanGames2 from '../../../components/auth/free_plans_pages_pitchpredictions';

function computeFixtureAverage(goalsForHome, goalsAgainstHome, goalsForAway, goalsAgainstAway, totalGamesPlayedByHome, totalGamesPlayedByAway) {
    if ((goalsForHome || goalsForAway) && (totalGamesPlayedByHome || totalGamesPlayedByAway) !== null) {
        // Calculate total average goals
        const totalAverageGoals = parseInt(goalsForHome) + parseInt(goalsAgainstHome) + parseInt(goalsForAway) + parseInt(goalsAgainstAway);
        const totalPlayed = parseInt(totalGamesPlayedByHome) + parseInt(totalGamesPlayedByAway);

        // Calculate average goals
        const averageGoals = parseFloat(totalAverageGoals) / parseFloat(totalPlayed);
        return averageGoals > 0 ? averageGoals.toFixed(2) : "-";
    }
    return "-";
}

function computeFixtureTip(fixture) {
    const fixturesAverage = computeFixtureAverage(
        fixture?.teams_perfomance_home_for ?? 0,
        fixture?.teams_perfomance_home_aganist ?? 0,
        fixture?.teams_perfomance_away_for ?? 0,
        fixture?.teams_perfomance_away_aganist ?? 0,
        fixture?.teams_games_played_home ?? 0,
        fixture?.teams_games_played_away ?? 0
    );

    if (fixture?.tip && fixture.tip.trim() !== "") {
        return fixture.tip;
    }

    if ((fixturesAverage < 2.0 || fixturesAverage > 3.0) && fixturesAverage !== "-") {
        return parseFloat(fixturesAverage) > 2.5 ? "Over2.5" : "Under2.5";
    }

    const percentPredHome = parseFloat((fixture?.percent_pred_home ?? "0").replace("%", ""));
    const percentPredDraw = parseFloat((fixture?.percent_pred_draw ?? "0").replace("%", ""));
    const percentPredAway = parseFloat((fixture?.percent_pred_away ?? "0").replace("%", ""));

    if (Math.max(percentPredHome, percentPredDraw, percentPredAway) > 45) {
        if (percentPredHome > percentPredDraw && percentPredHome > percentPredAway) {
            return "1";
        }
        if (percentPredDraw > percentPredHome && percentPredDraw > percentPredAway) {
            return "X";
        }
        return "2";
    }

    return "1X";
}

// Helper to compute match result based on prediction type
const getMatchResult = (match) => {
    if (match.goals_home == null || match.goals_away == null) return null;
  
    const predictionType = computeFixtureTip(match);
  
    // Compare predicted result with actual result
    if (predictionType === "Over2.5" || predictionType === "Under2.5") {
      // For over/under predictions, check goals count
      const totalGoals = parseInt(match.goals_home) + parseInt(match.goals_away);
      if (predictionType === "Over2.5") {
        return totalGoals > 2.5 ? "Won" : "Lost";
      } else {
        return totalGoals < 2.5 ? "Won" : "Lost";
      }
    }
  
    if (predictionType === "1") {
      return parseInt(match.goals_home) > parseInt(match.goals_away) ? "Won" : "Lost";
    }
    if (predictionType === "X") {
      return parseInt(match.goals_home) === parseInt(match.goals_away) ? "Won" : "Lost";
    }
    if (predictionType === "2") {
      return parseInt(match.goals_away) > parseInt(match.goals_home) ? "Won" : "Lost";
    }
    if (predictionType === "1X") {
      return parseInt(match.goals_home) >= parseInt(match.goals_away) ? "Won" : "Lost";
    }
    if (predictionType === "X2") {
      return parseInt(match.goals_away) >= parseInt(match.goals_home) ? "Won" : "Lost";
    }
    if (predictionType === "12") {
      return parseInt(match.goals_home) !== parseInt(match.goals_away) ? "Won" : "Lost";
    }
  
    return "No Prediction";
};

function AccumulatorTips() {
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [yesterdaysMatches, setYesterdaysMatches] = useState([]);
  const [tomorrowMatches, setTomorrowsMatches] = useState([]);

  const [loading, setLoading] = useState(false); // State for preloader

  useEffect(() => {
    // Helper function to format dates in YYYY-MM-DD
    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }

    // Get today's date
    const today = new Date();

    // Compute yesterday and tomorrow
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Fetch data using Promise.all for better control
    Promise.all([
      fetchFreePlanGames2("fetch_tipster_preds_match_tips",formatDate(yesterday), 12).then(response => setYesterdaysMatches(response.data)),
      fetchFreePlanGames2("fetch_tipster_preds_match_tips",formatDate(today), 12).then(response => setTodaysMatches(response.data)),
      fetchFreePlanGames2("fetch_tipster_preds_match_tips", formatDate(tomorrow), 12).then(response => setTomorrowsMatches(response.data))
    ])
      .catch(error => console.error('Error fetching games:', error))
      .finally(() => setLoading(false)); // Hide loader after all fetches are complete
  }, []);

  return (
    <div className="container mt-4">
        <nav aria-label="breadcrumb" className="mb-3 border-bottom">
            <ol className="breadcrumb justify-content-center">
            <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
            <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Premium Tips Store</a></li>
            <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
            </ol>
            <div className="col-md-12 align-self-center p-static order-2 text-center">
            <h3 className="font-weight-bold text-dark">Accumulator Tips</h3>
            </div>
        </nav>
        <div className="container">
            {loading ? (
            <div className="row justify-content-center" style={{height: "300px"}}>
                <AuthPreloader /> 
            </div>
            ) : (
            <div id="tabs" className="project-tab">
                <div className="row justify-content-center pb-3 mb-4">
                <nav>
                    <div className="nav nav-tabs nav-justified" id="nav-tab" role="tablist">
                    <button className="nav-link" id="nav-yesterday-tab" data-bs-toggle="tab" data-bs-target="#nav-yesterday" type="button" role="tab" aria-controls="nav-yesterday" aria-selected="false">Yesterday</button>
                    <button className="nav-link active" id="nav-today-tab" data-bs-toggle="tab" data-bs-target="#nav-today" type="button" role="tab" aria-controls="nav-today" aria-selected="true">Today</button>
                    <button className="nav-link" id="nav-tomorrow-tab" data-bs-toggle="tab" data-bs-target="#nav-tomorrow" type="button" role="tab" aria-controls="nav-tomorrow" aria-selected="false">Tomorrow</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    {/* Yesterday's Matches */}
                    <div className="tab-pane fade" id="nav-yesterday" role="tabpanel" aria-labelledby="nav-yesterday-tab" tabIndex="0">
                    <table className="table  table-hover match-tbs mt-3 text-center">
                        <thead>
                        <tr>
                            <th>Time</th>
                            <th style={{textAlign: "left"}}>Matches</th>
                            <th>Tip</th>
                            <th>Score</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {yesterdaysMatches.length > 0 ? (
                            yesterdaysMatches.map((match, index) => (                                
                            <tr key={index}>
                                <td>{DateTimeToUsersTimezone(match.date).split(' ')[1]}</td>
                                <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                <td>
                                    {computeFixtureTip(match)}
                                </td>
                                <td>{match.goals_home} - {match.goals_away}</td>   
                                <td>
                                  {match.goals_home != null && match.goals_away != null
                                  ? (getMatchResult(match) === "Won"
                                      ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                      : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                                  : null}
                                </td>                             
                            </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ fontWeight: "bold" }}>Predictions Not Available</td></tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    {/* Today's Matches */}
                    <div className="tab-pane fade show active" id="nav-today" role="tabpanel" aria-labelledby="nav-today-tab" tabIndex="0">
                    <table className="table match-tbs mt-3 text-center">
                        <thead>
                        <tr>
                            <th>Time</th>
                            <th style={{textAlign: "left"}}>Matches</th>
                            <th>Tip</th>
                            <th>Score</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {todaysMatches.length > 0 ? (
                            todaysMatches.map((match, index) => (
                            <tr key={index}>
                                <td>{DateTimeToUsersTimezone(match.date).split(' ')[1]}</td>
                                <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                <td>
                                    {computeFixtureTip(match)}
                                </td>
                                <td>{match.goals_home} - {match.goals_away}</td>
                                <td>
                                  {match.goals_home != null && match.goals_away != null
                                  ? (getMatchResult(match) === "Won"
                                      ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                      : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                                  : null}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ fontWeight: "bold" }}>
                                    {todaysMatches.length > 0 ? 
                                    <div className="row justify-content-center">
                                        <AuthPreloader /> 
                                    </div>
                                    : <div className="row justify-content-center">
                                        <span className="text-center">Predictions not available, check again later</span> 
                                    </div>
                                    }
                              </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    {/* Tomorrow's Matches */}
                    <div className="tab-pane fade" id="nav-tomorrow" role="tabpanel" aria-labelledby="nav-tomorrow-tab" tabIndex="0">
                    <table className="table  table-hover match-tbs mt-3 text-center">
                        <thead>
                        <tr>
                            <th>Time</th>
                            <th style={{textAlign: "left"}}>Matches</th>
                            <th>Tip</th>
                            <th>Score</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {tomorrowMatches.length > 0 ? (
                            tomorrowMatches.map((match, index) => (
                            <tr key={index}>
                                <td>{DateTimeToUsersTimezone(match.date).split(' ')[1]}</td>
                                <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                <td>
                                    {computeFixtureTip(match)}
                                </td>
                                <td>{match.goals_home != null && match.goals_away != null ? `${match.goals_home} - ${match.goals_away}` : "-"}</td>
                            </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ fontWeight: "bold" }}>Predictions Not Available</td></tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>	
    </div>
  );
}

export default withAuth(AccumulatorTips);
