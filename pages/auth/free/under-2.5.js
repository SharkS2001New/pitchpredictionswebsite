import React, { useEffect, useState } from 'react';
import withAuth from "../checkAuth";
import AuthPreloader from '../../auth/includes/auth_preLoader';
import fetchFreePlanGames from '../../../components/auth/free_plans_pages';
import DateTimeToUsersTimezone from '../../../components/functions/DatetimeToUsersTimezone';

function Under25() {
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
      fetchFreePlanGames("fetch_auth_under25_fixtures",formatDate(yesterday), 12).then(response => setYesterdaysMatches(response.data)),
      fetchFreePlanGames("fetch_auth_under25_fixtures",formatDate(today), 12).then(response => setTodaysMatches(response.data)),
      fetchFreePlanGames("fetch_auth_under25_fixtures", formatDate(tomorrow), 12).then(response => setTomorrowsMatches(response.data))
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
            <h3 className="font-weight-bold text-dark">Under 2.5 Goals Predictions</h3>
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
                                <td>{(match.average_goals < 2.5 ? "Under2.5" : "Over2.5")}</td>
                                <td>{match.goals_home} - {match.goals_away}</td>
                                <td>
                                {match.goals_home != null && match.goals_away != null
                                    ? match.average_goals < 2.5 && (parseInt(match.goals_home) + parseInt(match.goals_away)) < 3
                                    ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                    : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>
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
                                <td>{(match.average_goals < 2.5 ? "Under2.5" : "Over2.5")}</td>
                                <td>{match.goals_home} - {match.goals_away}</td>
                                <td>
                                {match.goals_home != null && match.goals_away != null
                                    ? match.average_goals < 2.5 && (parseInt(match.goals_home) + parseInt(match.goals_away)) < 3
                                    ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                    : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>
                                    : null}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                               <td colSpan="5" style={{ fontWeight: "bold" }}>
                                    <div className="row justify-content-center" style={{height: "50px"}}>
                                        <AuthPreloader /> 
                                    </div>
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
                        </tr>
                        </thead>
                        <tbody>
                        {tomorrowMatches.length > 0 ? (
                            tomorrowMatches.map((match, index) => (
                            <tr key={index}>
                                <td>{DateTimeToUsersTimezone(match.date).split(' ')[1]}</td>
                                <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                <td>{(match.average_goals < 2.5 ? "Under2.5" : "Over2.5")}</td>
                                <td>{match.goals_home} - {match.goals_away}</td>
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

export default withAuth(Under25);
