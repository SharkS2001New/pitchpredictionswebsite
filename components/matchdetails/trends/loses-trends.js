import React from "react";
import { getTeamPerformance } from "./trend_helpers";

function LosesTrends(props) {
  const overallData = props.overallData;
  const losesTrends = [];

  overallData.forEach((overall_d, index) => {
    const performance = getTeamPerformance(overall_d);
    if (!performance) return;

    const homeLoses = performance.home?.league?.fixtures?.loses;
    const awayLoses = performance.away?.league?.fixtures?.loses;

    losesTrends.push(
      <React.Fragment key={"l" + index}>
        <div className="row">
          {homeLoses?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-danger">Lost</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has lost
                their last{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeLoses.total}</span> matches
                in the <span style={{ fontWeight: "bold" }}>{overall_d.league_name}</span>, with{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayLoses?.home ?? 0}</span>
                &nbsp;losses on their home ground and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayLoses?.away ?? 0}</span>{" "}
                when playing away.
              </p>
            </div>
          ) : null}
          {awayLoses?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-danger">Lost</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has lost
                their last{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayLoses.total}</span> matches
                in the <span style={{ fontWeight: "bold" }}>{overall_d.league_name}</span>, with{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayLoses.home ?? 0}</span>
                &nbsp;losses on their home ground and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayLoses.away ?? 0}</span>{" "}
                when playing away.
              </p>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  });

  return losesTrends;
}

export default LosesTrends;
