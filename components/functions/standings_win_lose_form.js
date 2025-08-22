function StandingsFormWinLose(currentFormVals, key) {
  var formDrawing = [];

  if (currentFormVals != null) {
    for (let i = 0; i < currentFormVals.length; i++) {
      const letter = currentFormVals[i];

      if (letter === "W") {
        formDrawing.push(
          <div className="responsive-cell team-link-standings" key={key + i}>
            <span
              className="number-circle rounded-square m-1"
              style={{
                backgroundColor: "green",
                textAlign: "left",
                fontSize: "11px",
                display: "inline-block",
              }}
            >
              W
            </span>
          </div>
        );
      } else if (letter === "D") {
        formDrawing.push(
          <div className="responsive-cell team-link-standings" key={key + i}>
            <span
              className="number-circle rounded-square m-1"
              style={{
                backgroundColor: "#ffb400",
                textAlign: "left",
                fontSize: "11px",
                display: "inline-block",
              }}
            >
              D
            </span>
          </div>
        );
      } else if (letter === "L") {
        formDrawing.push(
          <div className="responsive-cell team-link-standings" key={key + i}>
            <span
              className="number-circle rounded-square m-1"
              style={{
                backgroundColor: "red",
                textAlign: "left",
                fontSize: "11px",
                display: "inline-block",
              }}
            >
              L
            </span>
          </div>
        );
      }
    }
  }

  return formDrawing;
}

export default StandingsFormWinLose;
