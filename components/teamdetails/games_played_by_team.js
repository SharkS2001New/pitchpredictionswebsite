import React from "react";
import { useRouter } from 'next/router';
import { useState,useEffect } from "react";
import ComputedWinDrawings from "../functions/computed_win_lose_draw_drawing";
import Teamwinsdrawsloses from "../functions/Teamswinsdrawsloses";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import InPagePreLoader from "../includes/inpagepreloader";

function GamesPlayedByTeam(props){    
    let [team_matches, setTeamMatches] = useState([]);
    const [loading, setLoading] = useState([]);

    let total_wins;

    let home_wins;
    let draw_wins; 
    let away_wins;    

    const team_matches_array = [];

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    const last_6matches_leagues_url = "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues";
    const [teams_last6_matches_leagues, setTeamLast6MatchesLeaguesArray] = useState([]);
    var team_matches_leagues_display_array = [];

    const [ teamMatchesNum, setTeamMatchesNum] = useState(10); // Default number of posts dislplayed
    const [activeLeagueIdTeams, setactiveLeagueIdTeams] = useState(null);

    
    const router = useRouter(); //fetch page link data

    useEffect(()=>{ 
        setTeamMatches(props.props);        
        
        if(router.isReady){       

            //fetch filter leagues 
            async function fetchLeaguesForLast6MByTeamId() {
                // Show preloader
                setLoading(true);

                try {
                    // Fetch fixtures 
                    const response2 = await fetch(last_6matches_leagues_url,{
                        method: 'POST',
                        body: JSON.stringify({home_team_id: props.team_id, fixture_date: props.filter_date}),
                        headers: headers
                    });
            
                    var data2 = await response2.json();  
                    
                    if(data2.status == true){
                        var last_6_m_leagues_data = data2.data;

                        setTeamLast6MatchesLeaguesArray(last_6_m_leagues_data);
                    }             

                    const hasLeagueId = last_6_m_leagues_data.some(item => item.league_id === window.localStorage.getItem("active_league_id_teams"));

                    if(hasLeagueId){
                        setactiveLeagueIdTeams(window.localStorage.getItem("active_league_id_teams"));
                    }else{
                        setactiveLeagueIdTeams("all");
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    // Hide preloader
                    setLoading(false);
                }   
            }
            fetchLeaguesForLast6MByTeamId();
        }
     },[]);


     //filter by leagues
     const filterMatchesByLeagues = async(leagueId) => {
        // Show preloader
        setLoading(true);

        try {
            // Fetch fixtures 
            const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league",{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.team_id, league_id:leagueId,fixture_date: props.filter_date}),
                headers: headers
            });

            var data1 = await response1.json();  

            if(data1.status == true){
                var matches_data = data1.data;
                
                setTeamMatches(matches_data);
            }

            localStorage.setItem("active_league_id_teams", leagueId);

            isActive = leagueId === activeLeagueIdTeams;

            setactiveLeagueIdTeams(leagueId)
        } catch (error) {
            console.error(error); 
        } finally {
            // Hide preloader
            setLoading(false);
        }   
     }

   const allfixturesTeammatches = () => {
        // Show preloader
        setLoading(true);
                
        setTeamMatches(props.props);
        
        try {
            setTeamMatchesNum(8);

            localStorage.setItem("active_league_id_teams", "all");
                
            setactiveLeagueIdTeams("all");
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading(false);
        }
   }

   let res_ = Teamwinsdrawsloses(props.props,props.team_id);
   
   function ComputePercentages(){
        total_wins = res_[0]["won"] + res_[0]["draw"] + res_[0]["lost"];

        home_wins =  Math.round(((res_[0]["won"])/total_wins)*100) + "%";
        draw_wins =  Math.round(((res_[0]["draw"])/total_wins)*100) +"%";
        away_wins =  Math.round(((res_[0]["lost"])/total_wins)*100) + "%";
   }

    //call method compute %
    ComputePercentages();

    // let team_stats_c = TeamStatsComputations(props.props,props.team_id);
    let url_name = "";
    
    if(team_matches.length>0){
        {team_matches.slice(0, teamMatchesNum).map((hometeam_d,l) => (     
            url_name = encodeURIComponent(hometeam_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+hometeam_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+hometeam_d.fixture_id),
     
            team_matches_array.push(
                <React.Fragment key={l}>
                <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">        
                <div className="responsive-row fixturesTextSize matchDetailsLink">
                    <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(hometeam_d.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                    <div className="responsive-cell team-link-probability">
                    <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                            src={hometeam_d.downloaded_league_logo}                           
                            className="league_image_logo"
                            alt={hometeam_d.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions"}
                            style={{ backgroundColor: "whitesmoke", marginRight: "10px" }}
                            loading="lazy"
                            />
                            <span>{hometeam_d.league_short_name}</span>
                        </div>
                    </div>
                    <div className="responsive-cell team-link" style={{textAlign: "left"}}>
                        <div style={{fontWeight: props.team_id == hometeam_d.home_team_id ? "bold" : ""}}>{hometeam_d.home_team_name}</div>
                        <div style={{fontWeight: hometeam_d.away_team_id  == props.team_id ? "bold" : ""}}>{hometeam_d.away_team_name}</div>
                    </div>
                    <div className="responsive-cell team-link-probability" style={{whiteSpace:"nowrap"}}>
                        <span>{hometeam_d.goals_home} - {hometeam_d.goals_away}</span> <br/>
                        <span>({JSON.parse(hometeam_d.scores).halftime.home} - {JSON.parse(hometeam_d.scores).halftime.away})</span>
                    </div>
                    <div className="responsive-cell team-link-probability">{ComputedWinDrawings(props.team_id,hometeam_d.home_team_id,hometeam_d.away_team_id,hometeam_d.goals_home,hometeam_d.goals_away,l)}</div>
                </div>
                </a>
            </React.Fragment> 
            )
        ))}
    }     

    let isActive = "";
     //League filters home
     if(teams_last6_matches_leagues.length >1){
        for(let y =  0; y <teams_last6_matches_leagues.length;y++){  
            const league = teams_last6_matches_leagues[y];
            isActive = league.league_id === activeLeagueIdTeams;

            team_matches_leagues_display_array.push(
                <React.Fragment key={y}>
                    <li className="nav-item" id="leagueNavClick" style={{color:"white",backgroundColor: isActive ? '#eb4d68' : 'transparent'}} onClick={()=>filterMatchesByLeagues(teams_last6_matches_leagues[y].league_id)}>
                        <a id={teams_last6_matches_leagues[y].league_id} className="nav-link link-light last6mhovereffects">{teams_last6_matches_leagues[y].league_name}</a>
                    </li>
                </React.Fragment>
            )
        }
    }

    function handleClick() {
        if(team_matches.length > teamMatchesNum){
            setTeamMatchesNum(prevHomeTeamNum => prevHomeTeamNum + 10) // 10 is the number of matches you want to load per click
        }else{
            setTeamMatchesNum(10) // 10 is the number of matches you want to load per click
        }
    }

    return (
        <React.Fragment>        
            {team_matches.length >0 ?                
                <div className="row">
                    {team_matches.length >0 ?
                    <div className="col-md-12">
                        <div className="text-center fw-bold sectionTitle">
                            <span>{props.title}</span>                   
                        </div>
                    {/* <!-- Scroll Nav --> */}
                        <div className="responsive-row header matchdetailsheader">
                            <div className="flex-grow-1 w-100 o-hidden">
                                <ul className="nav nav-fill position-relative flex-nowrap">
                                    <li id={teams_last6_matches_leagues.length >1 ? "leagueNavClick" : ""} className="nav-item" style={{textAlign:"left",maxWidth: "15%",backgroundColor: activeLeagueIdTeams =="all" ? "#eb4d68" : ""}} onClick={allfixturesTeammatches}>
                                        <a className="nav-link link-light last6mhovereffects">All</a>
                                    </li>
                                    {team_matches_leagues_display_array}
                                </ul>
                            </div>
                        </div>
                        <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>
                            <div className="responsive-cell team-link-probability">Date</div>
                            <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
                            <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
                            <div className="responsive-cell team-link-probability">Score</div>
                            <div className="responsive-cell team-link-probability"></div>
                        </div>
                        {loading == true ? 
                        <InPagePreLoader/>
                        :team_matches_array}
                        {loading == true ? "" :
                        team_matches.length > 10 ?
                            <div className="text-center">
                            <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClick}>
                                {team_matches.length > teamMatchesNum ? "Show More Matches" : "Show Less Matches"}
                            </button>                             
                            </div>                            
                            : <></>
                        }    
                        <br/>
                        {loading == true ? "" :
                            <div className="container mt-0"> 
                                <div className="progress">
                                    <div className="progress-bar bg-success" style={{width: home_wins}}></div>
                                    <div className="progress-bar bg-warning" style={{width:draw_wins}}></div>
                                    <div className="progress-bar bg-danger" style={{width:away_wins}}></div>
                                </div>
                                <div className="progress fixturesTextSize" style={{backgroundColor:"white",height:"75px",fontWeight: "bold"}}>                            
                                    <div style={{width: home_wins}}>
                                        <p className="text-center"  style={{whiteSpace: "nowrap"}}>Win ({res_[0]["won"]})</p>
                                        <p className="text-center font-weight-bold">{home_wins}</p>
                                    </div>
                                    <div  style={{width:draw_wins}}>
                                        <p className="text-center" style={{whiteSpace: "nowrap"}}>Draw ({res_[0]["draw"]})</p>
                                        <p className="text-center">{draw_wins}</p>
                                    </div>
                                    <div style={{width:away_wins}}>
                                        <p className="text-center"  style={{whiteSpace: "nowrap"}}>Lost ({res_[0]["lost"]})</p>
                                        <p className="text-center">{away_wins}</p>
                                    </div>
                                </div>
                            </div>
                        }                  
                    </div>
                    :<></>
                    }
                </div>
          :<></>  }
          </React.Fragment>
    )
}

export default GamesPlayedByTeam;