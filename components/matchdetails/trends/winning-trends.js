import React from "react";
import { getTeamPerformance } from "./trend_helpers";

function WinningTrends(props) {
  const overallData = props.overallData;
  const winningTrends = [];

  overallData.forEach((overall_d, index) => {
    const performance = getTeamPerformance(overall_d);
    if (!performance) return;

    const homeWins = performance.home?.league?.fixtures?.wins;
    const awayWins = performance.away?.league?.fixtures?.wins;

    winningTrends.push(
      <React.Fragment key={"w" + index}>
        <div className="row">
          {homeWins?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-success">Wins</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has won
                their last{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeWins.total}</span>{" "}
                <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span> matches,{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeWins.home}</span>
                &nbsp; at home and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeWins.away}</span> away.
              </p>
            </div>
          ) : null}
          {awayWins?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-success">Wins</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has won
                their last{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayWins.total}</span>{" "}
                <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span> matches,{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayWins.home}</span>
                &nbsp; at home and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayWins.away}</span> away.
              </p>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  });

  return winningTrends;
}

export default WinningTrends;
