import DateTimeToUsersTimezone from "../../functions/DatetimeToUsersTimezone";
import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";
import LosesTrendsText from "../../shared/trends-dynamic-text/loses-trends-text";

function LosesTrends(props) {

    const overallData = props.overallData;

    var losesTrends = [];
    let winningOdd = ""; 

    //coming from LosesTrendsText.js function
    const has_loses_texts = LosesTrendsText()["has_loses_texts"];
        
    const has_loses_text2s = LosesTrendsText()["has_loses_text2s"];

    let randomIndex1 = "";
    let randomIndex2 = "";
    
    let has_lose_text = "";
    let has_lose_text2 = ""; 

    {overallData.map((overall_d, index) => (
        randomIndex1 = Math.floor(Math.random() * has_loses_texts.length),
        randomIndex2 = Math.floor(Math.random() * has_loses_text2s.length),

        has_lose_text = has_loses_texts[randomIndex1],
        has_lose_text2 = has_loses_text2s[randomIndex2],

        //get the winning odd
        winningOdd = WinningTeamAndOdd(overall_d.percent_pred_home.replace("%",""), overall_d.percent_pred_draw.replace("%",""), overall_d.percent_pred_away.replace("%",""), "")[0],

        losesTrends.push(
        <React.Fragment key={"l"+index}>
        {winningOdd =="1" || winningOdd =="X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total > 5 : JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total > 5 ? (
          
          JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.wins.total < 5 || JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.wins.total < 5 ? (
           <>
            <div className="row">
                {props.url != "match/[match-details]/matches" ? (
                    <div className="col-md-4">
                    <div className="my-custom-card">
                        <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 col-4">
                            <img
                                src={
                                winningOdd == "1" || winningOdd == "X"
                                    ? overall_d.away_team_logo
                                    : overall_d.home_team_logo
                                }
                                alt={
                                winningOdd == "1" || winningOdd == "X"
                                    ? overall_d.away_team_name
                                    : overall_d.home_team_name
                                }
                                className="img-fluid"
                                width={55}
                                height={55}
                            />
                            </div>
                            <div className="col-md-8 col-8">
                            <h6 style={{fontWeight: "bold"}}>
                                {winningOdd == "1" || winningOdd == "X"
                                ? overall_d.away_team_name
                                : overall_d.home_team_name}
                            </h6>
                            </div>
                        </div>
                        </div>
                        <div className="card-footer bg-danger text-light text-center">
                        <h6 style={{marginTop: "10px", fontWeight: "bold"}}>
                            Lost:{" "}
                            {winningOdd == "1" || winningOdd == "X"
                            ?  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total
                            :  JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.total}
                        </h6>
                        </div>
                    </div>
                    </div>
                ) : ""}
              
               <div className="col-md-8">
               <p className="container">
                    <span style={{fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? overall_d.away_team_name: overall_d.home_team_name}</span> {has_lose_text} <span style={{fontWeight: "bold", color: "red"}}>{winningOdd =="1" || winningOdd =="X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.total : 
                    JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.total}</span> matches in the <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>, with <span style={{fontWeight: "bold", color: "red"}}>{winningOdd=="1" || winningOdd =="X" ?
                    JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.home: JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.home}</span>
                    &nbsp;losses on their home ground and <span style={{fontWeight: "bold", color: "red"}}>{winningOdd =="1" || winningOdd =="X" ?  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.fixtures.loses.away : JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.fixtures.loses.away}</span> 
                     &nbsp; {has_lose_text2}
                </p>
               {props.url != "match/[match-details]/matches" ? (
                <>
                    <p className="container">
                        <a className="linkTxt" href={"/match/football-predictions-" + 
                        encodeURIComponent(overall_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+overall_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+overall_d.fixture_id)+"/matches"}>
                        {" "}
                        {overall_d.home_team_name} - {overall_d.away_team_name}
                        </a>
                        &nbsp;&nbsp;
                        {DateTimeToUsersTimezone(overall_d.formatedDate)}
                    </p>
                    <p className="container">
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
                  ) : ""}
               </div>
           </div>
            <br/>
            </>
            ) : ""

        ) : ""
        
        }
        </React.Fragment>
        )
    ))}   

    return losesTrends;
}

export default LosesTrends;