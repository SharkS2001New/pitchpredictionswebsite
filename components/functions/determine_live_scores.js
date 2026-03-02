import React from "react";
import DateTimeToUsersTimezone from "./DatetimeToUsersTimezone";

function DetermineLiveScores(game_details) {
    var livescores = "";
    var livestatus = "";
      
    var live_scores_data_array = []; 

    const myNewTimeZoneDate = DateTimeToUsersTimezone(game_details.date).split(' ')[1];
  
    if (["NS", "CANC", "TBD"].includes(game_details.status_short)) {
      if(game_details.status_short ==="NS"){
        livestatus =<span style={{ color: "black" }}>{myNewTimeZoneDate}</span>;
        livescores = <><br/><span style={{ color: "black" }}>-</span></>;
      }else{
        livestatus = (
          <>
            <br />
            <span className="hide-on-desktop" style={{ color: "black" }}>{game_details.status_short}</span>
            <span className="hide-on-mobile" style={{ color: "black" }}>{game_details.status_long}</span>
          </>
        );
        livescores = <span style={{ color: "black" }}>-</span>;
      }
      live_scores_data_array.push(livestatus, livescores);
      
    } else if (["FT", "AWD", "AET", "PEN", "WO", "ABD"].includes(game_details.status_short)) {
      if (["FT", "ABD"].includes(game_details.status_short)) {
        livestatus = (
          <span style={{ color: "black", border: "All" }}>
            <span className="hide-on-desktop">{game_details.status_short}</span>
            <span className="hide-on-mobile">{game_details.status_long}</span>
          </span>
        );
      } else {
        livestatus = (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {game_details.status_short !== null && (
              <>
              <br/>
                <span style={{ color: "black", border: "All", textTransform: "capitalize" }}>
                  <span className="hide-on-desktop">{game_details.status_short}</span>
                  <span className="hide-on-mobile">
                    {game_details.status_short === "PEN" ? "After Penalties" : 
                     game_details.status_short === "AET" ? "After Extra Time" : 
                     game_details.status_short === "WO" ? "Walk Over" : 
                     game_details.status_short === "ABD" ? "Match Abandoned" : 
                     game_details.status_long}
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
            color: game_details.status_short === "FT" || game_details.status_short === "AWD" ? "black" : "#B11111",
            borderColor: game_details.status_short === "FT" || game_details.status_short === "AWD" ? "black" : "#B11111"
          }}
        >
          {game_details.goals_home ? `${game_details.goals_home} - ${game_details.goals_away}` : null}
        </span>
        </React.Fragment>
       
      );
  
      live_scores_data_array.push(livestatus, livescores);
      
    } else if (["2H", "1H", "INT", "HT", "LIVE"].includes(game_details.status_short)) {
        livestatus = (
            <span style={{ color: "#B11111", fontWeight: "bold", border: "none" }}>
              <span className="hide-on-desktop">
                {game_details.status_short === "HT" || game_details.status_elapased === null || game_details.status_elapased === ""
                  ? game_details.status_short
                  : game_details.status_elapased}
              </span>
              <span className="hide-on-mobile">
                {game_details.status_short === "HT" || game_details.status_elapased === null || game_details.status_elapased === ""
                  ? game_details.status_long
                  : game_details.status_elapased}
              </span>
              {game_details.status_short !== "HT" && game_details.status_elapased !== null && game_details.status_elapased !== "" && 
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
          {game_details.goals_home ? `${game_details.goals_home} - ${game_details.goals_away}` : null}
        </span>
        </>
      );
  
      live_scores_data_array.push(livestatus, livescores);

    } else if (["ET", "PE", "BT", "P"].includes(game_details.status_short)) {
      livestatus = (
        <span style={{ color: "#B11111", fontWeight: "bold", border: "none", marginBottom: "10px" }}>
          <span className="hide-on-desktop">
            {game_details.status_elapased === null || game_details.status_elapased === "" 
              ? game_details.status_short 
              : <>{game_details.status_short}<br/> {game_details.status_elapased}</>
            }
          </span>
          <span className="hide-on-mobile">
            {game_details.status_elapased === null || game_details.status_elapased === "" 
              ? game_details.status_long 
              : <>{game_details.status_long}<br/> {game_details.status_elapased}</>
            }
          </span>
          {game_details.status_elapased !== null && game_details.status_elapased !== "" && 
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
          {game_details.goals_home ? `${game_details.goals_home} - ${game_details.goals_away}` : null}
        </span>
      );
  
      live_scores_data_array.push(livestatus, livescores);
    }
  
    return live_scores_data_array;
}

export default DetermineLiveScores;