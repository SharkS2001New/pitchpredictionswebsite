import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from "../checkAuth";
import AuthPreloader from '../includes/auth_preLoader';
import DateTimeToUsersTimezone from '../../../components/functions/DatetimeToUsersTimezone';
import fetchWeekendGames from '../../../components/auth/weekend_predictions';
import WeekendSpecialDates from '../../../components/functions/weekend_special_dates';

// Helper to compute prediction type
const getPredictionType = (match) => {
  if (!match.average_goals || match.average_goals === "-") return null;

  const avgGoals = parseFloat(match.average_goals);
  const homePercent = parseInt(match.percent_pred_home.replace("%", ""));
  const drawPercent = parseInt(match.percent_pred_draw.replace("%", ""));
  const awayPercent = parseInt(match.percent_pred_away.replace("%", ""));

  if (avgGoals < 2.0 || avgGoals > 3.0) {
    return avgGoals > 2.5 ? "Over2.5" : "Under2.5";
  }

  if (homePercent > 45 || drawPercent > 45 || awayPercent > 45) {
    if (homePercent > drawPercent && homePercent > awayPercent) return "1";
    if (drawPercent > homePercent && drawPercent > awayPercent) return "X";
    return "2";
  }

  if (homePercent > drawPercent && homePercent > awayPercent) return "1X";
  if (drawPercent > homePercent && drawPercent > awayPercent) return "X2";
  return "12";
};

// Helper to compute match result based on prediction type
const getMatchResult = (match) => {
  if (match.goals_home == null || match.goals_away == null) return null;

  const predictionType = getPredictionType(match);

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

function WeekendFootball() {
  const [user, setUser] = useState(null);
  const [weekendMatches, setWeekendMatches] = useState([]);
  const [isMobile, setIsMobile] = useState(false); 

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

    //get weekends date
    const dates = WeekendSpecialDates();

    const today = new Date().getDay(); 
    let startDate, endDate;

    if (today === 5) { // Friday
      startDate = dates[0];
      endDate = dates[2];
    } else if (today === 6) { // Saturday
      startDate = dates[1];
      endDate = dates[2];
    } else if (today === 0) { // Sunday
      startDate = dates[2];
      endDate = dates[2];
    } else {
      startDate = dates[0];
      endDate = dates[2];
    }

    // Fetch data using Promise.all for better control
    Promise.all([
      fetchWeekendGames("fetch_auth_upcoming_matches", startDate, endDate).then(response => setWeekendMatches(response.data)),
    ])
      .catch(error => console.error('Error fetching games:', error))
      .finally(() => setLoading(false)); // Hide loader after all fetches are complete
  }, []);

   useEffect(()=>{  
        if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);            
        }
    },[router])

  return (
    <div className="container mt-4">
        <nav aria-label="breadcrumb" className="mb-3 border-bottom">
            <ol className="breadcrumb justify-content-center">
            <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
            <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Premium Tips Store</a></li>
            <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
            </ol>
            <div className="col-md-12 align-self-center p-static order-2 text-center">
            <h3 className="font-weight-bold text-dark">Weekend Specials</h3>
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
                <div className="tab-content" id="nav-tabContent">
                    {/* Weekend Matches */}
                    <table className="table match-tbs mt-3">
                    <thead>
                        <tr>
                            {isMobile == false &&<th>Date</th>}
                            <th style={{textAlign: "left"}}>Matches</th>
                            <th>Tip</th>
                            <th>Score</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekendMatches.length > 0 ? (
                        weekendMatches.map((match, index) => (
                            <tr key={index}>
                              {isMobile == false && <td>{DateTimeToUsersTimezone(match.date).split(' ')[0]}</td> }
                              <td style={{textAlign: "left"}}>
                                  {match.home_team_name} 
                                  <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> 
                                  {match.away_team_name}
                                  <span style={{fontWeight: "bold"}}>{isMobile == true && <><br/>{DateTimeToUsersTimezone(match.date).split(' ')[0]}</> }</span>
                              </td>
                              <td>
                                  {parseFloat(match.average_goals) < 2.0 || parseFloat(match.average_goals) > 3.0 ? (
                                      parseFloat(match.average_goals) > 2.5 ? (
                                          "Over2.5"
                                      ) : (
                                          "Under2.5"
                                      )
                                  ) : parseInt(match.percent_pred_home.replace('%', '')) > 45 ||
                                  parseInt(match.percent_pred_draw.replace('%', '')) > 45 ||
                                  parseInt(match.percent_pred_away.replace('%', '')) > 45 ? (
                                      parseInt(match.percent_pred_home.replace('%', '')) > parseInt(match.percent_pred_draw.replace('%', '')) &&
                                      parseInt(match.percent_pred_home.replace('%', '')) > parseInt(match.percent_pred_away.replace('%', '')) ? (
                                          1
                                      ) : parseInt(match.percent_pred_draw.replace('%', '')) > parseInt(match.percent_pred_home.replace('%', '')) &&
                                      parseInt(match.percent_pred_draw.replace('%', '')) > parseInt(match.percent_pred_away.replace('%', '')) ? (
                                          "X"
                                      ) : (
                                          2
                                      )
                                  ) : parseInt(match.percent_pred_home.replace('%', '')) > parseInt(match.percent_pred_draw.replace('%', '')) &&
                                  parseInt(match.percent_pred_home.replace('%', '')) > parseInt(match.percent_pred_away.replace('%', '')) ? (
                                      "1X"
                                  ) : parseInt(match.percent_pred_draw.replace('%', '')) > parseInt(match.percent_pred_home.replace('%', '')) &&
                                  parseInt(match.percent_pred_draw.replace('%', '')) > parseInt(match.percent_pred_away.replace('%', '')) ? (
                                      "X2"
                                  ) : (
                                      "12"
                                  )}
                              </td>
                              <td>{match.goals_home != null && match.goals_away != null ? `${match.goals_home} - ${match.goals_away}` : "-"}</td>
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
                                {weekendMatches.length > 0 ? 
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
                </div>
            </div>
            )}
        </div>  
    </div>
  );
}

export default withAuth(WeekendFootball);
