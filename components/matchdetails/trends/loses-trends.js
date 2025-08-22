import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";

function LosesTrends(props) {

    const overallData = props.overallData;

    var losesTrends = [];

    {overallData.map((overall_d, index) => (
        losesTrends.push(
        <React.Fragment key={"l"+index}>
            <div className="row">
                {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.total > 0 ? (
                    <div className="col-md-6">
                        <span className="badge bg-danger">Lost</span>
                        <p>
                            <span style={{fontWeight: "bold"}}>{overall_d.home_team_name}</span> has lost their last &nbsp;<span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.total}</span> matches in the <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>,
                             with <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.home}</span>
                            &nbsp;losses on their home ground and <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.away}</span> when playing away.
                        </p>
                    </div> 
                ) : ""}
                {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total > 0 ? ( 
                    <div className="col-md-6">
                        <span className="badge bg-danger">Lost</span>
                         <p>
                            <span style={{fontWeight: "bold"}}>{overall_d.away_team_name}</span> has lost their last <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total}</span>  matches in the <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>, with <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.home}</span>
                            &nbsp;losses on their home ground and <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.away}</span> when playing away.
                        </p>
                    </div>
                ) : ""}
            </div>
        </React.Fragment>
        )
    ))}   

    return losesTrends;
}

export default LosesTrends;