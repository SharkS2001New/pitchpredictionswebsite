function DoubleChanceProbabilityResults(game_details, winning_team, url) {
    let probability_results = "";
  
    // Determine if prediction was right or wrong
    if (game_details.status_short === "NS" || game_details.status_short === "HT" || game_details.status_short === "2H" || game_details.status_short === "1H" || game_details.status_short === "INT" ||
      game_details.status_short === "TBD" || game_details.status_short === "LIVE" || game_details.status_short === "BT" || game_details.status_short === "ABD") {
      probability_results = (
        <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
          {winning_team}
        </span>
      );
    } else if (game_details.status_short === "CANC" || game_details.status_short === "PST") {
      probability_results = (
        <span
          className="number-circle rounded-square"
          style={{
            backgroundColor: "#ffb400",
            color: "black",
            fontWeight: "bold",
            fontSize: "12px",
            textTransform: "lowercase",
          }}
        >
          {game_details.status_short}
        </span>
      );
    } else if (game_details.status_short === "FT" || game_details.status_short === "AWD" || game_details.status_short === "PEN" || game_details.status_short === "AET") {
      if (Number.isInteger(parseInt(game_details.goals_home)) && Number.isInteger(parseInt(game_details.goals_away))) {
        if (
          (winning_team === "1X" &&
            (parseInt(game_details.goals_home) >= parseInt(game_details.goals_away) ||
              parseInt(game_details.goals_home) === parseInt(game_details.goals_away))) ||
          (winning_team === "X2" &&
            (parseInt(game_details.goals_away) >= parseInt(game_details.goals_home) ||
              parseInt(game_details.goals_home) === parseInt(game_details.goals_away))) ||
          (winning_team === "12" && parseInt(game_details.goals_home) !== parseInt(game_details.goals_away))
        ) {
          probability_results = (
            <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
              {winning_team}
            </span>
          );
        } else if (
          (winning_team === "1X" &&
            parseInt(game_details.goals_home) < parseInt(game_details.goals_away) &&
            parseInt(game_details.goals_away) !== parseInt(game_details.goals_home)) ||
          (winning_team === "X2" &&
            parseInt(game_details.goals_away) < parseInt(game_details.goals_home) &&
            parseInt(game_details.goals_away) !== parseInt(game_details.goals_home)) ||
          (winning_team === "12" && parseInt(game_details.goals_away) === parseInt(game_details.goals_home))
        ) {
          probability_results = (
            <span
              className="number-circle rounded-square"
              style={{
                backgroundColor: "white",
                border: "2px solid",
                borderColor: url.includes("jackpots") ? "black" : "red",
                color: url.includes("jackpots") ? "black" : "red",
              }}
            >
              {winning_team}
            </span>
          );
        }
      } else {
        probability_results = (
          <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
            {winning_team}
          </span>
        );
      }
    }
  
    return probability_results;
  }
  
  export default DoubleChanceProbabilityResults;
   