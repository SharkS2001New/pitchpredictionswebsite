function StandingsFormWinLose(currentFormVals, key) {
  if (currentFormVals == null) {
    return null;
  }

  const formLetters = String(currentFormVals)
    .replace(/[^WDLwdl]/g, "")
    .toUpperCase();

  return formLetters.split("").map((letter, i) => {
    let backgroundColor = "";

    if (letter === "W") {
      backgroundColor = "green";
    } else if (letter === "D") {
      backgroundColor = "#ffb400";
    } else if (letter === "L") {
      backgroundColor = "red";
    } else {
      return null;
    }

    return (
      <span
        key={`${key}-${i}`}
        className="number-circle rounded-square m-1"
        style={{
          backgroundColor,
          color: "#fff",
          textAlign: "center",
          fontSize: "11px",
          display: "inline-block",
        }}
      >
        {letter}
      </span>
    );
  });
}

export default StandingsFormWinLose;
