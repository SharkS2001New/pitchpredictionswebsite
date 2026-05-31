// components/shared/fixture_of_the_day.js
import React, { useState, useEffect } from 'react';
import DateTimeToUsersTimezone from '../functions/DatetimeToUsersTimezone';
import ProbabilityResults from '../functions/determine_probability_results';
import CheckiffixtureIsSelected from '../functions/CheckIfFixtureisSelected';
import getFormattedCurrentDate from '../functions/GetTodaysDate';
import OptionPickedFeaturedMatch from '../functions/OptionPickedFeaturedMatch';

function FixtureOfTheDay() {
  const [gamesfixtures, setGames] = useState(null);
  const [endpointStatus, setEndPointStatus] = useState("");
  const [isPrimaryResponse, setIsPrimaryResponse] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);
  const currentDate = getFormattedCurrentDate();

  const [iconColor, setIconColor] = useState("currentColor");
  const [iconPath, setIconPath] = useState("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z")

  useEffect(() => {
    loadFixtureData();
  }, []);

  useEffect(() => {
    if (gamesfixtures && gamesfixtures.fixture_id) {
      if (CheckiffixtureIsSelected(gamesfixtures.fixture_id)) {
        setIconColor("red");
        setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
      } else {
        setIconColor("currentColor");
        setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
      }
    }
  }, [gamesfixtures]);

  const loadFixtureData = async () => {
    try {
      // Call our internal API route that handles caching
      const response = await fetch(`/api/fixture-of-the-day?date=${currentDate}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch fixture");
      }

      const data = await response.json();
      
      // Handle both array and object responses
      let fixtureData = data.data;
      if (Array.isArray(fixtureData) && fixtureData.length > 0) {
        // Take the first fixture from the array
        fixtureData = fixtureData[0];
      } else if (Array.isArray(fixtureData) && fixtureData.length === 0) {
        setEndPointStatus("No game available");
        setGames(null);
        return;
      }
      
      setGames(fixtureData);
      setIsPrimaryResponse(data.isPrimary || false);
      setEndPointStatus(data.status === true ? "success" : data.status);
      setCacheInfo({
        fromCache: data.fromCache || false,
        generatedAt: data.generatedAt || new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error loading fixture:", error);
      setEndPointStatus("error");
      setGames(null);
    }
  };

  // Force refresh function (useful for admin/debugging)
  const refreshData = () => {
    fetch(`/api/fixture-of-the-day?date=${currentDate}&refresh=true`)
      .then(response => response.json())
      .then(data => {
        let fixtureData = data.data;
        if (Array.isArray(fixtureData) && fixtureData.length > 0) {
          fixtureData = fixtureData[0];
        }
        setGames(fixtureData);
        setIsPrimaryResponse(data.isPrimary || false);
        setEndPointStatus(data.status === true ? "success" : data.status);
        setCacheInfo({
          fromCache: data.fromCache || false,
          generatedAt: data.generatedAt || new Date().toISOString()
        });
      })
      .catch(error => console.error("Error refreshing:", error));
  };

  let probability_results = "";

  if (gamesfixtures && endpointStatus === "success") {
    const myNewDateString = gamesfixtures.date ? DateTimeToUsersTimezone(gamesfixtures.date) : "";

    if (isPrimaryResponse) {
      probability_results = ProbabilityResults(gamesfixtures, gamesfixtures.option_picked);
    } else {
      let optionPicked = OptionPickedFeaturedMatch(
        gamesfixtures.percent_pred_home,
        gamesfixtures.percent_pred_draw,
        gamesfixtures.percent_pred_away,
        gamesfixtures.average_goals
      );
      probability_results = ProbabilityResults(gamesfixtures, optionPicked);
    }
  }

  if (endpointStatus === "") {
    return (
      <div className="row desktop-container-resize">
        <div className="skeleton-row skeleton-row-shimmer"></div>
        <div className="skeleton-row skeleton-row-shimmer"></div>
        <div className="skeleton-row skeleton-row-shimmer"></div>
      </div>
    );
  } else if (endpointStatus === "success") {
    if (!gamesfixtures) {
      return (
        <div className="row" style={{ backgroundColor: "#202c3c", color: "white", cursor: "auto" }}>
          <div className="responsive-row" style={{ backgroundColor: "#202c3c", color: "white", marginTop: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: "bold", marginLeft: "10px" }}>Game of the Day</span>
            {cacheInfo && cacheInfo.fromCache && (
              <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '10px' }}>
                ⚡ {new Date(cacheInfo.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="responsive-row" style={{ border: "none", color: "black", fontWeight: "bold", backgroundColor: "white", paddingBottom: "15px", height: "90px" }}>
            <div className="col" style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
              <span>Loading game data...</span> <br />
            </div>
          </div>
        </div>
      );
    }

    const myNewDateString = gamesfixtures.date ? DateTimeToUsersTimezone(gamesfixtures.date) : "";

    return (
      <div className="row" style={{ backgroundColor: "white", cursor: "auto" }}>
        <br />
        <div className="responsive-row" style={{ backgroundColor: "#202c3c", color: "white" }}>
          <span style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px", marginLeft: "10px" }}>Game of the Day</span>
          {cacheInfo && cacheInfo.fromCache && (
            <span style={{ fontSize: '0.7rem', color: '#ccc', marginLeft: '10px' }}>
              ⚡ {new Date(cacheInfo.generatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="responsive-row" style={{ border: "none", color: "black", fontWeight: "bold", backgroundColor: "white", paddingBottom: "15px", height: "100px" }}>
          <div className="responsive-cell team-link-standings mb-4" title={gamesfixtures.country_name || ''}>
            <span style={{ fontSize: "12px", cursor: "default" }}>{gamesfixtures.league_short_name || ''}</span><br />
            {gamesfixtures.downloaded_country_flag && (
              <img 
                src={gamesfixtures.downloaded_country_flag} 
                alt={gamesfixtures.country_name} 
                style={{ width: "20px", height: "20px", marginTop: "5px" }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={iconColor} className="bi bi-star-fill" viewBox="0 0 16 16" style={{ marginTop: "5px" }}>
              <path d={iconPath} />
            </svg>
          </div>
          <div className="responsive-cell team-link-namel" style={{ textAlign: "left", fontSize: "14px", fontWeight: "bold" }}>
            <a href={'/match/football-predictions-' +
              encodeURIComponent(gamesfixtures.home_team_name?.replace(/\s+/g, '-').toLowerCase() + '-vs-' + gamesfixtures.away_team_name?.replace(/\s+/g, '-').toLowerCase() + '-' + gamesfixtures.fixture_id) + "/matches"}>
              <div className="teamNameLink">
                <span>{gamesfixtures.home_team_name || ''}</span> <br />
                <span>{gamesfixtures.away_team_name || ''}</span> <br />
                <span style={{ fontSize: "13px", fontWeight: "normal" }}>{myNewDateString}</span>
              </div>
            </a>
          </div>
          <div className="responsive-cell team-link-y" style={{ margin: "5px", cursor: "default" }}>
            <span>{probability_results}</span>
            <br />
            <br />
            <span className={gamesfixtures.goals_home != null ? "scores-card" : ""} style={{ color: "black", whiteSpace: "nowrap" }}>
              {gamesfixtures.goals_home != null ? gamesfixtures.goals_home + " - " + gamesfixtures.goals_away : " - "}
            </span>
          </div>
        </div>
        <br />
      </div>
    );
  } else if (endpointStatus === "error") {
    return (
      <div className="row" style={{ backgroundColor: "#202c3c", color: "white", cursor: "auto" }}>
        <div className="responsive-row" style={{ backgroundColor: "#202c3c", color: "white", marginTop: "10px" }}>
          <span style={{ fontSize: "15px", fontWeight: "bold", marginLeft: "10px" }}>Game of the Day</span>
        </div>
        <div className="responsive-row" style={{ border: "none", color: "black", fontWeight: "bold", backgroundColor: "white", paddingBottom: "15px", height: "90px" }}>
          <div className="col" style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
            <span>Game Updating soon</span> <br />
          </div>
        </div>
      </div>
    );
  } else if (endpointStatus === "No game available") {
    return (
      <div className="row" style={{ backgroundColor: "#202c3c", color: "white", cursor: "auto" }}>
        <div className="responsive-row" style={{ backgroundColor: "#202c3c", color: "white", marginTop: "10px" }}>
          <span style={{ fontSize: "15px", fontWeight: "bold", marginLeft: "10px" }}>Game of the Day</span>
        </div>
        <div className="responsive-row" style={{ border: "none", color: "black", fontWeight: "bold", backgroundColor: "white", paddingBottom: "15px", height: "90px" }}>
          <div className="col" style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>
            <span>No game available for today</span> <br />
          </div>
        </div>
      </div>
    );
  }
}

export default FixtureOfTheDay;