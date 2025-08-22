function BothTeamsToScore(game_details) {
    var probability_results = "";
  
    if (game_details.both_team_to_score !== null) {
      // Determine if prediction was right or wrong
      if (
        game_details.status_short === "NS" ||
        game_details.status_short === "HT" ||
        game_details.status_short === "2H" ||
        game_details.status_short === "1H" ||
        game_details.status_short === "INT" ||
        game_details.status_short === "TBD" ||
        game_details.status_short === "LIVE" ||
        game_details.status_short === "BT" ||
        game_details.status_short === "ABD"
      ) {
        // Yellow for in-progress matches
        probability_results = (
          <span
            className="number-circle rounded-square"
            style={{
              backgroundColor: "#ffb400",
              border: "2px solid",
              borderColor: "#ffb400",
              color: "white",
            }}
          >
            {capitalizeFirstLetter(game_details.both_team_to_score)}
          </span>
        );
      } else if (
        game_details.status_short === "CANC" ||
        game_details.status_short === "PST"
      ) {
        // Yellow with lowercase text for canceled or postponed matches
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
            {capitalizeFirstLetter(game_details.both_team_to_score)}
          </span>
        );
      } else if (
        game_details.status_short === "FT" ||
        game_details.status_short === "AWD" ||
        game_details.status_short === "PEN" ||
        game_details.status_short === "AET"
      ) {        
        // Check if goals_home and goals_away are not null
        if (game_details.goals_home !== null && game_details.goals_away !== null) {
          if (game_details.both_team_to_score === "Yes") {
            if(game_details.goals_home !== "0" && game_details.goals_away !== "0"){
                // Green for correct "yes" prediction
                probability_results = (
                  <span
                    className="number-circle rounded-square"
                    style={{
                      backgroundColor: "green",
                      border: "2px solid",
                      borderColor: "green",
                      color: "white",
                    }}>
                    {capitalizeFirstLetter(game_details.both_team_to_score)}
                  </span>
                );
            }else {
              // Red for incorrect "yes" prediction
              probability_results = (
                <span
                  className="number-circle rounded-square"
                  style={{
                    backgroundColor: "red",
                    border: "2px solid",
                    borderColor: "red",
                    color: "white",
                  }}>
                  {capitalizeFirstLetter(game_details.both_team_to_score)}
                </span>
              );
            }
          
          } else if (game_details.both_team_to_score === "No") {
            if(game_details.goals_home === "0" || game_details.goals_away === "0"){
              // Green for correct "no" prediction
              probability_results = (
                <span
                  className="number-circle rounded-square"
                  style={{
                    backgroundColor: "green",
                    border: "2px solid",
                    borderColor: "green",
                    color: "white",
                }}>
                  {capitalizeFirstLetter(game_details.both_team_to_score)}
                </span>
              );
            } else {
              // Red for incorrect "no" prediction
              probability_results = (
                <span
                  className="number-circle rounded-square"
                  style={{
                    backgroundColor: "red",
                    border: "2px solid",
                    borderColor: "red",
                    color: "white",
                  }}
                >
                  {capitalizeFirstLetter(game_details.both_team_to_score)}
                </span>
              );
            }
        }
      } else {
          // Yellow for unknown match status or missing data
          probability_results = (
            <span
              className="number-circle rounded-square"
              style={{
                backgroundColor: "#ffb400",
                border: "2px solid",
                borderColor: "#ffb400",
                color: "white",
              }}>
              {capitalizeFirstLetter(game_details.both_team_to_score)}
            </span>
          );
        }
      }
    } else {
      // Display "-" if there is no prediction available
      probability_results = "-";
    }
  
    return probability_results;
  }
    

export default BothTeamsToScore

function capitalizeFirstLetter(str) {
    if (str === "yes" || str === "no") {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    } else {
      return str; // Return the original string if it's not "yes" or "no."
    }
}