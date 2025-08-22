import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";

function StreaksTrends(props) {

    const overallData = props.overallData;

    var streaksTrends = [];

    {overallData.map((overall_d, index) => (
        streaksTrends.push(
        <React.Fragment key={"s"+index}>
            <div className="row">   
                {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.biggest.streak.wins >  0 ? (
                    <div className="col-md-6">
                        <span className="badge bg-secondary">Streaks</span>
                        <p>
                            <span style={{fontWeight: "bold"}}>{overall_d.home_team_name}</span>  has won &nbsp;<span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.biggest.streak.wins}</span>
                            &nbsp;consecutive matches in <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>.
                         </p>
                    </div> 
                ) : ""}
                {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.biggest.streak.wins >  0 ? (
                    <div className="col-md-6">
                        <span className="badge bg-secondary">Streaks</span>
                        <p>
                            <span style={{fontWeight: "bold"}}>{overall_d.away_team_name}</span>  has won &nbsp;<span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.biggest.streak.wins}</span>
                             &nbsp;consecutive matches in <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>.
                        </p>
                    </div>
                ) : ""}
            </div>
        </React.Fragment>
        )
    ))}
    return streaksTrends;
}

export default StreaksTrends;