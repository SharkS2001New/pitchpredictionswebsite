import React,{useEffect, useState} from "react";
import { useRouter } from 'next/router';
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import { Adsense } from "@ctrl/react-adsense";
import InPagePreLoader from "../includes/inpagepreloader";

function H2HFixturesData(props){
    const router = useRouter(); //fetch page link data

    const [ postNum, setPostNum] = useState(10); // 10 matches displayed by default
    const [loading, setLoading] = useState([]);

    let total_wins;

    let home_wins;
    let draw_wins;
    let away_wins;    

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    const h2h_url = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures";
    const [h2h_match_details, setH2HMatchDetails] = useState([]);

    const h2h_url_by_league = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures_by_league";
    const [h2h_leagues_data, setH2HLeagues] = useState([]);

    const h2h_leagues_url = "https://api.pitchpredictions.com/api/fetch_h2h_league";

    var h2hmatchdetailslist = [];
    var leaguesdisplayList = [];

    const [activeLeagueIdH2H, setactiveLeagueIdH2H] = useState(null);


    useEffect(()=>{ 
        if(router.isReady){

            getH2HData(h2h_url);

            fetchH2HLeagues(h2h_leagues_url);
        }
     },[props]);


    async function getH2HData(url1) {
        // Show preloader
       setLoading(true);
       try {
            // Fetch fixtures 
            const response1 = await fetch(url1,{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.home_team_id, away_team_id: props.away_team_id, fixture_date: props.fixture_date}),
                headers: headers,
            });

            var data1 = await response1.json();  

            if(data1.status == true){
                var h2h_data = data1.data;
        
                setH2HMatchDetails(h2h_data);

                const hasLeagueId = h2h_data.some(item => item.league_id === window.localStorage.getItem("active_league_id_h2h"));

                if(hasLeagueId){
                    setactiveLeagueIdH2H(window.localStorage.getItem("active_league_id_h2h"));
                }else{
                    setactiveLeagueIdH2H("all");
                }
            }    
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading(false);
        }   
    }

    async function fetchH2HLeagues(url2) {
        // Fetch fixtures 
        const response1 = await fetch(url2,{
            method: 'POST',
            body: JSON.stringify({home_team_id: props.home_team_id, away_team_id:  props.away_team_id, fixture_date: props.fixture_date}),
            headers: headers,
        });

        var data1 = await response1.json();  

        if(data1.status == true){

            var h2h_leagues = data1.data;

            setH2HLeagues(h2h_leagues);            
        }
    }
    
    const filterByLeagues = async(leagueId) => {
        // Fetch fixtures 
        // Show preloader
        setLoading(true);
    
        try {
            const response1 = await fetch(h2h_url_by_league,{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.home_team_id, away_team_id:  props.away_team_id,league_id:leagueId,fixture_date: props.fixture_date}),
                headers: headers,
            });

            var data1 = await response1.json();  

            if(data1.status == true){
                var h2h_data = data1.data;
                
                setH2HMatchDetails(h2h_data);
            }

            localStorage.setItem("active_league_id_h2h", leagueId);

            isActive = leagueId === activeLeagueIdH2H;

            setactiveLeagueIdH2H(leagueId)
        } catch (error) {
            console.error(error);
        } finally {
            // Hide preloader
            setLoading(false);
        }
   }

   const allFixturesFilter = () => {
    getH2HData(h2h_url);

    localStorage.setItem("active_league_id_h2h", "all");
        
    setactiveLeagueIdH2H("all");
   }
   
   let url_name ="";
   //call method compute %
   ComputePercentages();

    if(h2h_match_details.length >0){ 
        {h2h_match_details.slice(0, postNum).map((h2h_match_d,q) => ( 
            url_name = encodeURIComponent(h2h_match_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+h2h_match_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+h2h_match_d.fixture_id),

            h2hmatchdetailslist.push(
            <React.Fragment key={q}>
            <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">         
            <div className="responsive-row fixturesTextSize matchDetailsLink">
                <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(h2h_match_d.match_date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                <div className="responsive-cell team-link-probability">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                        src={h2h_match_d.downloaded_league_logo}
                        className="h2h_image_logo"
                        alt={h2h_match_d.league_name.replace(/\s+/g, "-").toLowerCase() + "-football-predictions"}
                        style={{ backgroundColor: "whitesmoke", marginRight: "10px" }}
                        loading="lazy"
                        />
                        <span>{h2h_match_d.league_short_name}</span>
                    </div>
                </div>
                <div className="responsive-cell team-link" style={{textAlign: "left"}}>
                    <div style={{color: h2h_match_d.ft_goals_home>h2h_match_d.ft_goals_away ? "black" : "",
                        fontWeight: h2h_match_d.ft_goals_home>h2h_match_d.ft_goals_away ? "bold" : "",whiteSpace:"pre-wrap"}}>{h2h_match_d.home_team_name}</div>
                    <div style={{color: h2h_match_d.ft_goals_away>h2h_match_d.ft_goals_home ? "black" : "",
                        fontWeight: h2h_match_d.ft_goals_away>h2h_match_d.ft_goals_home ? "bold" : "",whiteSpace:"pre-wrap"}}>{h2h_match_d.away_team_name}</div>
                </div>
                <div className="responsive-cell" style={{ textAlign: "center" }}>{h2h_match_d.ft_goals_home}-{h2h_match_d.ft_goals_away}</div>
            </div>       
            </a>     
            </React.Fragment>
            )       
        ))}           
    }

    let isActive = "";
    if(h2h_leagues_data.length >1){
        for(let y =  0; y <h2h_leagues_data.length;y++){ 
            const league = h2h_leagues_data[y];
            isActive = league.league_id === activeLeagueIdH2H;

            leaguesdisplayList.push(
                <React.Fragment key={y}>
                    <li className="nav-item ullinks" id="leagueNavClick" style={{color:"white", backgroundColor: isActive ? '#eb4d68' : 'transparent'}} onClick={()=>filterByLeagues(h2h_leagues_data[y].league_id)} >
                        <a   className="nav-link link-light last6mhovereffects">{h2h_leagues_data[y].league_name}</a>
                    </li>
                </React.Fragment>
            )
        }
    }

    function handleClick() {
        if(h2h_match_details.length > postNum){
            setPostNum(prevPostNum => prevPostNum + 6) // 6 is the number of matches you want to load per click
        }else{
            setPostNum(6) // 6 is the number of matches you want to load per click
        }
    }

    function ComputePercentages(){
        if(h2h_match_details.length >0){
            total_wins = h2h_match_details[0].countHometeamWins + h2h_match_details[0].countDraws + h2h_match_details[0].countAwayTeamWins;

            home_wins =  Math.round(((h2h_match_details[0].countHometeamWins)/total_wins)*100) + "%";
            draw_wins =  Math.round(((h2h_match_details[0].countDraws)/total_wins)*100) +"%";
            away_wins =  Math.round(((h2h_match_details[0].countAwayTeamWins)/total_wins)*100) + "%";
        }    
    }

    return (
        <>
        {h2h_match_details.length >0 ?
        <React.Fragment>
            <div className="row">
                <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
            </div>  
                <div className="responsive-row header matchdetailsheader">
                    <div className="flex-grow-1 w-100 o-hidden">
                        <ul className="nav nav-fill position-relative flex-nowrap myUlLinks">
                            <li className="nav-item ullinks" id={h2h_leagues_data.length >1 ? "leagueNavClick" : ""} style={{textAlign:"left", maxWidth: "20%", backgroundColor: activeLeagueIdH2H =="all" ? "#eb4d68" : ""}}>
                                <a onClick={allFixturesFilter} className="nav-link link-light last6mhovereffects" >All</a>
                            </li>                      
                            {leaguesdisplayList} 
                        </ul>
                    </div>
                </div>     
                <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>
                    <div className="responsive-cell team-link-probability">Date</div>
                    <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
                    <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
                    <div className="responsive-cell">Score</div>
                </div>
                {loading == true ? 
                    <InPagePreLoader/>
                    :
                    h2hmatchdetailslist
                 }    
                 {loading == true ? "" : h2h_match_details.length >10 ?   
                    <div className="text-center mb-2">
                        <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClick}>{h2h_match_details.length>postNum ? "Show More Matches" : "Show Less Matches" }</button>                             
                    </div>   
                    :<></>
                }     
                <br/>
                <div className="text-center mb-2">
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    />          
                </div>  
            </React.Fragment>
            :<></> }
        </>
    )

}

export default H2HFixturesData;