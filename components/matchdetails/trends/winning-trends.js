import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";

function WinningTrends(props) {

    const overallData = props.overallData;

    var winningTrends = [];

    {overallData.map((overall_d, index) => (
        winningTrends.push(
            <React.Fragment key={"w" + index}>
            <div className="row" key={index}>
              {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.wins.total > 0 && (
                <div className="col-md-6">
                    <span className="badge bg-success">Wins</span>
                  <p>
                    <span style={{ fontWeight: "bold" }}>{overall_d.home_team_name}</span> has won their last{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.wins.total}
                    </span>{" "}
                    <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span> matches,{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.wins.home}
                    </span>
                    &nbsp; at home and{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.away}
                    </span>{" "}
                    away.
                  </p>
                </div>
                 )}
              {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.total > 0 && (
                <div className="col-md-6">
                    <span className="badge bg-success">Wins</span>
                  <p>
                    <span style={{ fontWeight: "bold" }}>{overall_d.away_team_name}</span> has won their last{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.total}
                    </span>{" "}
                    <span style={{ fontWeight: "bold" }}>&nbsp;{overall_d.league_name}</span> matches,{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.home}
                    </span>
                    &nbsp; at home and{" "}
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.away}
                    </span>{" "}
                    away.
                  </p>
                </div>
              )}
            </div>
          </React.Fragment>          
        )
    ))}
        
    return winningTrends;
}

export default WinningTrends;  