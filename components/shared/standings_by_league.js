import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import PreLoader from '../includes/loader';
import StandingsFormWinLose from '../functions/standings_win_lose_form';
import assignColorToDescription from '../functions/standing_description_color';
import { Adsense } from "@/components/shared/client-adsense";

function DisplayIndependentLeagueStandings(props) {
    const router = useRouter();

    const isHighlightedRow = (teamId) => {
      const route = router.pathname.substring(1);
    const isTeamStandings =
      route === "team/[team-details]/standings" &&
      props.home_team_id === teamId;
    const isMatchStandings =
      route === "match/[match-details]/standings" &&
      (props.home_team_id === teamId || props.away_team_id === teamId);

      return isTeamStandings || isMatchStandings;
    };
    
    if(props.props.length>0){
      //Decode halftime data stored as a json in mysql
      var standings = JSON.parse(props.props);
      let data_standings = standings[0];

      let groups = {};
      let groupNumber = "";
      
      const standingsTableList = data_standings.map((standing, i) => {
        groupNumber = groups[standing.description] || Object.keys(groups).length + 1;
        groups[standing.description] = groupNumber;

        return (
          <React.Fragment key={i}>
            <div 
              className="responsive-row"
              style={
                isHighlightedRow(data_standings[i].team.id)
                  ? { backgroundColor: "#FAEBD7"}
                  : { cursor: "auto" }
              }>
              <div
                className="responsive-cell team-link-standings">
              <span style={{backgroundColor: standing.description != null ? assignColorToDescription(standing.description)["color"] : "", color: standing.description != null ? "white" : "black"
              ,border: standing.description ? `1px solid ${assignColorToDescription(standing.description)["color"]}` : '', borderRadius: "5px"  }} title={standing.description}>&nbsp;{i + 1}.&nbsp;</span>
              </div>
              <div className="responsive-cell team-link" style={{ textAlign: "left" }}>
                <a href={encodeURI("/team/" + standing.team.name.toLowerCase().replace(/\s+/g, '-')+"-"+standing.team.id)+"/results"}>
                  {standing.team.name}
                </a>
              </div>
              {/* {standing.rank} */}
              <div className="responsive-cell">{standing.all.played}</div>
              <div className="responsive-cell">{standing.all.win}</div>
              <div className="responsive-cell">{standing.all.draw}</div>
              <div className="responsive-cell">{standing.all.lose}</div>
              <div className="responsive-cell">{standing.all.goals.for}</div>
              <div className="responsive-cell">{standing.all.goals.against}</div>
              <div className="responsive-cell">{standing.goalsDiff}</div>
              <div className="responsive-cell" style={{fontWeight: "bold"}}>{standing.points}</div>
              {/* Form column - desktop only */}
              {standing.form != null ?
                <div className="responsive-cell team-link-y hide-on-mobile" style={{ display: "flex" }}>
                  {StandingsFormWinLose(standing.form, i + 1)}
                </div>
                : <div className="responsive-cell team-link-y hide-on-mobile"></div>
              }
            </div>
            <br/>            
          </React.Fragment>
        );
      });
      
      const sortedHomeStandings = data_standings
        .sort((a, b) => (b.home.win * 3 + b.home.draw) - (a.home.win * 3 + a.home.draw))
        .map((standing, i) => (
          <React.Fragment key={i}>
            <div
              className="responsive-row"
              style={
                isHighlightedRow(data_standings[i].team.id)
                  ? { backgroundColor: "#FAEBD7"}
                  : { cursor: "auto" }
              }>
              <div className="responsive-cell team-link-standings" >
                {i + 1}.
              </div>{/* {standing.rank} */}
              <div className="responsive-cell team-link">
                <a href={encodeURI("/team/" + standing.team.name.toLowerCase().replace(/\s+/g, '-')+"-"+standing.team.id)+"/results"}>
                  {standing.team.name}
                </a>
              </div>
              <div className="responsive-cell">{standing.home.played}</div>
              <div className="responsive-cell">{standing.home.win}</div>
              <div className="responsive-cell">{standing.home.draw}</div>
              <div className="responsive-cell">{standing.home.lose}</div>
              <div className="responsive-cell">{standing.home.goals.for}</div>
              <div className="responsive-cell">{standing.home.goals.against}</div>
              <div className="responsive-cell">{standing.home.goals.for - standing.home.goals.against}</div>
              <div className="responsive-cell" style={{fontWeight: "bold"}}>{standing.home.win * 3 + standing.home.draw}</div>
              {/* Form column - desktop only */}
              {standing.form != null ?
                <div className="responsive-cell team-link-y hide-on-mobile" style={{ display: "flex" }}>
                  {StandingsFormWinLose(standing.form, i + 1)}
                </div>
                : <div className="responsive-cell team-link-y hide-on-mobile"></div>
              }            
            </div>             
          </React.Fragment>
        ));
     
      const sortedAwayStandings = data_standings
        .sort((a, b) => (b.away.win * 3 + b.away.draw) - (a.away.win * 3 + a.away.draw))
        .map((standing, i) => (
          <React.Fragment key={i}>
            <div
              className="responsive-row"
              style={
                isHighlightedRow(data_standings[i].team.id)
                  ? { backgroundColor: "#FAEBD7"}
                  : { cursor: "auto" }
              }
              >
              <div className="responsive-cell team-link-standings">
                {i + 1}.&nbsp;
              </div>{/* {standing.rank} */}
              <div className="responsive-cell team-link">
                <a href={encodeURI("/team/" + standing.team.name.toLowerCase().replace(/\s+/g, '-')+"-"+standing.team.id)+"/results"}>
                  {standing.team.name}
                </a>
                </div>
              <div className="responsive-cell">{standing.away.played}</div>
              <div className="responsive-cell">{standing.away.win}</div>
              <div className="responsive-cell">{standing.away.draw}</div>
              <div className="responsive-cell">{standing.away.lose}</div>
              <div className="responsive-cell">{standing.away.goals.for}</div>
              <div className="responsive-cell">{standing.away.goals.against}</div>
              <div className="responsive-cell">{standing.away.goals.for - standing.away.goals.against}</div>
              <div className="responsive-cell" style={{fontWeight: "bold"}}>{standing.away.win * 3 + standing.away.draw}</div>
              {/* Form column - desktop only */}
              {standing.form != null ?
                <div className="responsive-cell team-link-y hide-on-mobile" style={{ display: "flex" }}>
                  {StandingsFormWinLose(standing.form, i + 1)}
                </div>
                : <div className="responsive-cell team-link-y hide-on-mobile"></div>
              }           
            </div>
          </React.Fragment>
        ));

      const jsonColorDesc = assignColorToDescription(data_standings[0].description).colorWithName;
      const colors = jsonColorDesc.map(item => item.color);
      const descriptions = jsonColorDesc.map(item => item.description);
  
      return (
        <React.Fragment>
          {data_standings.length > 0 ? (
            <React.Fragment>
              <div className="fixturesTextSize">
                <div className="row">
                  <div className="text-center fw-bold">
                    <h2 className="text-center fw-bold sectionTitle">Overall Standings</h2>
                  </div>
                </div>
                <div className="responsive-wrapper">
                  <div className="responsive-row header standingsheader" style={{cursor : "auto"}}>
                    <div className="responsive-cell team-link-standings" title="Position">
                      POS
                    </div>
                    <div className="responsive-cell team-link" title="Team Name">
                      TEAM
                    </div>
                    <div className="responsive-cell" title="Matches Played">
                      MP
                    </div>
                    <div className="responsive-cell" title="Wins">
                      W
                    </div>
                    <div className="responsive-cell" title="Draw">
                      D
                    </div>
                    <div className="responsive-cell" title="Losses">
                      L
                    </div>
                    <div className="responsive-cell" title="Goals For">
                      GF
                    </div>
                    <div className="responsive-cell" title="Goals Against">
                      GA
                    </div>
                    <div className="responsive-cell" title="Goal Difference">
                      +/-
                    </div>
                    <div className="responsive-cell" title="Points">
                      PTS
                    </div>
                    {/* Form header - desktop only */}
                    {data_standings[0].form != null ?
                      <div className="responsive-cell team-link-y hide-on-mobile" title="Form"></div>
                      : <div className="responsive-cell team-link-y hide-on-mobile"></div>
                    }
                  </div>
                  {standingsTableList.length > 0 ? standingsTableList : ""}
                  {/** Just explain what color represent each Color */}
                  <br/>
                  <div className="responsive-row" style={{border: "none"}}>
                    <div className="responsive-cell team-link-average">
                      {colors.map((color, index) => (
                        <div key={index}>
                         <span
                            style={{
                              backgroundColor: color,
                              color: color,
                              border: `1px solid ${color}`,
                              fontSize: "11px",
                              display: "inline-block",
                            }}
                          >
                            &nbsp;1&nbsp;
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="responsive-cell text-left" style={{flexBasis: "100%", maxWidth: "100%", textAlign: "left"}}>
                      {descriptions.map((description, index) => (
                        <div key={index}>
                          {description}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/**The color represntative ends here */}
                  <br/>
                  <div className="responsive-wrapper">
                    <div className="responsive-cell" style={{flexBasis: "100%", maxWidth: "100%", textAlign: "left"}}>
                      <p style={{color: "black", fontWeight: "bold", marginLeft:"20px", marginRight: "20px"}}>When teams have an equal number of points, tiebreakers are determined by goal difference, number of victories, goals scored, and goals scored away.</p>
                    </div>
                  </div>
                </div>
                <br />
              </div>
              <br/>
              <Adsense
                  client="ca-pub-5665711413000284"
                  slot="7856848919"
                  style={{ display: "block" }}
                  layout="display"
                  format="auto"
              /> 
              <br/>
              <div className="fixturesTextSize">
                <h2 className="text-center fw-bold sectionTitle">Home Standings</h2>
                <div className="responsive-wrapper">
                  <div className="responsive-row header standingsheader" style={{cursor : "auto"}}>
                    <div className="responsive-cell team-link-standings" title="Position">
                      POS
                    </div>
                    <div className="responsive-cell team-link" title="Team Name">
                      TEAM
                    </div>                   
                    <div className="responsive-cell" title="Matches Played">
                      MP
                    </div>
                    <div className="responsive-cell" title="Wins">
                      W
                    </div>
                    <div className="responsive-cell" title="Draw">
                      D
                    </div>
                    <div className="responsive-cell" title="Losses">
                      L
                    </div>
                    <div className="responsive-cell" title="Goals For">
                      GF
                    </div>
                    <div className="responsive-cell" title="Goals Against">
                      GA
                    </div>
                    <div className="responsive-cell" title="Goal Difference">
                      +/-
                    </div>
                    <div className="responsive-cell" title="Points">
                      PTS
                    </div>
                    {/* Form header - desktop only */}
                    {data_standings[0].form != null ?
                      <div className="responsive-cell team-link-y hide-on-mobile" title="Form"></div>
                      : <div className="responsive-cell team-link-y hide-on-mobile"></div>
                    }
                  </div>
                  {sortedHomeStandings}
                </div>
              </div>
              <br/>
              <Adsense
                  client="ca-pub-5665711413000284"
                  slot="3850951453"
                  style={{ display: "block" }}
                  layout="display"
                  format="auto"
              />
              <br/> 
              <div className="fixturesTextSize">
                <h2 className="text-center fw-bold sectionTitle">Away Standings</h2>
                <div className="responsive-wrapper">
                  <div className="responsive-row header standingsheader" style={{cursor : "auto"}}>
                    <div className="responsive-cell team-link-standings" title="Position">
                      POS
                    </div>
                    <div className="responsive-cell team-link" title="Team Name">
                      TEAM
                    </div>                  
                    <div className="responsive-cell" title="Matches Played">
                      MP
                    </div>
                    <div className="responsive-cell" title="Wins">
                      W
                    </div>
                    <div className="responsive-cell" title="Draw">
                      D
                    </div>
                    <div className="responsive-cell" title="Losses">
                      L
                    </div>
                    <div className="responsive-cell" title="Goals For">
                      GF
                    </div>
                    <div className="responsive-cell" title="Goals Against">
                      GA
                    </div>
                    <div className="responsive-cell" title="Goal Difference">
                      +/-
                    </div>
                    <div className="responsive-cell" title="Points">
                      PTS
                    </div>
                    {/* Form header - desktop only */}
                    {data_standings[0].form != null ?
                      <div className="responsive-cell team-link-y hide-on-mobile" title="Form"></div>
                      : <div className="responsive-cell team-link-y hide-on-mobile"></div>
                    }
                  </div>
                  {sortedAwayStandings}
                </div>
              </div>
            </React.Fragment>
          ) : (
            ""
        )}
        <br/>
        </React.Fragment>
      );
    } else {
      return <PreLoader/>
    }
}   

export default DisplayIndependentLeagueStandings;