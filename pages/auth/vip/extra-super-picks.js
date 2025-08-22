import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from "../checkAuth";
import UserNotSubcribed from '../includes/user-not-subcribed';
import fetchGames from '../../../components/auth/fetch_games';
import AuthPreloader from '../includes/auth_preLoader';

function ExtraSuperTips() {
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
      fetchGames(formatDate(yesterday), 21).then(response => setYesterdaysMatches(response.data)),
      fetchGames(formatDate(today), 21).then(response => setTodaysMatches(response.data)),
      fetchGames(formatDate(tomorrow), 21).then(response => setTomorrowsMatches(response.data))
    ])
      .catch(error => console.error('Error fetching games:', error))
      .finally(() => setLoading(false)); // Hide loader after all fetches are complete
  }, []);

  return (
    <div className="container mt-4">
      {user && (
        user.vip_active === 0 ? (
          <UserNotSubcribed />
        ) : (user.vip_active === 1) && (
          <React.Fragment>
            <nav aria-label="breadcrumb" className="mb-5 border-bottom">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
                <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Tips Store</a></li>
                <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
              </ol>
              <div className="col-md-12 align-self-center p-static order-2 text-center">
                <h3 className="font-weight-bold text-dark">Extra Picks (1st Set)</h3>
              </div>
            </nav>
            <div className="container">
              <div className="overflow-hidden mb-3">
                <h2 className="font-weight-bold text-color-dark line-height-1 mb-0 appear-animation text-center" data-appear-animation="maskUp" data-appear-animation-delay="250">Extra Picks (1st Set) Predictions</h2>
              </div>
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
                              <th>League</th>
                              <th>Matches</th>
                              <th>Tip</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yesterdaysMatches.length > 0 ? (
                              yesterdaysMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.match_time}</td>
                                  <td>{match.league}</td>
                                  <td>{match.home_team} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team}</td>
                                  <td dangerouslySetInnerHTML={{ __html: match.prediction }}></td>
                                  <td>{match.result}</td>
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
                              <th>League</th>
                              <th>Matches</th>
                              <th>Tip</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {todaysMatches.length > 0 ? (
                              todaysMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.match_time}</td>
                                  <td>{match.league}</td>
                                  <td>{match.home_team} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team}</td>
                                  <td dangerouslySetInnerHTML={{ __html: match.prediction }}></td>
                                  <td>{match.result}</td>
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
                              <th>League</th>
                              <th>Matches</th>
                              <th>Tip</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tomorrowMatches.length > 0 ? (
                              tomorrowMatches.map((match, index) => (
                                <tr key={index}>
                                  <td>{match.match_time}</td>
                                  <td>{match.league}</td>
                                  <td>{match.home_team} <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> {match.away_team}</td>
                                  <td dangerouslySetInnerHTML={{ __html: match.prediction }}></td>
                                  <td>{match.result}</td>
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
          </React.Fragment>
        )
      )}
    </div>
  );
}

export default withAuth(ExtraSuperTips);
