// components/shared/other_pages_renders.js
import { Adsense } from "@ctrl/react-adsense";
import React, { useState } from "react";
import PreLoader from "../../includes/loader";

function OtherPagesRenders(props) {
  const [rowsToShow, setRowsToShow] = useState(10);

  // FIX: Add safety check - if renderPredictions is not an array, return null
  if (!props.renderPredictions || !Array.isArray(props.renderPredictions)) {
    return null;
  }

  if (!props.url_name.includes("team/[team-details]") && !props.url_name.includes("match/[match-details]")) {
    const groups = props.renderPredictions.reduce((acc, prediction) => {
      // FIX: Add safety checks for nested properties
      if (!prediction || !prediction.props || !prediction.props.props || !prediction.props.props[0]) {
        return acc;
      }
      
      const gameDetails = prediction.props.props[0].game_details;
      if (!gameDetails) return acc;

      // Get league info from new structure with fallbacks
      const leagueName = gameDetails.league?.name || gameDetails.league_name || '';
      const leagueId = gameDetails.league?.id || gameDetails.league_id || '';
      const formedleagueName = `${leagueName}${leagueId}`;

      if (!acc[formedleagueName]) {
        acc[formedleagueName] = [];
      }
      acc[formedleagueName].push(prediction);

      return acc;
    }, {});

    const structuredDataByOtherPagesData = Object.entries(groups).map(([formedleagueName, group], index) => {
      // FIX: Add safety checks
      if (!group[0] || !group[0].props || !group[0].props.props || !group[0].props.props[0]) {
        return null;
      }
      
      const gameDetails = group[0].props.props[0].game_details;
      if (!gameDetails) return null;

      // Extract league info from new structure with fallbacks
      const leagueId = gameDetails.league?.id || gameDetails.league_id;
      const originalleagueName = gameDetails.league?.name || gameDetails.league_name || '';
      const countryName = gameDetails.league?.country || gameDetails.country_name || '';
      const leagueType = gameDetails.league?.type || gameDetails.league_type || 'League';
      
      // Get logos from new structure with fallbacks
      const leagueLogo = gameDetails.league?.logo || gameDetails.downloaded_league_logo || '';
      const countryLogo = gameDetails.league?.country_logo || gameDetails.downloaded_country_flag || '';

      return (
        <React.Fragment key={`${formedleagueName}-${index}`}>
          {/* League header row */}
          <div style={{ backgroundColor: "#eef7ff", padding: "2px" }} className="responsive-row fixturesTextSize pb-1 pt-1">
            {/* Empty cell for star column - desktop only */}
            <div className="responsive-cell hide-on-mobile"></div>
            
            {/* League info cell */}
            <div className="responsive-cell team-link-x" style={{ textAlign: "left" }}>
              {countryLogo || leagueLogo ? (
                <img
                  src={countryLogo || leagueLogo}
                  className="img-fluid league-logo"
                  alt={`${countryName}-football-predictions`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
              &nbsp;
              {countryName ? (
                <span style={{ fontWeight: "bold" }}>
                  {props.url_name === "country/[football-prediction-for-country]"
                    ? countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase()
                    : countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase()} :  
                  &nbsp;
                  {originalleagueName.replace(/\s+/g, "-").toLowerCase() !== "jackpots" ? (
                    <a
                      href={encodeURI(`/league/football-predictions-for-${countryName.toLowerCase()}/${originalleagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/fixtures`)}
                      className="ml-2 linkTxt">
                      {originalleagueName}
                    </a>
                  ) : 
                    originalleagueName
                  }
                </span>
              ) : ""}
              &nbsp;
            </div>
            
            {/* Standings link cell */}
            <div className="responsive-cell team-link" style={{ marginLeft: "auto" }}>
              {leagueType === "League" && leagueId && originalleagueName && countryName ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href={`/league/football-predictions-for-${countryName.toLowerCase()}/${encodeURIComponent(originalleagueName.toLowerCase().replace(/\s+/g, "-"))}-${leagueId}/standings`}
                    className="ml-2 linkTxt">
                    <span>Standings</span>
                  </a>
                </div>
              ) : null}
            </div>
            
            {/* Empty cell for right alignment - desktop only */}
            <div className="responsive-cell hide-on-mobile"></div>
          </div>
          
          {/* Fixture details header - desktop only */}
          <div className="responsive-row hide-on-mobile" style={{fontSize: "12px", border: "none", backgroundColor: "whitesmoke"}}>
            <div className="responsive-cell"></div>
            <div className="responsive-cell team-link"></div>
            <div className="responsive-cell team-link-y">
              <span className="m-4">1</span>
              <span className="m-4">X</span>
              <span className="m-4">2</span>
            </div>
            <div className="responsive-cell team-link-average">Avg</div>
            <div className="responsive-cell">Prediction {props.url_name && props.url_name.includes("predictions-halftime-fulltime") ? "(HT / FT)" : ""} </div>
            <div className="responsive-cell team-link-standings"></div>
            <div className="responsive-cell team-link-l"></div>
            <div className="responsive-cell team-link-scores"></div>
          </div>
          
          {/* Fixtures for this league */}
          {group} 
        </React.Fragment>         
      );
    });

    const storeDataByOtherPagesData = structuredDataByOtherPagesData.filter(Boolean).slice(0, rowsToShow);

    const handleLoadMore = () => {
      // First, trigger parent to load more data from API
      if (props.onLoadMore) {
        props.onLoadMore();
      }
      // Then increase rowsToShow to display more groups
      setRowsToShow((prevRowsToShow) => prevRowsToShow + 50);
    };
 
    return (
      <div>
        {storeDataByOtherPagesData.map((block, index) => (
          <div key={index}>
            {block}
            {(index === 2 && index !== storeDataByOtherPagesData.length - 1) && (
              <div className="desktop-container-resize">
                <div className="text-center">
                  <Adsense
                    client="ca-pub-5665711413000284"
                    slot="7303713943"
                    style={{ display: "block" }}
                    layout="in-article"
                    format="fluid"
                  />
                </div>
              </div>
            )}
            {index !== 2 && (index - 2) % 8 === 0 && index !== storeDataByOtherPagesData.length - 1 && (
              <div className="desktop-container-resize">
                <div className="text-center">
                  <Adsense
                    client="ca-pub-5665711413000284"
                    slot="4141567825"
                    style={{ display: "block" }}
                    layout="in-article"
                    format="fluid"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Show More button - only if there might be more data */}
        {props.hasMore !== false && (
          <div className="text-center my-2">
            <button
              className="btn btn-link btn-sm fixturesTextSize"
              style={{ minWidth: "150px", color: "#B11111", fontWeight: "bold" }}
              onClick={handleLoadMore}
              disabled={props.isLoadingMore}>
              {props.isLoadingMore ? (
                <PreLoader/>
              ) : (
                "Show More Matches"
              )}
            </button>
          </div>  
        )}
      </div>
    );
  }

  return null;
}

export default OtherPagesRenders;