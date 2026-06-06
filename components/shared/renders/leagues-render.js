import React, { useState } from "react";

function LeaguesPageRender(props) {
  const structuredDataByLeaguesOrByRoundsData = [];

  // Safety check - ensure renderPredictions exists and is an array
  if (!props.renderPredictions || !Array.isArray(props.renderPredictions)) {
    return structuredDataByLeaguesOrByRoundsData;
  }

  // For leagues page, group the data in the same round with the same title bar (heading round name)
  if (
    // Fixtures pages on all predictions
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score" ||
    // Results pages on all predictions
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score" ||
    // Other league pages
    props.url_name === "league/[country-name]/[football-prediction-for-league]/standings" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/trends"
  ) {
    const groups = {};

    // Group data by round name
    props.renderPredictions.forEach((prediction) => {
      // Safety check for nested properties
      if (!prediction || !prediction.props || !prediction.props.props || !prediction.props.props[0]) {
        return;
      }
      
      const gameDetails = prediction.props.props[0].game_details;
      if (!gameDetails) return;
      
      // Get round name from new API structure
      // Round info might be in league.round or directly in round property
      const roundName = gameDetails.league?.round || gameDetails.round || "Uncategorized";
      
      if (!groups[roundName]) {
        groups[roundName] = [];
      }
      groups[roundName].push(prediction);
    });

    const [rowsToShow, setRowsToShow] = useState({});

    const handleLoadMore = (roundName) => {
      setRowsToShow((prevState) => ({
        ...prevState,
        [roundName]: (prevState[roundName] || 10) + 15,
      }));
    };

    // Only show rounds that have games
    const activeRounds = Object.entries(groups).filter(([_, group]) => group.length > 0);

    if (activeRounds.length > 0) {
      structuredDataByLeaguesOrByRoundsData.push(
        activeRounds.map(([roundName, group], index) => (
          <React.Fragment key={`${roundName}-${index}`}>
            {/* Round header */}
            <div style={{ backgroundColor: "#eef7ff", fontWeight: "bold" }} className="table-row fixturesTextSize">
              <div className="table-cell pb-1 pt-1">
                {roundName}
              </div>
            </div>
            
            {/* Fixture details header - desktop only */}
            <div className="responsive-row hide-on-mobile" style={{fontSize: "12px", border: "none", backgroundColor: "whitesmoke"}}>
                <div className="responsive-cell"></div>
                <div className="responsive-cell team-link"></div>
                <div className="responsive-cell team-link-y">
                    {props.url_name && props.url_name.includes("double-chance-predictions") ? (
                        // Double Chance headers
                        <>
                            <span className="m-4">1X</span>
                            <span className="m-4">X2</span>
                            <span className="m-4">12</span>
                        </>
                    ) :props.url_name && props.url_name.includes("predictions-halftime-fulltime") ? (
                        // HT/FT headers
                        <>
                            <span className="m-3">HT1</span>
                            <span className="m-3">HTX</span>
                            <span className="m-3">HT2</span>
                        </>
                    )
                    
                    : props.url_name && props.url_name.includes("predictions-under-over") ? (
                        // Over/Under headers
                        <>
                            <span className="m-3">O 2.5</span>
                            <span className="m-3">U 2.5</span>
                        </>
                    ) : props.url_name && props.url_name.includes("predictions-both-to-score") ? (
                        // BTTS headers
                        <>
                            <span className="m-3">YES</span>
                            <span className="m-3">NO</span>
                        </>
                    ) : (
                        // Default 1X2 headers
                        <>
                            <span className="m-4">1</span>
                            <span className="m-4">X</span>
                            <span className="m-4">2</span>
                        </>
                    )}
                </div>
                <div className="responsive-cell team-link-average">Avg</div>
                <div className="responsive-cell">Prediction {props.url_name && props.url_name.includes("predictions-halftime-fulltime") ? "(HT / FT)" : ""} </div>
                <div className="responsive-cell team-link-standings"></div>
                <div className="responsive-cell team-link-l"></div>
                <div className="responsive-cell team-link-scores"></div>
            </div>
            
            {/* Fixtures content - slice based on rowsToShow */}
            {(rowsToShow[roundName] ? group.slice(0, rowsToShow[roundName]) : group.slice(0, 10))}
            
            {/* Show more button */}
            {group.length > (rowsToShow[roundName] || 10) && (
              <div className="row" key={`showmore-${roundName}`}>
                <button
                  className="btn btn-link btn-sm fixturesTextSize"
                  style={{ color: "#B11111", fontWeight: "bold" }}
                  onClick={() => handleLoadMore(roundName)}>
                  Show More Matches ({group.length - (rowsToShow[roundName] || 10)} remaining)
                </button>
              </div>
            )}
            
            {/* Add spacing between rounds */}
            {index < activeRounds.length - 1 && (
              <div style={{ height: "10px" }}></div>
            )}
          </React.Fragment>
        ))
      );
    } else {
      // No data message
      structuredDataByLeaguesOrByRoundsData.push(
        <div key="no-data" className="text-center p-4">
          <p>No fixtures available for this league</p>
        </div>
      );
    }
  }

  return structuredDataByLeaguesOrByRoundsData;
}

export default LeaguesPageRender;