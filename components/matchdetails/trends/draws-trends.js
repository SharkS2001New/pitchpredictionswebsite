import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";

import React from "react";

function DrawsTrends(props) {

    const overallData = props.overallData;

    var drawsTrends = [];

    {overallData.map((overall_d, index) => (
        drawsTrends.push(
        <React.Fragment key={"D"+index}>
        <div className="row"> 
            {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.total > 0 ? (                 
            <div className="col-md-6">
                <span className="badge bg-warning">Draws</span>
                <p>
                    <span style={{fontWeight: "bold"}}>{overall_d.home_team_name}</span> has recorded <span style={{color:"red", fontWeight: "bold"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.total}</span>
                    &nbsp;draws with&nbsp;
                    <span style={{fontWeight: "bold", color: "red"}}>
                    {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.home}</span>
                        &nbsp; when playing at home and 
                        <span style={{fontWeight: "bold", color: "red"}}> &nbsp;{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.away}</span> &nbsp;when playing away.
                </p>
            </div>
            ) : ""}
            {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.total > 0 ? ( 
                <div className="col-md-6">
                    <span className="badge bg-warning">Draws</span>
                    <p>
                        <span style={{fontWeight: "bold"}}>{overall_d.away_team_name}</span> has recorded <span style={{color:"red", fontWeight: "bold"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.total}</span>
                        &nbsp; draws with&nbsp;
                        <span style={{fontWeight: "bold", color: "red"}}>
                        {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.home}</span>
                            &nbsp; when playing at home and 
                            <span style={{fontWeight: "bold", color: "red"}}> &nbsp;{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.away}</span> &nbsp;when playing away.
                   </p>
                </div>
            ) : ""  
            }                     
        </div>
                 
        </React.Fragment>
        )
    ))}

    return drawsTrends;
}

export default DrawsTrends;