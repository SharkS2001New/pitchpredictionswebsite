import React from "react";
import DateTimeToUsersTimezone from "./DatetimeToUsersTimezone";

function DetermineLiveScores(game_details, device) {
    var livescores = "";
    var livestatus = "";
      
    var live_scores_data_array = []; 

    const myNewTimeZoneDate = DateTimeToUsersTimezone(game_details.date).split(' ')[1];
  
    if (["NS", "CANC", "TBD"].includes(game_details.status_short)) {
      if(game_details.status_short ==="NS"){
        livestatus = <><br /><span style={{ color: "black" }}>{myNewTimeZoneDate}</span></>;
        livescores = <span style={{ color: "black" }}>-</span>;
      }else{
        livestatus = <><br /><span style={{ color: "black" }}>{device ? game_details.status_short : game_details.status_long}</span></>;
        livescores = <span style={{ color: "black" }}>-</span>;
      }
      live_scores_data_array.push(livestatus, livescores);
    } else if (["FT", "AWD", "AET", "PEN", "WO", "ABD"].includes(game_details.status_short)) {
      if (["FT", "ABD"].includes(game_details.status_short)) {
        livestatus = <span style={{ color: "black", border: "All" }}><br />{device ? game_details.status_short : game_details.status_long}</span>;
      } else {
        livestatus = (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {game_details.status_short !== null && (
              <>
              <br/>
                <span style={{ color: "black", border: "All", textTransform: "capitalize", color: "black" }}>
                  {device ? game_details.status_short :
                    game_details.status_short=== "PEN"? "After Penalties" : game_details.status_short==="AET"? "After Extra Time": game_details.status_short==="WO" ? "Walk Over": game_details.status_short==="ABD"? "Match Abandoned" : game_details.status_long
                  }
                  </span><br />
              </>
            )}
          </span>
        );
      }
  
      livescores = (
        <span
          className="scores-card"
          id="fulltimeGoals"
          style={{
            color:
              game_details.status_short == "FT" || game_details.status_short == "AWD" ? "black" : "#B11111" ||
              game_details.status_short == "AET" ? "black" : "#B11111" ||
              game_details.status_short == "PEN" ? "black" : "#B11111",
            borderColor:
              game_details.status_short == "FT" || game_details.status_short == "AWD" ? "black" : "#B11111" ||
              game_details.status_short == "AET" ? "black" : "#B11111" ||
              game_details.status_short == "PEN" ? "black" : "#B11111" ||
              game_details.status_short == "WO" ? "black" : "#B11111"
          }}
        >
          {game_details.goals_home ? `${game_details.goals_home} - ${game_details.goals_away}` : null}
        </span>
      );
  
      live_scores_data_array.push(livestatus, livescores);
    } else if (["2H", "1H", "INT", "HT", "LIVE"].includes(game_details.status_short)) {
        livestatus = (
            <span style={{ color: "#B11111", fontWeight: "bold", border: "none" }}>
              <br />
              {game_details.status_short === "HT" || game_details.status_elapased === null || game_details.status_elapased === ""
                ? device ? game_details.status_short : game_details.status_long
                : game_details.status_elapased} {game_details.status_short === "HT" || game_details.status_elapased === null || game_details.status_elapased === ""
                  ? ""
                  : <span className="blink_text" style={{ color: "#B11111" }}>'</span>}
            </span>
          );
          
        livescores = (
        <span
          className="scores-card"
          id="fulltimeGoals"
          style={{
            fontWeight: "bold",
            border: "1px solid",
            color:
              ["2H", "1H", "INT", "HT", "LIVE"].includes(game_details.status_short) ? "#B11111" : "black"
          }}
        >
          {game_details.goals_home ? `${game_details.goals_home} - ${game_details.goals_away}` : null}
        </span>
      );
  
      live_scores_data_array.push(livestatus, livescores);

    } else if (["ET", "PE", "BT", "P"].includes(game_details.status_short)) {
      livestatus = (
        <span style={{ color: "#B11111", fontWeight: "bold", border: "none", marginBottom: "10px" }}>
          <br/>
          {device ?
            game_details.status_elapased === null || game_details.status_elapased === "" ? game_details.status_short : <>{game_details.status_short}<br/> {game_details.status_elapased} {game_details.status_elapased !== null && game_details.status_elapased !== "" && <span className="blink_text" style={{ color: "#B11111" }}>'</span>}</>
            :
            game_details.status_elapased === null || game_details.status_elapased === "" ? game_details.status_long : <>{game_details.status_long}<br/> {game_details.status_elapased} {game_details.status_elapased !== null && game_details.status_elapased !== "" && <span className="blink_text" style={{ color: "#B11111" }}>'</span>}</>
          }
          </span>
      );
  
      livescores = (
        <span
          className="scores-card"
          id="fulltimeGoals"
          style={{
            fontWeight: "bold",
            border: "1px solid",
            color: game_details.status_short === "ET" || game_details.status_short === "PE" || game_details.status_short ==="BT" || game_details.status_short === "P" ? "#B11111" : "black"
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