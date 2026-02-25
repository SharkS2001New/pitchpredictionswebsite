import React, { useState, useEffect } from 'react';
import DateTimeToUsersTimezone from '../functions/DatetimeToUsersTimezone';
import ProbabilityResults from '../functions/determine_probability_results';
import CheckiffixtureIsSelected from '../functions/CheckIfFixtureisSelected';
import getFormattedCurrentDate from '../functions/GetTodaysDate';
import OptionPickedFeaturedMatch from '../functions/OptionPickedFeaturedMatch'; // Import the function

function FixtureOfTheDay() {
  const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the backend.sokapedia.com
  const [gamesfixtures, setGames] = useState([]); //defined as an array 
  const [endpointStatus, setEndPointStatus] = useState("");
  const [isPrimaryResponse, setIsPrimaryResponse] = useState(false); // Track if the response is from the primary URL
  const currentDate = getFormattedCurrentDate();

  const [iconColor, setIconColor] = useState("currentColor");
  const [iconPath, setIconPath] = useState("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z")

  // Cache key based on current date (changes daily)
  const cacheKey = `fixture_of_the_day_${currentDate}`;
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    loadFixtureData();

    if (gamesfixtures.fixture_id && CheckiffixtureIsSelected(gamesfixtures.fixture_id)) {
      setIconColor("red");
      setIconPath("M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z");
    } else {
      setIconColor("currentColor");
      setIconPath("M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z");
    }
  }, [gamesfixtures.fixture_id]);

  // Function to load data (either from cache or API)
  const loadFixtureData = async () => {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        await fetchFromAPI();
        return;
      }

      // Try to get cached data
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { timestamp, data, isPrimary, status } = JSON.parse(cachedData);
        const now = new Date().getTime();
        
        // If cache is still valid (less than 1 hour old)
        if (now - timestamp < CACHE_DURATION) {
          setGames(data);
          setIsPrimaryResponse(isPrimary);
          setEndPointStatus(status);
          return;
        }
      }
      
      // Cache expired or doesn't exist - fetch from API
      await fetchFromAPI();
      
    } catch (error) {
      console.error("Cache error:", error);
      // If cache fails, fall back to API
      await fetchFromAPI();
    }
  };

  async function fetchFromAPI() {
    try {
      // Fetch fixtures from the primary URL
      const primaryResponse = await fetch("https://api.pitchpredictions.com/api/match_of_the_day?fixture_date=" + currentDate, {
        headers: headers
      });

      const primaryData = await primaryResponse.json();

      if (primaryData.status === true && primaryData.data.length > 0) {
        const data = primaryData.data[0];
        setEndPointStatus(primaryData.message);
        setGames(data);
        setIsPrimaryResponse(true);
        
        // Save to cache
        saveToCache(data, true, primaryData.message);
        
        return data;
      } else {
        // If primary URL does not return a valid game, fetch from the alternative URL
        const alternativeResponse = await fetch("https://api.pitchpredictions.com/api/auto_featured_match_of_the_day?fixture_date=" + currentDate, {
          headers: headers
        });

        const alternativeData = await alternativeResponse.json();

        if (alternativeData.status === true && alternativeData.data.length > 0) {
          const data = alternativeData.data[0];
          setEndPointStatus(alternativeData.message);
          setGames(data);
          setIsPrimaryResponse(false);
          
          // Save to cache
          saveToCache(data, false, alternativeData.message);
          
          return data;
        } else {
          setEndPointStatus("No game available");
          // Cache the "no game" status too (with shorter cache maybe)
          saveToCache(null, false, "No game available");
        }
      }
    } catch (error) {
      console.error(error);
      setEndPointStatus("error");
    }
  }

  // Helper function to save data to cache
  const saveToCache = (data, isPrimary, status) => {
    try {
      if (typeof window !== 'undefined') {
        const cacheData = {
          timestamp: new Date().getTime(),
          data: data,
          isPrimary: isPrimary,
          status: status
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error("Failed to save to cache:", error);
    }
  };

  // Force refresh function (useful for admin/debugging)
  const refreshData = () => {
    localStorage.removeItem(cacheKey);
    fetchFromAPI();
  };

  let probability_results = "";

  // Call function to convert date time to users timezone
  const myNewDateString = gamesfixtures.date ? DateTimeToUsersTimezone(gamesfixtures.date) : "";

  if (endpointStatus === "success" || endpointStatus === "success (cached)") {
    if (isPrimaryResponse) {
      // For primary response, use gamesfixtures.option_picked directly
      probability_results = ProbabilityResults(gamesfixtures, gamesfixtures.option_picked);
    } else {
      // For alternative response, calculate optionPicked using OptionPickedFeaturedMatch
      let optionPicked = OptionPickedFeaturedMatch(
        gamesfixtures.percent_pred_home,
        gamesfixtures.percent_pred_draw,
        gamesfixtures.percent_pred_away,
        gamesfixtures.average_goals
      );

      // Calculate probability results
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
  } else if (endpointStatus === "success" || endpointStatus === "success (cached)") {
    return (
      <div className="row" style={{ backgroundColor: "white", cursor: "auto" }}>
        <br />
        <div className="responsive-row" style={{ backgroundColor: "#202c3c", color: "white" }}>
          <span style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px", marginLeft: "10px" }}>Game of the Day</span>
          {/* Optional: Add small cache indicator (remove in production) */}
          {/* {endpointStatus === "success (cached)" && (
            <span style={{ fontSize: "10px", marginLeft: "10px", color: "#ccc" }}>(cached)</span>
          )} */}
        </div>
        <div className="responsive-row" style={{ border: "none", color: "black", fontWeight: "bold", backgroundColor: "white", paddingBottom: "15px", height: "100px" }}>
          <div className="responsive-cell team-link-standings mb-4" title={gamesfixtures.country_name}>
            <span style={{ fontSize: "12px", cursor: "default" }}>{gamesfixtures.league_short_name}</span><br />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={iconColor} className="bi bi-star-fill" viewBox="0 0 16 16">
              <path d={iconPath} />
            </svg>
          </div>
          <div className="responsive-cell team-link-namel" style={{ textAlign: "left", fontSize: "14px", fontWeight: "bold" }}>
            <a href={'/match/football-predictions-' +
              encodeURIComponent(gamesfixtures.home_team_name.replace(/\s+/g, '-').toLowerCase() + '-vs-' + gamesfixtures.away_team_name.replace(/\s+/g, '-').toLowerCase() + '-' + gamesfixtures.fixture_id) + "/matches"}>
              <div className="teamNameLink">
                <span>{gamesfixtures.home_team_name}</span> <br />
                <span>{gamesfixtures.away_team_name}</span> <br />
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