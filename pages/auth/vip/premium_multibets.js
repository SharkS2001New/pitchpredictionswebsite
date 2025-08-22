import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from "../checkAuth";
import UserNotSubcribed from '../includes/user-not-subcribed';
import AuthPreloader from '../includes/auth_preLoader';
import fetchMultibetsGames from '../../../components/auth/fetch_games_ppredictions';

const predictionWonOrLost = (tip, scores, goals_home, goals_away) => {
  const homeGoals = parseInt(goals_home, 10) || 0;
  const awayGoals = parseInt(goals_away, 10) || 0;
  const htHomeGoals = parseInt(scores?.halftime?.home || 0, 10);
  const htAwayGoals = parseInt(scores?.halftime?.away || 0, 10);

  switch (tip) {
    case "1":
      return homeGoals > awayGoals ? "Won" : "Lost";
    case "2":
      return awayGoals > homeGoals ? "Won" : "Lost";
    case "X":
      return homeGoals === awayGoals ? "Won" : "Lost";
    case "DC1X":
      return homeGoals >= awayGoals ? "Won" : "Lost";
    case "DC12":
      return homeGoals !== awayGoals ? "Won" : "Lost";
    case "DCX2":
      return awayGoals >= homeGoals ? "Won" : "Lost";
    case "GG":
    case "BTS":
      return homeGoals > 0 && awayGoals > 0 ? "Won" : "Lost";
    case "NOGOAL":
      return homeGoals === 0 || awayGoals === 0 ? "Won" : "Lost";
    case "UN05":
      return homeGoals + awayGoals === 1 ? "Won" : "Lost";
    case "UN15":
      return homeGoals + awayGoals < 2 ? "Won" : "Lost";
    case "UN25":
      return homeGoals + awayGoals < 3 ? "Won" : "Lost";
    case "UN35":
      return homeGoals + awayGoals < 4 ? "Won" : "Lost";
    case "OV05":
      return homeGoals + awayGoals >= 1 ? "Won" : "Lost";
    case "OV15":
      return homeGoals + awayGoals >= 2 ? "Won" : "Lost";
    case "OV25":
      return homeGoals + awayGoals >= 3 ? "Won" : "Lost";
    case "OV35":
      return homeGoals + awayGoals >= 4 ? "Won" : "Lost";
    case "1HT1":
      return htHomeGoals > htAwayGoals ? "Won" : "Lost";
    case "1HTX":
      return htHomeGoals === htAwayGoals ? "Won" : "Lost";
    case "1HT2":
      return htHomeGoals < htAwayGoals ? "Won" : "Lost";
    default:
      console.warn(`Invalid tip value: ${tip}`);
      return "Lost";
  }
};

function VipGames() {
  const [user, setUser] = useState(null);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [yesterdaysMatches, setYesterdaysMatches] = useState([]);
  const [tomorrowMatches, setTomorrowsMatches] = useState([]);

  const [loading, setLoading] = useState(false); // State for preloader

  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      setUser(JSON.parse(cookies.user));
    } else {
      router.push('/auth/login');
    }

    setLoading(true);

    // Helper function to format dates in YYYY-MM-DD
    function formatDate(date) {
      const offset = date.getTimezoneOffset(); 
      date.setMinutes(date.getMinutes() - offset); 
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
      fetchMultibetsGames(formatDate(yesterday)).then(response => setYesterdaysMatches(response.data)),
      fetchMultibetsGames(formatDate(today)).then(response => setTodaysMatches(response.data)),
      fetchMultibetsGames(formatDate(tomorrow)).then(response => setTomorrowsMatches(response.data))
    ])
      .catch(error => console.error('Error fetching games:', error))
      .finally(() => setLoading(false)); // Hide loader after all fetches are complete
  }, []);

  return (
    <div className="container mt-4">
      {user && (
        user.active_plan === "free" ? (
          <UserNotSubcribed />
        ) : (
          <React.Fragment>
            <nav aria-label="breadcrumb" className="mb-1 border-bottom">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
                <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Tips Store</a></li>
                <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
              </ol>
              <div className="col-md-12 align-self-center p-static order-2 text-center">
                <h3 className="font-weight-bold text-dark">3.5 - 5.0+ Odds</h3>
              </div>
            </nav>
            <div className="container">
            {/* Go Back Button */}
            {router.pathname !== "/auth/vip" && (
              <div className="row align-items-center justify-content-between mb-3">
                <div className="col-auto">
                    <p className="mb-0 fw-bold" style={{color: "blue", fontSize: "small"}}>Click "Go Back" to access other tips.</p>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-success btn-sm" onClick={() => router.back()}>
                        &larr; Go Back
                    </button>
                </div>
              </div>          
            )}
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
                            </tr>
                          </thead>
                          <tbody>
                            {yesterdaysMatches.length > 0 ? (
                              yesterdaysMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.fixture_date1.split(' ')[1].slice(0, 5)}</td>
                                  <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                  <td>{match.tip}</td>
                                  <td>
                                    {match.goals_home != null && match.goals_away != null
                                    ? (predictionWonOrLost(match.tip, match.scores, match.goals_home, match.goals_away) === "Won"
                                        ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                        : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                                    : "-"}
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
                            </tr>
                          </thead>
                          <tbody>
                            {todaysMatches.length > 0 ? (
                              todaysMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.fixture_date1.split(' ')[1].slice(0, 5)}</td>
                                  <td style={{textAlign: "left"}}>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team_name}</td>
                                  <td>{match.tip}</td>
                                  <td>
                                    {match.goals_home != null && match.goals_away != null
                                    ? (predictionWonOrLost(match.tip, match.scores, match.goals_home, match.goals_away) === "Won"
                                        ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                        : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                                    : "-"}
                                  </td>   
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="5" style={{ fontWeight: "bold" }}>Predictions Not Available</td></tr>
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
                              <th>Matches</th>
                              <th>Tip</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tomorrowMatches.length > 0 ? (
                              tomorrowMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.fixture_date1.split(' ')[1].slice(0, 5)}</td>
                                  <td>{match.home_team_name} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team}</td>
                                  <td>{match.tip}</td>
                                  <td>
                                    {match.goals_home != null && match.goals_away != null
                                    ? (predictionWonOrLost(match.tip, match.scores, match.goals_home, match.goals_away) === "Won"
                                        ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                        : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                                    : "-"}
                                  </td>   
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="5" style={{ fontWeight: "bold" }}>Predictions not available</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>	
          </React.Fragment>
        )
      )}
    </div>
  );
}

export default withAuth(VipGames);
