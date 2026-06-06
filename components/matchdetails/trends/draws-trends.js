import React from "react";
import { getTeamPerformance } from "./trend_helpers";

function DrawsTrends(props) {
  const overallData = props.overallData;
  const drawsTrends = [];

  overallData.forEach((overall_d, index) => {
    const performance = getTeamPerformance(overall_d);
    if (!performance) return;

    const homeDraws = performance.home?.league?.fixtures?.draws;
    const awayDraws = performance.away?.league?.fixtures?.draws;

    drawsTrends.push(
      <React.Fragment key={"D" + index}>
        <div className="row">
          {homeDraws?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-warning">Draws</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has recorded{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>{homeDraws.total}</span>
                &nbsp;draws with&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>{homeDraws.home}</span>
                &nbsp; when playing at home and
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {" "}
                  &nbsp;{awayDraws?.away ?? 0}
                </span>{" "}
                &nbsp;when playing away.
              </p>
            </div>
          ) : null}
          {awayDraws?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-warning">Draws</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has recorded{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>{awayDraws.total}</span>
                &nbsp; draws with&nbsp;
                <span style={{ fontWeight: "bold", color: "red" }}>{awayDraws.home}</span>
                &nbsp; when playing at home and
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {" "}
                  &nbsp;{awayDraws.away}
                </span>{" "}
                &nbsp;when playing away.
              </p>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  });

  return drawsTrends;
}

export default DrawsTrends;
