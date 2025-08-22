import React, { useState } from "react";

function CountrysPageRenders(props) {
  // Group the data by league name
  const groups = {};
  let countryName = "";
  let countryFlag = "";

  // Group data by league name
  props.renderPredictions.forEach((prediction) => {
    const formedleagueName =
      prediction.props.props[0].game_details.league_name +
      prediction.props.props[0].game_details.league_id; // Form a unique league_name by combining league_name and league_id
      countryFlag = prediction.props.props[0].game_details.downloaded_country_flag;
    // Skip iteration if countryName is null or undefined
    if (!countryName) {
      countryName = prediction.props.props[0].game_details.country_name;
    }

    if (!groups[formedleagueName]) {
      groups[formedleagueName] = [];
    }
    groups[formedleagueName].push(prediction);
  });

  const structuredDataByLeaguesOrByRoundsData = Object.entries(groups).map(([formedleagueName, group]) => {
    const leagueId = group[0].props.props[0].game_details.league_id;
    const originalleagueName = group[0].props.props[0].game_details.league_name;

    const [rowsToShow, setRowsToShow] = useState(5);
    
    const handleLoadMore = () => {
      setRowsToShow((prevRowsToShow) => prevRowsToShow + 15);
    };  
   
    return (
      <div key={formedleagueName}> 
        <div style={{ backgroundColor: "#eef7ff", padding: "2px" }} className="responsive-row fixturesTextSize pb-1 pt-1 mb-1">
            {props.isMobile == false ?
              <div className="responsive-cell"></div>: ""
            }         
            <div className="responsive-cell team-link-x" style={{ textAlign: "left" }}>
            <span style={{ fontWeight: "bold" }}>
              {countryName.toUpperCase()} :
              {/* link to leagues */}
              &nbsp;
              <a
                href={encodeURI(
                  `/league/football-predictions-for-${group[0].props.props[0].game_details.country_name.toLowerCase()}/${originalleagueName.replace(
                    /\s+/g,
                    "-"
                  ).toLowerCase()}-${leagueId}/fixtures`
                )}
                className="ml-2 linkTxt"
              >
                {originalleagueName}
              </a>
            </span>
          </div>
          <div className="responsive-cell team-link" style={{ marginLeft: "auto" }}>
            {group[0].props.props[0].game_details.league_type === "League" ?
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={`/league/football-predictions-for-${group[0].props.props[0].game_details.country_name.toLowerCase()}/${encodeURIComponent(originalleagueName.toLowerCase().replace(/\s+/g, "-"))}-${leagueId}/standings`}
                  className="ml-2 linkTxt">
                  <span>Standings</span>
                </a>
              </div>
            : "" }
          </div>
          {props.isMobile == false ?
            <div className="responsive-cell"></div>: ""
          }
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
        {/* fixtures data */}
        {group.slice(0, rowsToShow)}
        {group.length > rowsToShow && (
          <div className="table-row">
            <div className="table-cell" colSpan="12">
              <button
                className="btn btn-link btn-sm fixturesTextSize"
                style={{ color: "#B11111", fontWeight: "bold" }}
                onClick={handleLoadMore}
              >
                Show More Matches
              </button>
            </div>
          </div>
        )}
      </div>
    );
  });

  return structuredDataByLeaguesOrByRoundsData;
}

export default CountrysPageRenders;
