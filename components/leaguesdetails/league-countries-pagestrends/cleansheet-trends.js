import DateTimeToUsersTimezone from "../../functions/DatetimeToUsersTimezone";
import WinningTeamAndOdd from "../../functions/determine_winning_team_and_odd";
import React from "react";
import CleansheetText from "../../shared/trends-dynamic-text/cleansheet-trends-text";

function CleanSheetTrends(props){
    const overallData = props.overallData;

    var cleanSheetTrends = [];
    let winningOdd = "";

     //coming from CleansheetTrendsText.js function
     const has_cleansheet_texts = CleansheetText()["has_cleansheet_texts"];
      
     const has_cleansheet_text2s = CleansheetText()["has_cleansheet_text2s"];            
       
     let randomIndex1 = "";
     let randomIndex2 = "";
     
     let has_cleans_text = "";
     let has_cleans_text2 = ""; 

    {/* clean sheet */}
    {overallData.map((overall_d, index) => (
        randomIndex1 = Math.floor(Math.random() * has_cleansheet_texts.length),
        randomIndex2 = Math.floor(Math.random() * has_cleansheet_text2s.length),

        has_cleans_text = has_cleansheet_texts[randomIndex1],
        has_cleans_text2 = has_cleansheet_text2s[randomIndex2],

        //get the winning odd
        winningOdd = WinningTeamAndOdd(overall_d.percent_pred_home.replace("%",""), overall_d.percent_pred_draw.replace("%",""), overall_d.percent_pred_away.replace("%",""), "")[0],

        cleanSheetTrends.push(
            <React.Fragment key={"C"+index}>
            {winningOdd =="1" || winningOdd =="X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.total > 5 : JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.total > 5 ? (
                <>                   
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
                                      <h6 style={{fontWeight: "bold"}}>
                                          {winningOdd == "1" || winningOdd == "X"
                                          ? overall_d.home_team_name
                                          : overall_d.away_team_name}
                                      </h6>
                                      </div>
                                  </div>
                              </div>
                              <div className="card-footer bg-success text-light text-center">
                                  <h6 style={{marginTop: "10px",fontWeight: "bold"}}>
                                      Clean Sheet:{" "}
                                      {winningOdd == "1" || winningOdd == "X"
                                      ?  JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.total
                                      :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.total}
                                  </h6>
                              </div>
                          </div>
                      </div>
                    
                    ) : ""}
                  
                    <div className="col-md-8">
                        <p className="container">
                            <span style={{fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? overall_d.home_team_name: overall_d.away_team_name}</span> {has_cleans_text} &nbsp;
                            <span style={{color:"red", fontWeight: "bold"}}>{winningOdd =="1" || winningOdd =="X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.total :  JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.total}</span> 
                            <span style={{fontWeight: "bold"}}>&nbsp;{overall_d.league_name}</span>,including <span style={{fontWeight: "bold", color: "red"}}>{winningOdd=="1" || winningOdd =="X" ?
                                JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.home: JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.home} </span>
                                &nbsp;victories at home and <span style={{fontWeight: "bold", color: "red"}}> {winningOdd=="1" || winningOdd =="X" ? JSON.parse(overall_d.teams_perfomance_per_fixture).home.league.clean_sheet.away : JSON.parse(overall_d.teams_perfomance_per_fixture).away.league.clean_sheet.away}</span> away.
                                {has_cleans_text2}
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
            }
            </React.Fragment>
        )
    ))}    

    return cleanSheetTrends;
}

export default CleanSheetTrends;