import React, { useEffect, useState } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from "../checkAuth";
import AuthPreloader from '../includes/auth_preLoader';
import DateTimeToUsersTimezone from '../../../components/functions/DatetimeToUsersTimezone';
import fetchPremiumJackpots from '../../../components/auth/fetch_premium_jackpots';

function PremiumJackpotPredictions() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jackpotPredictions, setJackpotGames] = useState([]);
  const [isMobile, setIsMobile] = useState(false); 
  const { jackpot_name } = router.query;
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (!router.isReady) return;

    const cookies = nookies.get(null);
    if (cookies.user) {
      setUser(JSON.parse(cookies.user));
    } else {
      router.push('/auth/login');
      return;
    }

    setLoading(true);

    fetchPremiumJackpots(jackpot_name)
      .then(response => {
        if (response && response.data) {
          setJackpotGames(response.data);
        } else {
          setJackpotGames([]);
        }
      })
      .catch(error => console.error('Error fetching games:', error))
      .finally(() => setLoading(false));
  }, [router.isReady, jackpot_name]);

  useEffect(() => {  
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 760);
    }
  }, []);

  const getMatchResult = (predictionType, match) => {
    if (match.goals_home == null || match.goals_away == null) return null;

    const homeGoals = Number(match.goals_home);
    const awayGoals = Number(match.goals_away);

    switch (predictionType) {
      case "1":
        return homeGoals > awayGoals ? "Won" : "Lost";
      case "X":
        return homeGoals === awayGoals ? "Won" : "Lost";
      case "2":
        return awayGoals > homeGoals ? "Won" : "Lost";
      case "DC1X":
      case "DCX1":
        return homeGoals >= awayGoals ? "Won" : "Lost";
      case "DCX2":
      case "DC2X":
        return awayGoals >= homeGoals ? "Won" : "Lost";
      case "DC12":
      case "DC21":
        return homeGoals !== awayGoals ? "Won" : "Lost";
      default:
        return "No Prediction";
    }
  };

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb" className="mb-3 border-bottom">
        <ol className="breadcrumb justify-content-center">
          <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
          <li className="bi bi-chevron-compact-right vipPages"><a href="/auth/plan">Premium Tips Store</a></li>
          <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
        </ol>
        <div className="col-md-12 align-self-center p-static order-2 text-center">
          <h3 className="font-weight-bold text-dark">Jackpot Predictions</h3>
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
          <div className="row justify-content-center" style={{ height: "300px" }}>
            <AuthPreloader /> 
          </div>
        ) : (
          <div id="tabs" className="project-tab">
            <div className="row justify-content-center pb-3 mb-4">
              <div className="row text-center">
                <div className="col-md-12">
                  <h5 className="font-weight-bold text-dark" style={{fontSize: !isMobile ? "larger": "medium"}}>
                    {jackpotPredictions.length > 0 ? jackpotPredictions[0]?.jackpot_name + " Predictions" : ""}
                  </h5>
                </div>
              </div>
              <table className="table match-tbs mt-3">
                <thead>
                  <tr>
                    {!isMobile && <th>Date</th>}
                    <th>#</th>
                    <th style={{ textAlign: "left" }}>Matches</th>
                    <th>Tip</th>
                    <th>Score</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {jackpotPredictions.length > 0 ? (
                    jackpotPredictions.map((match, index) => (
                      <tr key={index} style={{ fontSize: "smaller" }}>
                        {!isMobile && <td>{match.match_type=="automatic"? DateTimeToUsersTimezone(match.fixture_date): match.fixture_date}</td>}
                        <td>{match.jackpot_position}.</td>
                        <td style={{ textAlign: "left" }}>
                          {match.home_team_name} 
                          <span style={{ fontWeight: "bold" }}>&nbsp;vs&nbsp;</span> 
                          {match.away_team_name}
                          {isMobile && <><br/>{match.match_type=="automatic"? DateTimeToUsersTimezone(match.fixture_date): match.fixture_date}</>}
                        </td>
                        <td>{match.tip}</td>
                        <td>{match.goals_home != null && match.goals_away != null ? `${match.goals_home} - ${match.goals_away}` : "-"}</td>
                        <td style={{textAlign: !isMobile ? "left" : "center"}}>
                          {match.goals_home != null && match.goals_away != null
                            ? (getMatchResult(match.tip, match) === "Won"
                                ? <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>Won</span>
                                : <span className="number-circle rounded-square" style={{ backgroundColor: "white", border: "1px solid", borderColor: "red", color: "red" }}>Lost</span>)
                            : (!isMobile ? <span style={{ fontSize: "small" }}>{match.status_long}</span> : match.status_short)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ fontWeight: "bold", textAlign: "center" }}>
                        Predictions not available, check again later
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>  
    </div>
  );
}
export default withAuth(PremiumJackpotPredictions);
