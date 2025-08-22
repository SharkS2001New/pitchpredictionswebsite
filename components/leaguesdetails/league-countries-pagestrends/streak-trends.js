import DateTimeToUsersTimezone from "../../functions/DatetimeToUsersTimezone";
import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";
import StreaksTrendsText from "../../shared/trends-dynamic-text/streaks-trends-text";

function StreaksTrends(props) {

    const overallData = props.overallData;

    var streaksTrends = [];
    let winningOdd = "";

    //coming from StreaksTrendsText.js function
    const has_streaks_texts = StreaksTrendsText()["has_streaks_texts"];
      
    const has_streaks_text2s = StreaksTrendsText()["has_streaks_text2s"];            
      
    let randomIndex1 = ""; 
    let randomIndex2 = "";
    
    let has_streak_text = "";
    let has_streak_text2 = ""; 


    {overallData.map((overall_d, index) => (
        randomIndex1 = Math.floor(Math.random() * has_streaks_texts.length),
        randomIndex2 = Math.floor(Math.random() * has_streaks_text2s.length),

        has_streak_text = has_streaks_texts[randomIndex1],
        has_streak_text2 = has_streaks_text2s[randomIndex2],

        //get the winning odd
        winningOdd = WinningTeamAndOdd(overall_d.percent_pred_home.replace("%",""), overall_d.percent_pred_draw.replace("%",""), overall_d.percent_pred_away.replace("%",""), "")[0],

        streaksTrends.push(
        <React.Fragment key={"s"+index}>
            {winningOdd == "1" || winningOdd == "X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.biggest.streak.wins > 5 : JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.biggest.streak.wins > 5 ? (
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
                            <div className="card-footer bg-info text-light text-center">
                                <h6 style={{marginTop: "10px", fontWeight: "bold"}}>
                                    Streaks:{" "}
                                    {winningOdd == "1" || winningOdd == "X"
                                    ?  JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.biggest.streak.wins
                                    :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.biggest.streak.wins}
                                </h6>
                            </div>
                        </div>
                    </div>
                ) : ""}
            
                <div className="col-md-8">
                    <p>
                        <span style={{fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? overall_d.home_team_name: overall_d.away_team_name}</span>  has won <span style={{fontWeight: "bold", color: "red"}}>{winningOdd =="1" || winningOdd =="X" ? 
                        JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.biggest.streak.wins :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.biggest.streak.wins}</span> {has_streak_text} <span style={{fontWeight: "bold"}}>{overall_d.league_name}</span>,
                        {has_streak_text2}
                  </p>
                  {props.url != "match/[match-details]/matches" ? (
                    <>
                        <p>
                            <a className="linkTxt" href={"/match/football-predictions-" + 
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
                    ) : ""}
                </div>
            </div>
            <br/>
            </>
        ) : ""            
        }
        </React.Fragment>
        )
    ))}
    return streaksTrends;
}

export default StreaksTrends;