import React from "react";
import { useRouter } from 'next/router'
import { useState,useEffect } from "react";
import ComputedWinDrawings from "../functions/computed_win_lose_draw_drawing";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import { Adsense } from "@ctrl/react-adsense";
import InPagePreLoader from "../includes/inpagepreloader";

function Last6Matches(props){    
    let [home_team_matches, setHomeTeamMatches] = useState([]);
    let [away_team_matches, setAwayTeamMatches] = useState([]);
    const [loading1, setLoading1] = useState([]);
    const [loading2, setLoading2] = useState([]);

    const home_team_matches_array = [];

    const away_team_matches_array = [];
    const last_6matches_leagues_url = "https://api.pitchpredictions.com/api/fetch_last_6_matches_leagues";
    const [home_team_last6_matches_leagues, setHomeTeamLast6MatchesLeaguesArray] = useState([]);
    const [away_team_last6_matches_leagues, setAwayTeamLast6MatchesLeaguesArray] = useState([]);
    var home_team_last6_matches_leagues_display_array = [];
    var away_team_last6_matches_leagues_display_array = [];

    const headers =  {
        "Content-type": "application/json; charset=UTF-8", 
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    const [ homeTeamNum, setHomeTeamNum] = useState(10); // Default number of posts dislplayed
    const [ awayTeamNum, setAwayTeamNum] = useState(10); // Default number of posts dislplayed

    const [activeLeagueIdHome, setactiveLeagueIdHome] = useState(null);
    const [activeLeagueIdAway, setactiveLeagueIdAway] = useState(null);

    const router = useRouter(); //fetch page link data

    useEffect(()=>{ 
        setHomeTeamMatches(props.home_team_data);
        setAwayTeamMatches(props.away_team_data);
        
        
        if(router.isReady){       

            async function fetchHomeLast6MatchesLeaguesByTeamId() {
                // Show preloader
                setLoading1(true);

                try {
                    // Fetch fixtures 
                    const response2 = await fetch(last_6matches_leagues_url,{
                        method: 'POST',
                        body: JSON.stringify({home_team_id: props.home_team_id, fixture_date: props.fixture_date}),
                        headers: headers,
                    });
            
                    var data2 = await response2.json();  
                    
                    if(data2.status == true){
                        var last_6_m_data = data2.data;
                        
                        setHomeTeamLast6MatchesLeaguesArray(last_6_m_data);

                        const hasLeagueId = last_6_m_data.some(item => item.league_id === window.localStorage.getItem("active_league_id_home"));

                        if(hasLeagueId){
                            setactiveLeagueIdHome(window.localStorage.getItem("active_league_id_home"));
                        }else{
                            setactiveLeagueIdHome("all");
                        }
                    }     
                } catch (error) {
                    console.error(error);
                } finally {
                    // Hide preloader
                    setLoading1(false);
                }        
            }

        async function fetchAwayLast6MatchesLeaguesByTeamId() {
            // Show preloader
            setLoading2(true);

            try {
                // Fetch fixtures 
                const response2 = await fetch(last_6matches_leagues_url,{
                    method: 'POST',
                    body: JSON.stringify({home_team_id: props.away_team_id,fixture_date: props.fixture_date}),
                    headers: headers,
                });
        
                var data2 = await response2.json();  
                
                if(data2.status == true){
                    var last_6_m_data = data2.data;
                
                    setAwayTeamLast6MatchesLeaguesArray(last_6_m_data);

                    const hasLeagueId = last_6_m_data.some(item => item.league_id === window.localStorage.getItem("active_league_id_away"));

                    if(hasLeagueId){
                        setactiveLeagueIdAway(window.localStorage.getItem("active_league_id_away"));
                    }else{
                        setactiveLeagueIdAway("all");
                    }
                }    
            } catch (error) {
                console.error(error);
            } finally {
                // Hide preloader
                setLoading2(false);
            } 
        
        }
        
            fetchHomeLast6MatchesLeaguesByTeamId();

            fetchAwayLast6MatchesLeaguesByTeamId();
        }

     },[]);

     const filterHomeMatchesByLeagues = async(leagueId) => {
          // Show preloader
          setLoading1(true);
    
          try {
            // Fetch fixtures 
            const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league",{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.home_team_id, league_id:leagueId,fixture_date: props.fixture_date}),
                headers: headers,
            });

            var data1 = await response1.json();  

            if(data1.status == true){
                var h2h_data = data1.data;
                
                setHomeTeamMatches(h2h_data);
            }
            
            localStorage.setItem("active_league_id_home", leagueId);

            isActive = leagueId === activeLeagueIdHome;

            setactiveLeagueIdHome(leagueId)
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading1(false);
        }
     }

     const filterAwayMatchesByLeagues = async(leagueId) => {
        // Show preloader
        setLoading2(true);
    
        try {
            // Fetch fixtures 
            const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_last_six_matches_filtered_by_league",{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.away_team_id, league_id:leagueId,fixture_date: props.fixture_date}),
                headers: headers,
            });
    
            var data1 = await response1.json();  
    
            if(data1.status == true){
                var h2h_data = data1.data;
                    
                setAwayTeamMatches(h2h_data);
            }
    
            localStorage.setItem("active_league_id_away", leagueId);
    
            isActive = leagueId === activeLeagueIdAway;
    
            setactiveLeagueIdAway(leagueId);
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading2(false);
        }
    }    
    
   const allhomefixtureslast6matches = () => {
        // Show preloader
        setLoading1(true);
            
        try {
            setHomeTeamMatches(props.home_team_data);

            localStorage.setItem("active_league_id_home", "all");
            
            setactiveLeagueIdHome("all");
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading1(false);
        }
   }

   const allawayfixtureslast6matches = () => {
        setAwayTeamMatches(props.away_team_data);

        localStorage.setItem("active_league_id_away", "all");

        setactiveLeagueIdAway("all"); 
    }

    // form the dynamic url
    let url_name = "";

    if(home_team_matches.length>0){
        {home_team_matches.slice(0, homeTeamNum).map((hometeam_d, l) => {
            url_name = encodeURIComponent(hometeam_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+hometeam_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+hometeam_d.fixture_id),

            home_team_matches_array.push( 
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
                            <div style={{ fontWeight: props.home_team_id === hometeam_d.home_team_id ? "bold" : "" }}>{hometeam_d.home_team_name}</div>
                            <div  style={{fontWeight: hometeam_d.away_team_id  == props.home_team_id ? "bold" : ""}}>{hometeam_d.away_team_name}</div>
                        </div>
                        <div className="responsive-cell team-link-probability" style={{ whiteSpace: "nowrap" }}>
                            <span>{hometeam_d.goals_home} - {hometeam_d.goals_away}</span>
                            <br />
                            <span>({JSON.parse(hometeam_d.scores).halftime.home} - {JSON.parse(hometeam_d.scores).halftime.away})</span>
                        </div>
                        <div className="responsive-cell team-link-probability">{ComputedWinDrawings(props.home_team_id, hometeam_d.home_team_id, hometeam_d.away_team_id, hometeam_d.goals_home, hometeam_d.goals_away, l)}</div>
                    </div>
                </a>
                </React.Fragment>
            );
        })}        
    }    

    if(away_team_matches.length>0){
        {away_team_matches.slice(0, awayTeamNum).map((awayteam_d,m) => ( 
            url_name = encodeURIComponent(awayteam_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+awayteam_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+awayteam_d.fixture_id),

            away_team_matches_array.push(  
                <React.Fragment key={m}>
                <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">         
                 <div className="responsive-row fixturesTextSize matchDetailsLink" key={m}>
                    <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(awayteam_d.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                    <div className="responsive-cell team-link-probability">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                            src={awayteam_d.downloaded_league_logo}                           
                            className="league_image_logo"
                            alt={awayteam_d.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions"}
                            style={{ backgroundColor: "whitesmoke", marginRight: "10px" }}
                            loading="lazy"
                            />
                            <span>{awayteam_d.league_short_name}</span>
                        </div>
                    </div>
                    <div className="responsive-cell team-link" style={{textAlign: "left"}}>
                        <div style={{ fontWeight: props.away_team_id === awayteam_d.home_team_id ? "bold" : "" }}>{awayteam_d.home_team_name}</div>
                        <div  style={{fontWeight: awayteam_d.away_team_id  == props.away_team_id ? "bold" : ""}}>{awayteam_d.away_team_name}</div>
                    </div>
                    <div className="responsive-cell team-link-probability" style={{whiteSpace:"nowrap"}}>
                        <span>{awayteam_d.goals_home} - {awayteam_d.goals_away}</span><br/>
                        <span>({JSON.parse(awayteam_d.scores).halftime.home} - {JSON.parse(awayteam_d.scores).halftime.away})</span></div>
                    <div className="responsive-cell team-link-probability">{ComputedWinDrawings(props.away_team_id,awayteam_d.home_team_id,awayteam_d.away_team_id,awayteam_d.goals_home,awayteam_d.goals_away,m)}</div>
                </div>
                </a>
                </React.Fragment>
            )
        ))}             
     }

     let isActive = "";
     //League filters home
     if(home_team_last6_matches_leagues.length >1){
        for(let y =  0; y <home_team_last6_matches_leagues.length;y++){  
            const league = home_team_last6_matches_leagues[y];
            isActive = league.league_id === activeLeagueIdHome;

            home_team_last6_matches_leagues_display_array.push(
                <React.Fragment key={y}>
                    <li className="nav-item" id="leagueNavClick" style={{color: 'white',backgroundColor: isActive ? '#eb4d68' : 'transparent'}}  onClick={()=>filterHomeMatchesByLeagues(home_team_last6_matches_leagues[y].league_id)}>
                        <a id={home_team_last6_matches_leagues[y].league_id} className="nav-link link-light last6mhovereffects">{home_team_last6_matches_leagues[y].league_name}</a>
                    </li>
                </React.Fragment>
            )
        }
    }

    if(away_team_last6_matches_leagues.length >1){
        for(let j =  0; j < away_team_last6_matches_leagues.length;j++){  
            const league = away_team_last6_matches_leagues[j];
            isActive = league.league_id === activeLeagueIdAway;

            away_team_last6_matches_leagues_display_array.push(
                <React.Fragment key={j}>
                    <li className="nav-item" id="leagueNavClick" style={{color:"white", backgroundColor: isActive ? '#eb4d68' : 'transparent'}} onClick={()=>filterAwayMatchesByLeagues(away_team_last6_matches_leagues[j].league_id)}>
                        <a id={away_team_last6_matches_leagues[j].league_id} className="nav-link link-light last6mhovereffects">{away_team_last6_matches_leagues[j].league_name}</a>
                    </li>
                </React.Fragment>
            )
        }
    }

    function handleClick() {
        if(home_team_matches.length > homeTeamNum){
            setHomeTeamNum(prevHomeTeamNum => prevHomeTeamNum + 10) // 10 is the number of matches you want to load per click
        }else{
            setHomeTeamNum(6) // 6 is the number of matches you want to load per click
        }
    }

    function handleClickAway() {
        if(away_team_matches.length > awayTeamNum){
            setAwayTeamNum(prevAwayTeamNum => prevAwayTeamNum + 10) // 10 is the number of matches you want to load per click
        }else{
            setAwayTeamNum(6) // 6 is the number of matches you want to load per click
        }
    }

    return (
        <>
            {home_team_matches.length || away_team_matches.length >0 ? 
                <React.Fragment>          
                <div className="row">
                    {home_team_matches.length >0 ?
                    <div className="col-md-12 mb-2">
                        <div className="text-center fw-bold sectionTitle">
                            <span>LAST MATCHES: {props.home_team.toUpperCase()}</span><br/>                  
                        </div>
                    {/* <!-- Scroll Nav --> */}
                        <div className="responsive-row header matchdetailsheader">
                            <div className="flex-grow-1 w-100 o-hidden">
                                <ul className="nav nav-fill position-relative flex-nowrap ">
                                    <li id={home_team_last6_matches_leagues.length >1 ? "leagueNavClick" : ""} className="nav-item" style={{textAlign:"left", maxWidth: "15%", backgroundColor: activeLeagueIdHome =="all" ? "#eb4d68" : ""}}  onClick={allhomefixtureslast6matches}>
                                        <a className="nav-link link-light last6mhovereffects">All</a>
                                    </li>
                                    {home_team_last6_matches_leagues_display_array}
                                </ul>
                            </div>
                        </div>
                        <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>
                            <div className="responsive-cell team-link-probability">Date</div>
                            <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
                            <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
                            <div className="responsive-cell team-link-probability" style={{whiteSpace: "nowrap"}}>Score</div>
                            <div className="responsive-cell team-link-probability"></div>
                        </div>
                        {loading1 == true ? 
                            <InPagePreLoader/>
                         :home_team_matches_array
                         }
                        {loading1 == true ? "" :
                        home_team_matches.length > 10 ?
                            <div className="text-center">
                                <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClick}>
                                    {home_team_matches.length > homeTeamNum ? "Show More Matches" : "Show Less Matches"}
                                </button>                             
                            </div>
                            : <></>
                        }   
                        <br/>
                        <div className="text-center">
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7856848919"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        />   
                        </div>                   
                    </div>
                    :<></>
                    }                    
                    {away_team_matches.length > 0 ? 
                    <div className="col-md-12 mb-2">
                            <div className="text-center fw-bold sectionTitle">
                                <span>LAST MATCHES: {props.away_team.toUpperCase()}</span><br/>                
                            </div>
                            {/* <!-- Scroll Nav --> */}
                            <div className="responsive-row header matchdetailsheader">
                                <div className="flex-grow-1 w-100 o-hidden">
                                    <ul className="nav scrollable nav-fill position-relative flex-nowrap">
                                        <li id={away_team_last6_matches_leagues.length >1 ? "leagueNavClick" : ""} className="nav-item" style={{textAlign:"left",  maxWidth: "15%", backgroundColor: activeLeagueIdAway =="all" ? "#eb4d68" : ""}} onClick={allawayfixtureslast6matches}>
                                            <a className="nav-link link-light last6mhovereffects">All</a>
                                        </li>
                                        {away_team_last6_matches_leagues_display_array}                
                                    </ul>
                                </div>
                            </div>
                            <div className="responsive-row header fixturesTextSize" style={{cursor : "auto"}}>
                                <div className="responsive-cell team-link-probability">Date</div>
                                <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
                                <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
                                <div className="responsive-cell team-link-probability">Score</div>
                                <div className="responsive-cell team-link-probability"></div>
                            </div>
                        {loading2 == true ? 
                            <InPagePreLoader/>
                        :
                         away_team_matches_array
                        }   
                        {loading2 == true ? "" :
                        away_team_matches.length >10 ?      
                            <div className="text-center">
                                <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClickAway}>{away_team_matches.length > awayTeamNum ? "Show More Matches" : "Show Less Matches"}</button>                             
                            </div>
                            :<></>
                        }
                    </div>
                    : <></>
                    }
                </div>
        </React.Fragment>
        :<></>  }
        </>
    )
}

export default Last6Matches;