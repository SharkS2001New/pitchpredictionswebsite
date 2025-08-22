import DateTimeToUsersTimezone from "../../functions/DatetimeToUsersTimezone";
import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";
import DrawsTrendsText from "../../shared/trends-dynamic-text/draws-trends-text";

function DrawsTrends(props) {

    const overallData = props.overallData;

    var drawsTrends = [];
    let winningOdd = "";

    //coming from DrawsTrendsText.js function
    const has_draw_texts = DrawsTrendsText()["has_draw_texts"];
          
    const has_draw_text2s = DrawsTrendsText()["has_draw_text2s"];

    let randomIndex1 = "";
    let randomIndex2 = "";
    
    let has_draw_text = "";
    let has_draw_text2 = ""; 
 
    {overallData.map((overall_d, index) => (

        randomIndex1 = Math.floor(Math.random() * has_draw_texts.length),
        randomIndex2 = Math.floor(Math.random() * has_draw_text2s.length),

        has_draw_text = has_draw_texts[randomIndex1],
        has_draw_text2 = has_draw_text2s[randomIndex2],

        //get the winning odd
        winningOdd = WinningTeamAndOdd(overall_d.percent_pred_home.replace("%",""), overall_d.percent_pred_draw.replace("%",""), overall_d.percent_pred_away.replace("%",""), "")[0],

        drawsTrends.push(
        <React.Fragment key={"D"+index}>
            {winningOdd == "1" || winningOdd == "X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.total > 5 : JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.total > 5
             ? (
                JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.wins.total < 5 && JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.total < 5 ? (
                    // code to execute if the condition is true
                    <div className="row">
                        {props.url != "football-predictions/fixture/[match-details]" ? (
                                <div className="col-md-4">
                                <div className="my-custom-card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4 col-4">
                                            <img
                                                src={
                                                winningOdd == "1" || winningOdd == "X"
                                                    ? overall_d.home_team_logo
                                                    : overall_d.away_team_logo
                                                }
                                                alt={
                                                winningOdd == "1" || winningOdd == "X"
                                                    ? overall_d.home_team_name
                                                    : overall_d.away_team_name
                                                }
                                                className="img-fluid"
                                                width={55}
                                                height={55}
                                            />
                                            </div>
                                            <div className="col-md-8 col-8">
                                            <h6 style={{ fontWeight: "bold" }}>
                                                {winningOdd == "1" || winningOdd == "X"
                                                ? overall_d.home_team_name
                                                : overall_d.away_team_name}
                                            </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-warning text-light text-center">
                                        <h6 style={{marginTop: "10px", fontWeight: "bold"}}>
                                            Draws:{" "}
                                            {winningOdd == "1" || winningOdd == "X"
                                            ?  JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.total
                                            :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.total}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""   
                        )}
                    
                        <div className="col-md-8">
                            <p>
                                <span style={{fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? overall_d.home_team_name: overall_d.away_team_name}</span> has recorded <span style={{color:"red", fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? 
                                    JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.total :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.total}</span> draws in their recent <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>
                                    &nbsp;with&nbsp;
                                <span style={{fontWeight: "bold", color: "red"}}>
                                {winningOdd=="1" || winningOdd =="X" ?
                                    JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.draws.home: JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.home}</span>
                                    &nbsp;draws when playing at home and 
                                    <span style={{fontWeight: "bold", color: "red"}}> &nbsp;{JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.draws.away}</span> &nbsp;when playing away.
                                        {has_draw_text}
                                    <span style={{fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? overall_d.away_team_name: overall_d.home_team_name}</span>
                                        {has_draw_text2}
                            </p>
                            {props.url != "match/[match-details]/matches" ? (
                            <>
                            <p>
                                <a className="linkTxt" href={"match/football-predictions-" + 
                                encodeURIComponent(overall_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+overall_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+overall_d.fixture_id)+"/matches"}>
                                {" "}
                                {overall_d.home_team_name} - {overall_d.away_team_name}
                                </a>
                                &nbsp;&nbsp;
                                {DateTimeToUsersTimezone(overall_d.formatedDate)}
                            </p>
                            <p>
                                Prediction:{" "}
                                <span style={{ fontWeight: "bold" }}>
                                {winningOdd == "1"
                                    ? overall_d.home_team_name
                                    : winningOdd == "X"
                                    ? "Draw"
                                    : overall_d.away_team_name}
                                </span>
                            </p>
                            </>
                            ) : "" }
                        </div>
                    </div>
                  ) : (
                    // code to execute if the condition is false
                    <></>
                  )
                
            ) : ""              
        }
        </React.Fragment>
        )
    ))}

    return drawsTrends;
}

export default DrawsTrends;