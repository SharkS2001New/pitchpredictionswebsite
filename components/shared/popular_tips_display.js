import React, { useEffect, useState, useRef } from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";

const PopularTips = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  const fetchMatches = async () => {
    const startDate = new Date().toLocaleDateString("en-CA");
    const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString("en-CA"); 

    const apiUrl = `https://api.pitchpredictions.com/api/fetch_free_upcoming_matches?start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.data);
    } catch (err) {
      setError("Failed to fetch matches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (isLoading) return <div style={{ textAlign: 'center' }}></div>;  

  if (error) return <div>{error}</div>;

  const getTip = (match) => {
    const { percent_pred_home, percent_pred_draw, percent_pred_away } = match;
    if (percent_pred_home > percent_pred_draw && percent_pred_home > percent_pred_away) {
      return "1" + ",    " + percent_pred_home + " Win Probability"; // Home wins
    }
    if (percent_pred_draw > percent_pred_home && percent_pred_draw > percent_pred_away) {
      return "X" + ",    "+ percent_pred_draw + " Win Probability"; // Draw wins
    }
    return "2" + ",    "+ percent_pred_away + " Win Probability"; // Away wins
  };

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return ( 
    <React.Fragment>
      <div className="desktop-container-resize mb-0">
          <div className="col-sm-12 text-center bg-light pt-1">
              <h2 className="sectionTitle">UPCOMING POPULAR MATCHES</h2>
          </div>
      </div> 
      <div className="match-slider-container">
      <button className="slider-btn left-btn" onClick={scrollLeft}>
        &#8249;
      </button>
      <div className="match-slider" ref={sliderRef}>
        {matches.map((match, index) => (
          <div key={index} className="match-card">
            <div className="date-bar">
              <span style={{color: "#212830"}}>Date: {DateTimeToUsersTimezone(match.date)}</span>
            </div>
            <div className="match-header">
              <div className="team">
                <div className="team-logo-container">
                  <img
                    src={match.home_team_logo}
                    alt={match.home_team_name}
                    className="team-logo"
                  />
                </div>
                <p className="team-name">{match.home_team_name}</p>
              </div>

              <div className="vs">vs</div>

              <div className="team">
                <div className="team-logo-container">
                  <img
                    src={match.away_team_logo}
                    alt={match.away_team_name}
                    className="team-logo"
                  />
                </div>
                <p className="team-name">{match.away_team_name}</p>
              </div>
            </div>

            <div className="tip-bar">
                <div className="tip-value">Tip: <strong>{getTip(match)}</strong></div>
            </div>
          </div>
        ))}
      </div>
      <button className="slider-btn right-btn" onClick={scrollRight}>
        &#8250;
      </button>
    </div>
    </React.Fragment>
  );
};

export default PopularTips;