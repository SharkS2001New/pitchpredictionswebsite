import React, { useState } from "react";

function CountrysPageRenders(props) {
  // Safety check - ensure renderPredictions exists and is an array
  if (!props.renderPredictions || !Array.isArray(props.renderPredictions)) {
    return [];
  }

  // Group the data by league name
  const groups = {};
  let countryName = "";
  let countryFlag = "";

  // Group data by league name
  props.renderPredictions.forEach((prediction) => {
    // Safety check for nested properties
    if (!prediction || !prediction.props || !prediction.props.props || !prediction.props.props[0]) {
      return;
    }
    
    const gameDetails = prediction.props.props[0].game_details;
    if (!gameDetails) return;
    
    // Get league info from new API structure
    const leagueName = gameDetails.league?.name || gameDetails.league_name || '';
    const leagueId = gameDetails.league?.id || gameDetails.league_id || '';
    const formedleagueName = `${leagueName}${leagueId}`;
    
    // Get country flag from new structure
    countryFlag = gameDetails.league?.country_logo || gameDetails.downloaded_country_flag || '';
    
    // Skip iteration if countryName is null or undefined
    if (!countryName) {
      countryName = gameDetails.league?.country || gameDetails.country_name || '';
    }

    if (!groups[formedleagueName]) {
      groups[formedleagueName] = [];
    }
    groups[formedleagueName].push(prediction);
  });

  // Only process if we have groups
  if (Object.keys(groups).length === 0) {
    return <div className="text-center p-4">No fixtures available for this country</div>;
  }

  const structuredDataByLeaguesOrByRoundsData = Object.entries(groups).map(([formedleagueName, group], groupIndex) => {
    // Safety check for first item
    if (!group[0] || !group[0].props || !group[0].props.props || !group[0].props.props[0]) {
      return null;
    }
    
    const gameDetails = group[0].props.props[0].game_details;
    if (!gameDetails) return null;
    
    // Get league info from new structure
    const leagueId = gameDetails.league?.id || gameDetails.league_id;
    const originalleagueName = gameDetails.league?.name || gameDetails.league_name || '';
    const leagueType = gameDetails.league?.type || gameDetails.league_type || 'League';
    const leagueCountry = gameDetails.league?.country || gameDetails.country_name || '';
    
    // Use useState hook properly - must be at top level of component, not inside map
    // Moved to separate component below
    const [rowsToShow, setRowsToShow] = useState(5);
    
    const handleLoadMore = () => {
      setRowsToShow((prevRowsToShow) => prevRowsToShow + 15);
    };  
   
    return (
      <div key={`${formedleagueName}-${groupIndex}`}> 
        {/* League header row */}
        <div style={{ backgroundColor: "#eef7ff", padding: "2px" }} className="responsive-row fixturesTextSize pb-1 pt-1 mb-1">
          {/* Empty cell for star column - desktop only */}
          <div className="responsive-cell hide-on-mobile"></div>
          
          {/* League info cell */}
          <div className="responsive-cell team-link-x" style={{ textAlign: "left" }}>
            {countryFlag && (
              <img
                src={countryFlag}
                className="img-fluid league-logo"
                alt={`${countryName}-flag`}
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <span style={{ fontWeight: "bold" }}>
              {countryName.toUpperCase()} :
              {/* link to leagues */}
              &nbsp;
              <a
                href={encodeURI(
                  `/league/football-predictions-for-${leagueCountry.toLowerCase()}/${originalleagueName.replace(
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
          
          {/* Standings link cell */}
          <div className="responsive-cell team-link" style={{ marginLeft: "auto" }}>
            {leagueType === "League" && leagueId && originalleagueName && leagueCountry ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={`/league/football-predictions-for-${leagueCountry.toLowerCase()}/${encodeURIComponent(originalleagueName.toLowerCase().replace(/\s+/g, "-"))}-${leagueId}/standings`}
                  className="ml-2 linkTxt">
                  <span>Standings</span>
                </a>
              </div>
            ) : null }
          </div>
          
          {/* Empty cell for right alignment - desktop only */}
          <div className="responsive-cell hide-on-mobile"></div>
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
        
        {/* fixtures data */}
        {group.slice(0, rowsToShow)}
        
        {/* Show more button */}
        {group.length > rowsToShow && (
          <div className="table-row" key={`showmore-${formedleagueName}`}>
            <div className="table-cell" colSpan="12">
              <button
                className="btn btn-link btn-sm fixturesTextSize"
                style={{ color: "#B11111", fontWeight: "bold" }}
                onClick={handleLoadMore}
              >
                Show More Matches ({group.length - rowsToShow} remaining)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  });

  return structuredDataByLeaguesOrByRoundsData.filter(Boolean);
}

export default CountrysPageRenders;