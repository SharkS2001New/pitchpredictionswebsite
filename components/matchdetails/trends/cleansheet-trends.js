import React from "react";
import { getTeamPerformance } from "./trend_helpers";

function CleanSheetTrends(props) {
  const overallData = props.overallData;
  const cleanSheetTrends = [];

  overallData.forEach((overall_d, index) => {
    const performance = getTeamPerformance(overall_d);
    if (!performance) return;

    const homeCleanSheets = performance.home?.league?.clean_sheet;
    const awayCleanSheets = performance.away?.league?.clean_sheet;

    cleanSheetTrends.push(
      <React.Fragment key={"C" + index}>
        <div className="row">
          {homeCleanSheets?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-info">Clean Sheet</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has managed
                to maintain a clean sheet in their last{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>{homeCleanSheets.total}</span>
                <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span>, including{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeCleanSheets.home}</span>
                &nbsp;victories at home and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{homeCleanSheets.away}</span> away.
              </p>
            </div>
          ) : null}
          {awayCleanSheets?.total > 0 ? (
            <div className="col-md-6">
              <span className="badge bg-info">Clean Sheet</span>
              <p>
                <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has managed
                to maintain a clean sheet in their last{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>{awayCleanSheets.total}</span>
                <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span>, including{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayCleanSheets.home}</span>
                &nbsp;victories at home and{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>{awayCleanSheets.away}</span> away.
              </p>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  });

  return cleanSheetTrends;
}

export default CleanSheetTrends;
