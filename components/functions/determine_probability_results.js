function normalizeWinningTeam(winningTeam) {
  if (winningTeam === null || winningTeam === undefined || winningTeam === "") {
    return winningTeam;
  }

  const value = String(winningTeam).trim();

  if (value === "1" || value === "2") return value;
  if (value.toUpperCase() === "X") return "X";
  if (value === "1X" || value === "X2" || value === "12") return value;
  if (["Ov2.5", "OV25", "Over 2.5", "Over2.5"].includes(value)) return "Over2.5";
  if (["Un2.5", "UN25", "Under 2.5", "Under2.5"].includes(value)) return "Under2.5";

  return value;
}

function getMatchStatus(gameDetails) {
  return (
    gameDetails.match?.status ||
    gameDetails.status_short ||
    gameDetails.fixture?.status?.short ||
    gameDetails.status ||
    ""
  );
}

function getMatchScores(gameDetails) {
  const homeScore = gameDetails.score?.home ?? gameDetails.goals_home;
  const awayScore = gameDetails.score?.away ?? gameDetails.goals_away;

  return {
    homeScore: homeScore === null || homeScore === undefined ? null : Number(homeScore),
    awayScore: awayScore === null || awayScore === undefined ? null : Number(awayScore),
  };
}

function ProbabilityResults(game_details, winning_team) {
  const pick = normalizeWinningTeam(winning_team);
  const statusShort = getMatchStatus(game_details);
  const { homeScore, awayScore } = getMatchScores(game_details);

  const pendingStatuses = [
    "NS",
    "HT",
    "2H",
    "1H",
    "INT",
    "TBD",
    "LIVE",
    "BT",
    "ABD",
    "P",
  ];
  const finishedStatuses = ["FT", "AWD", "PEN", "AET", "WO"];
  const hasFinalScores =
    homeScore !== null &&
    awayScore !== null &&
    !Number.isNaN(homeScore) &&
    !Number.isNaN(awayScore);
  const isPendingOrLive = pendingStatuses.includes(statusShort);
  const isFinished =
    finishedStatuses.includes(statusShort) ||
    (hasFinalScores && !isPendingOrLive && statusShort !== "CANC" && statusShort !== "PST");

  const pendingBadge = (
    <span className="number-circle rounded-square" style={{ backgroundColor: "#ffb400" }}>
      {pick}
    </span>
  );

  if (isPendingOrLive) {
    return pendingBadge;
  }

  if (statusShort === "CANC" || statusShort === "PST") {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "#ffb400",
          color: "white",
          fontWeight: "bold",
          textTransform: "lowercase",
        }}
      >
        {pick}
      </span>
    );
  }

  if (!isFinished || !hasFinalScores) {
    return pendingBadge;
  }

  const totalGoals = homeScore + awayScore;

  if (pick === "1" && homeScore > awayScore) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "2" && awayScore > homeScore) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "X" && awayScore === homeScore) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "1" && (homeScore < awayScore || homeScore === awayScore)) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "2" && (awayScore < homeScore || awayScore === homeScore)) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "X" && awayScore !== homeScore) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "1X" && (homeScore > awayScore || homeScore === awayScore)) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "12" && (homeScore > awayScore || awayScore > homeScore)) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "X2" && (awayScore > homeScore || homeScore === awayScore)) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "1X" && !(homeScore > awayScore || homeScore === awayScore)) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "12" && !(homeScore > awayScore || awayScore > homeScore)) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "X2" && !(awayScore > homeScore || homeScore === awayScore)) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "Under2.5" && totalGoals <= 2) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "Over2.5" && totalGoals >= 3) {
    return (
      <span className="number-circle rounded-square" style={{ backgroundColor: "green" }}>
        {pick}
      </span>
    );
  }

  if (pick === "Under2.5" && totalGoals >= 3) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  if (pick === "Over2.5" && totalGoals <= 2) {
    return (
      <span
        className="number-circle rounded-square"
        style={{
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "red",
          color: "red",
        }}
      >
        {pick}
      </span>
    );
  }

  return pendingBadge;
}

export default ProbabilityResults;
