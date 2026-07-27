import React from "react";
import {
  formatFixtureTime,
  resolveFixtureDateTime,
} from "./DatetimeToUsersTimezone";

function DetermineLiveScores(game_details, isMobile) {
    var livescores = "";
    var livestatus = "";
      
    var live_scores_data_array = []; 

    // Get data from new API structure
    const matchDateTime = resolveFixtureDateTime(game_details);
    const statusShort = game_details.match?.status || game_details.status_short;
    const statusLong = game_details.match?.status_long || game_details.status_long;
    const elapsed = game_details.match?.elapsed || game_details.status_elapased;
    const homeScore = game_details.score?.home ?? game_details.goals_home;
    const awayScore = game_details.score?.away ?? game_details.goals_away;

    const myNewTimeZoneDate = formatFixtureTime(matchDateTime);
  
    if (["NS", "CANC", "TBD"].includes(statusShort)) {
      if(statusShort === "NS"){
        livestatus = <span style={{ color: "black" }}>{myNewTimeZoneDate}</span>;
        livescores = <><br/><span style={{ color: "black" }}>-</span></>;
      } else {
        livestatus = (
          <>
            <br />
            <span className="hide-on-desktop" style={{ color: "black" }}>{statusShort}</span>
            <span className="hide-on-mobile" style={{ color: "black" }}>{statusLong}</span>
          </>
        );
        livescores = <span style={{ color: "black" }}>-</span>;
      }
      live_scores_data_array.push(livestatus, livescores);
      
    } else if (["FT", "AWD", "AET", "PEN", "WO", "ABD"].includes(statusShort)) {
      if (["FT", "ABD"].includes(statusShort)) {
        livestatus = (
          <span style={{ color: "black", border: "All" }}>
            <span className="hide-on-desktop">{statusShort}</span>
            <span className="hide-on-mobile">{statusLong}</span>
          </span>
        );
      } else {
        livestatus = (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {statusShort !== null && (
              <>
              <br/>
                <span style={{ color: "black", border: "All", textTransform: "capitalize" }}>
                  <span className="hide-on-desktop">{statusShort}</span>
                  <span className="hide-on-mobile">
                    {statusShort === "PEN" ? "After Penalties" : 
                     statusShort === "AET" ? "After Extra Time" : 
                     statusShort === "WO" ? "Walk Over" : 
                     statusShort === "ABD" ? "Match Abandoned" : 
                     statusLong}
                  </span>
                </span><br />
              </>
            )}
          </span>
        );
      }
  
      livescores = (
        <React.Fragment>
          <br/>
          <span
            className="scores-card"
            id="fulltimeGoals"
            style={{
              color: statusShort === "FT" || statusShort === "AWD" ? "black" : "#B11111",
              borderColor: statusShort === "FT" || statusShort === "AWD" ? "black" : "#B11111"
            }}
          >
            {homeScore !== null && homeScore !== undefined ? `${homeScore} - ${awayScore}` : null}
          </span>
        </React.Fragment>
      );
  
      live_scores_data_array.push(livestatus, livescores);
      
    } else if (["2H", "1H", "INT", "HT", "LIVE"].includes(statusShort)) {
        livestatus = (
            <span style={{ color: "#B11111", fontWeight: "bold", border: "none" }}>
              <span className="hide-on-desktop">
                {statusShort === "HT" || elapsed === null || elapsed === ""
                  ? statusShort
                  : elapsed}
              </span>
              <span className="hide-on-mobile">
                {statusShort === "HT" || elapsed === null || elapsed === ""
                  ? statusLong
                  : elapsed}
              </span>
              {statusShort !== "HT" && elapsed !== null && elapsed !== "" && 
                <span className="blink_text" style={{ color: "#B11111" }}>'</span>
              }
            </span>
          );
          
        livescores = (
          <><br/>
            <span
              className="scores-card"
              id="fulltimeGoals"
              style={{
                fontWeight: "bold",
                border: "1px solid #B11111",
                color: "#B11111"
              }}
            >          
              {homeScore !== null && homeScore !== undefined ? `${homeScore} - ${awayScore}` : null}
            </span>
          </>
        );
  
        live_scores_data_array.push(livestatus, livescores);

    } else if (["ET", "PE", "BT", "P"].includes(statusShort)) {
      livestatus = (
        <span style={{ color: "#B11111", fontWeight: "bold", border: "none", marginBottom: "10px" }}>
          <span className="hide-on-desktop">
            {elapsed === null || elapsed === "" 
              ? statusShort 
              : <>{statusShort}<br/> {elapsed}</>
            }
          </span>
          <span className="hide-on-mobile">
            {elapsed === null || elapsed === "" 
              ? statusLong 
              : <>{statusLong}<br/> {elapsed}</>
            }
          </span>
          {elapsed !== null && elapsed !== "" && 
            <span className="blink_text" style={{ color: "#B11111" }}>'</span>
          }
        </span>
      );
  
      livescores = (
        <span
          className="scores-card"
          id="fulltimeGoals"
          style={{
            fontWeight: "bold",
            border: "1px solid #B11111",
            color: "#B11111"
          }}
        >
          {homeScore !== null && homeScore !== undefined ? `${homeScore} - ${awayScore}` : null}
        </span>
      );
  
      live_scores_data_array.push(livestatus, livescores);
    }
  
    return live_scores_data_array;
}

export default DetermineLiveScores;