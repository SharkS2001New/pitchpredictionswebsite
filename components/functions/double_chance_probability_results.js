function DoubleChanceProbabilityResults(game_details, winning_team, url) {
  let probability_results = "";

  // Get status from new API structure
  const statusShort = game_details.match?.status || game_details.status_short;
  const goalsHome = game_details.score?.home ?? game_details.goals_home;
  const goalsAway = game_details.score?.away ?? game_details.goals_away;

  // Determine if prediction was right or wrong
  if (statusShort === "NS" || statusShort === "HT" || statusShort === "2H" || statusShort === "1H" || statusShort === "INT" ||
      statusShort === "TBD" || statusShort === "LIVE" || statusShort === "BT" || statusShort === "ABD") {
    probability_results = (
      <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
        {winning_team}
      </span>
    );
  } else if (statusShort === "CANC" || statusShort === "PST") {
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
        {statusShort}
      </span>
    );
  } else if (statusShort === "FT" || statusShort === "AWD" || statusShort === "PEN" || statusShort === "AET") {
    if (Number.isInteger(parseInt(goalsHome)) && Number.isInteger(parseInt(goalsAway))) {
      if (
        (winning_team === "1X" &&
          (parseInt(goalsHome) >= parseInt(goalsAway) ||
            parseInt(goalsHome) === parseInt(goalsAway))) ||
        (winning_team === "X2" &&
          (parseInt(goalsAway) >= parseInt(goalsHome) ||
            parseInt(goalsHome) === parseInt(goalsAway))) ||
        (winning_team === "12" && parseInt(goalsHome) !== parseInt(goalsAway))
      ) {
        probability_results = (
          <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
            {winning_team}
          </span>
        );
      } else if (
        (winning_team === "1X" &&
          parseInt(goalsHome) < parseInt(goalsAway) &&
          parseInt(goalsAway) !== parseInt(goalsHome)) ||
        (winning_team === "X2" &&
          parseInt(goalsAway) < parseInt(goalsHome) &&
          parseInt(goalsAway) !== parseInt(goalsHome)) ||
        (winning_team === "12" && parseInt(goalsAway) === parseInt(goalsHome))
      ) {
        probability_results = (
          <span
            className="number-circle rounded-square"
            style={{
              backgroundColor: "white",
              border: "2px solid",
              borderColor: url && url.includes("jackpots") ? "black" : "red",
              color: url && url.includes("jackpots") ? "black" : "red",
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