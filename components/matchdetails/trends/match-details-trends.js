import React from "react";
import WinningTrends from "./winning-trends";
import StreaksTrends from "./streak-trends";
import LosesTrends from "./loses-trends";
import CleanSheetTrends from "./cleansheet-trends";
import DrawsTrends from "./draws-trends";
import { hasDetailedTrendData } from "./trend_helpers";

function FixturesTrends(props) {
  const overallData = props.overallData || [];

  if (
    props.endpointStatus !== "success" ||
    overallData.length === 0 ||
    !hasDetailedTrendData(overallData)
  ) {
    return null;
  }

  return (
    <>
      <div className="row">
        <div className="text-center fw-bold sectionTitle">
          <span>MATCH TRENDS</span>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-6 col-6">
          <div className="text-center fw-bold my-custom-card">
            {overallData[0].home_team_name}
          </div>
        </div>
        <div className="col-md-6 col-6">
          <div className="text-center fw-bold my-custom-card">
            {overallData[0].away_team_name}
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          <WinningTrends overallData={overallData} url={props.url} />
          <CleanSheetTrends overallData={overallData} url={props.url} />
          <StreaksTrends overallData={overallData} url={props.url} />
          <DrawsTrends overallData={overallData} url={props.url} />
          <LosesTrends overallData={overallData} url={props.url} />
        </div>
      </div>
    </>
  );
}

export default FixturesTrends;
