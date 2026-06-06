import React from "react";
import { getTeamPerformance } from "./trend_helpers";

function StreaksTrends(props) {
  const overallData = props.overallData;
  const streaksTrends = [];

  overallData.forEach((overall_d, index) => {
    const performance = getTeamPerformance(overall_d);
    if (!performance) return;

    const homeStreak = performance.home?.league?.biggest?.streak?.wins;
    const awayStreak = performance.away?.league?.biggest?.streak?.wins;

    streaksTrends.push(
      <React.Fragment key={"s" + index}>
        <div className="row">
          {homeStreak > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-secondary">Streaks</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has won{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeStreak}</span>
                &nbsp;consecutive matches in{" "}
                <span style={{ fontWeight: "bold" }}>{overall_d.league_name}</span>.
              </p>
            </div>
          ) : null}
          {awayStreak > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-secondary">Streaks</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has won{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayStreak}</span>
                &nbsp;consecutive matches in{" "}
                <span style={{ fontWeight: "bold" }}>{overall_d.league_name}</span>.
              </p>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  });

  return streaksTrends;
}

export default StreaksTrends;
