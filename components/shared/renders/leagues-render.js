import React, { useState } from "react";

function LeaguesPageRender(props) {
  const structuredDataByLeaguesOrByRoundsData = []; // This array is shared for countries and leagues structured data

  // For leagues page, group the data in the same round with the same title bar (heading round name)
  if (
    //Fixtures Pages on all predictions
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score" ||
    //Other league pages
    props.url_name === "league/[country-name]/[football-prediction-for-league]/results" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/standings" ||
    props.url_name === "league/[country-name]/[football-prediction-for-league]/trends"
  ) {
    const groups = {};

    // Group data by round name
    props.renderPredictions.forEach((prediction) => {
      const roundName = prediction.props.props[0].game_details.round;
      if (!groups[roundName]) {
        groups[roundName] = [];
      }
      groups[roundName].push(prediction);
    });

    const [rowsToShow, setRowsToShow] = useState({});

    const handleLoadMore = (roundName) => {
      setRowsToShow((prevState) => ({
        ...prevState,
        [roundName]: (prevState[roundName] || 15) + 15,
      }));
    };

    structuredDataByLeaguesOrByRoundsData.push(
      Object.entries(groups).map(([roundName, group]) => (
        <React.Fragment key={roundName}>
          <div style={{ backgroundColor: "#eef7ff", fontWeight: "bold"}} className="table-row fixturesTextSize">
            <div className="table-cell pb-1 pt-1">
              {roundName}
            </div>
          </div>
           {/**Fixture details header only for desktop*/}
        {props.isMobile == false ?
        <div className="responsive-row" style={{fontSize: "12px", border: "none",backgroundColor: "whitesmoke"}}>
          <div className="responsive-cell"></div>
          <div className="responsive-cell team-link"></div>
          <div className="responsive-cell team-link-y">
            <span className="m-4">1</span>
            <span className="m-4">X</span>
            <span className="m-4">2</span>
          </div>
          <div className="responsive-cell team-link-average">Avg</div>
          <div className="responsive-cell">Prediction</div>
          <div className="responsive-cell team-link-standings"></div>
          <div className="responsive-cell team-link-l"></div>
          <div className="responsive-cell team-link-scores"></div>
        </div>
        : "" }
          {/* Div fixtures content */}
          {group.slice(0, rowsToShow[roundName] || 10)}
          {/* Div fixtures content ends here */}
          {group.length > (rowsToShow[roundName] || 20) && (
            <div className="row">
              <button
                className="btn btn-link btn-sm fixturesTextSize"
                style={{ color: "#B11111", fontWeight: "bold" }}
                onClick={() => handleLoadMore(roundName)}>
                Show More Matches
              </button>
            </div>
          )}
        </React.Fragment>
      ))
    );
  }

  return structuredDataByLeaguesOrByRoundsData;
}

export default LeaguesPageRender;
