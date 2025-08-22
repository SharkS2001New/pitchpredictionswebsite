import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";

function CleanSheetTrends(props){
    const overallData = props.overallData;

    var cleanSheetTrends = [];

    {/* clean sheet */}
    {overallData.map((overall_d, index) => (
        cleanSheetTrends.push(
            <React.Fragment key={"C"+index}>                 
                <div className="row">  
                    {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.total > 0 ? (
                        <div className="col-md-6">
                            <span className="badge bg-info">Clean Sheet</span>
                            <p>
                                <span style={{fontWeight: "bold"}}>{overall_d.home_team_name}</span> has managed to maintain a clean sheet in their last &nbsp;
                                <span style={{color:"red", fontWeight: "bold"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.total}</span> 
                                <span style={{fontWeight: "bold"}}>&nbsp;{overall_d.league_name}</span>,including <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.home} </span>
                                &nbsp;victories at home and <span style={{fontWeight: "bold", color: "red"}}> {JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.away}</span> away.
                            </p>
                        </div>
                    ) : ""}
                    {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.total > 0 ? (
                        <div className="col-md-6">
                        <span className="badge bg-info">Clean Sheet</span>                            
                        <p>
                            <span style={{fontWeight: "bold"}}>{overall_d.away_team_name}</span> has managed to maintain a clean sheet in their last &nbsp;
                            <span style={{color:"red", fontWeight: "bold"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.total}</span> 
                            <span style={{fontWeight: "bold"}}>&nbsp;{overall_d.league_name}</span>,including <span style={{fontWeight: "bold", color: "red"}}>{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.home} </span>
                            &nbsp;victories at home and <span style={{fontWeight: "bold", color: "red"}}> {JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.away}</span> away.
                        </p>
                        </div>
                    ) : ""}
                </div>
            </React.Fragment>
        )
    ))}    

    return cleanSheetTrends;
}

export default CleanSheetTrends;