import { Adsense } from "@ctrl/react-adsense";
import React, { useState } from "react";
import PreLoader from "../../includes/loader";

function OtherPagesRenders(props) {
  const [rowsToShow, setRowsToShow] = useState(10);

  if (!props.url_name.includes("team/[team-details]") && !props.url_name.includes("match/[match-details]")) {
    const groups = props.renderPredictions.reduce((acc, prediction) => {
      const gameDetails = prediction.props.props[0].game_details;
      if (!gameDetails) return acc;

      const formedleagueName = gameDetails.league_name + gameDetails.league_id;

      if (!acc[formedleagueName]) {
        acc[formedleagueName] = [];
      }
      acc[formedleagueName].push(prediction);

      return acc;
    }, {});

    const structuredDataByOtherPagesData = Object.entries(groups).map(([formedleagueName, group], index) => {
    const gameDetails = group[0].props.props[0].game_details;

    if (!gameDetails) return null;

    const leagueId = gameDetails.league_id;
    const originalleagueName = gameDetails.league_name;

      return (
        <React.Fragment key={`${formedleagueName}-${index}`}>
        <div style={{ backgroundColor: "#eef7ff", padding: "2px" }} className="responsive-row fixturesTextSize pb-1 pt-1">
          {props.isMobile == false ?
            <div className="responsive-cell"></div> : ""
          }
          <div className="responsive-cell team-link-x" style={{ textAlign: "left" }}>
              <img
                src={gameDetails.downloaded_country_flag ? gameDetails.downloaded_country_flag : gameDetails.downloaded_league_logo}
                className="img-fluid league-logo"
                alt={gameDetails.country_name + "-football-predictions"}
                loading="lazy"
              />
              &nbsp;
              {gameDetails.country_name != null ?
              <span style={{ fontWeight: "bold" }}>
                {props.url_name === "country/[football-prediction-for-country]"
                  ? gameDetails.country_name.charAt(0).toUpperCase() + gameDetails.country_name.slice(1).toLowerCase()
                  : gameDetails.country_name.charAt(0).toUpperCase() + gameDetails.country_name.slice(1).toLowerCase()} :  
                &nbsp;
                {originalleagueName.replace(/\s+/g, "-").toLowerCase() != "jackpots" ?
                <a
                  href={encodeURI(`/league/football-predictions-for-${gameDetails.country_name.toLowerCase()}/${originalleagueName.replace(/\s+/g, "-").toLowerCase()}-${leagueId}/fixtures`)}
                  className="ml-2 linkTxt">
                  {originalleagueName}
                </a>
                : 
                  originalleagueName
                }
              </span>
              : ""}
              &nbsp;
          </div>
          <div className="responsive-cell team-link" style={{ marginLeft: "auto" }}>
            {gameDetails.league_type ==="League" ? 
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={`/league/football-predictions-for-${gameDetails.country_name.toLowerCase()}/${encodeURIComponent(originalleagueName.toLowerCase().replace(/\s+/g, "-"))}-${leagueId}/standings`}
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
          <div className="responsive-cell">Prediction {props.url_name.includes("predictions-halftime-fulltime") ? "(HT / FT)" : ""} </div>
          <div className="responsive-cell team-link-standings"></div>
          <div className="responsive-cell team-link-l"></div>
          <div className="responsive-cell team-link-scores"></div>
        </div>
        : "" }
        {/**Display fixtures in groups for main pages */}
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
      // Then increase rowsToShow to display more groups (will show new data when it arrives)
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

        {/* Show a message when no more data is available */}
        {/* {props.hasMore === false && storeDataByOtherPagesData.length > 0 && (
          <div className="text-center my-4 text-muted">
            <em>No more matches to load</em>
          </div>
        )} */}
      </div>
    );
  }

  return null;
}

export default OtherPagesRenders;