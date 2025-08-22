import React,{useEffect,useState} from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import DataNotFoundPage from "../includes/datanotfound";
import { Adsense } from "@ctrl/react-adsense";
import InPagePreLoader from "../includes/inpagepreloader";

function FetchUpcomingMatches(props) {
    const [upcoming_home_matches,setUpcomingHomeTeamMatches] = useState([]);
    const [upcoming_away_matches,setUpcomingAwayTeamMatches] = useState([]);
    const [ homeTeamNum, setHomeTeamNum] = useState(15); // Default number of posts dislplayed
    const [ awayTeamNum, setAwayTeamNum] = useState(15); // Default number of posts dislplayed
    const upcoming_home_matchesarray = [];
    const upcoming_away_matchesarray = [];
    const [endpointStatus,setEndPointStatus] = useState("");

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    useEffect(()=>{
        async function fetchUpcomingMatchesHome() {
            // Fetch fixtures 
            const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team",{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.home_team_id,fixture_date: props.fixture_date}),
                headers: headers,
            });
    
            var data1 = await response1.json();  
            
            setEndPointStatus(data1.message);

            if(data1.status == true){
                var upcomingmdata = data1.data;
                
                setUpcomingHomeTeamMatches(upcomingmdata);
            }       
        }
        fetchUpcomingMatchesHome();
        
        async function fetchUpcomingMatchesAway() {
            // Fetch fixtures 
            const response2 = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_away_team",{
                method: 'POST',
                body: JSON.stringify({away_team_id: props.away_team_id,fixture_date: props.fixture_date}),
                headers: headers,
            });
    
            var data2 = await response2.json();  

            setEndPointStatus(data2.message);

            
            if(data2.status == true){
                var upcomingmdata = data2.data;
        
                setUpcomingAwayTeamMatches(upcomingmdata);
            }       
        }

        fetchUpcomingMatchesAway();
    },[])

    let url_name= "";

    if(upcoming_home_matches.length >0) {
        {upcoming_home_matches.slice(0, homeTeamNum).map((hometeam_d,l) => (   
            url_name = encodeURIComponent(hometeam_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+hometeam_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+hometeam_d.fixture_id),

            upcoming_home_matchesarray.push( 
                <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">        
                    <div className="responsive-row fixturesTextSize matchDetailsLink" key={l}>
                        <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(hometeam_d.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left",whiteSpace:"pre-wrap",fontWeight: hometeam_d.home_team_name == props.home_team ? "bold" : ""}}>{hometeam_d.home_team_name}</div>
                        <div className="responsive-cell" style={{textAlign: props.isMobile==true ? "center" : "left"}}>-</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left",whiteSpace:"pre-wrap",fontWeight:hometeam_d.away_team_name == props.home_team ? "bold" : ""}}>{hometeam_d.away_team_name}</div>
                        <div className="responsive-cell team-link-probability">{hometeam_d.league_name}</div>
                    </div>     
                </a>                          
            )
        ))}
     
    }

    if(upcoming_away_matches.length >0) {
        {upcoming_away_matches.slice(0, awayTeamNum).map((awayteam_d,x) => (   
            url_name = encodeURIComponent(awayteam_d.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+awayteam_d.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+awayteam_d.fixture_id),

            upcoming_away_matchesarray.push(
                <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">         
                    <div className="responsive-row fixturesTextSize matchDetailsLink" key={x}>
                        <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(awayteam_d.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left",whiteSpace:"pre-wrap",fontWeight:awayteam_d.home_team_name == props.away_team ? "bold" : ""}}>{awayteam_d.home_team_name}</div>
                        <div className="responsive-cell" style={{textAlign: props.isMobile==true ? "center" : "left"}}>-</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left",whiteSpace:"pre-wrap",fontWeight:awayteam_d.away_team_name == props.away_team ? "bold" : ""}}>{awayteam_d.away_team_name}</div>
                        <div className="responsive-cell team-link-probability">{awayteam_d.league_name}</div>
                    </div>   
                </a>                                     
            )
        ))}
    }

    function handleClick() {
        if(upcoming_home_matches.length > homeTeamNum){
            setHomeTeamNum(prevHomeTeamNum => prevHomeTeamNum + 12) // 12 is the number of matches you want to load per click
        }else{
            setHomeTeamNum(12) // 12 is the number of matches you want to load per click
        }
    }

    function handleClickAway() {
        if(upcoming_away_matches.length > awayTeamNum){
            setAwayTeamNum(prevAwayTeamNum => prevAwayTeamNum + 8) // 6 is the number of matches you want to load per click
        }else{
            setAwayTeamNum(12) // 12 is the number of matches you want to load per click
        }
    }

    if(endpointStatus === ""){
        return <InPagePreLoader/>
    }else if(endpointStatus ==="error"){
        return (
            <>
            <DataNotFoundPage props = "Sorry, there isn't enough data available to display at this time."/><br/>
            </>
         )

    }else if(endpointStatus ==="success"){
        return (
        <React.Fragment>       
            <div className="row">
            {upcoming_home_matches.length > 0 || upcoming_away_matches.length >0 ?
                <div className="text-center fw-bold sectionTitle">
                    <span>UPCOMING MATCHES</span>
                </div>
            : <></>
            }
            {upcoming_home_matches.length >0 ? 
                <div className="col-md-12 col-lg-12 col-xl-12 align-items-center mb-2">
                <div className="text-center fw-bold sectionTitle">{props.home_team}</div>
                    <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>                       
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left"}}>Match</div>
                        <div className="responsive-cell"></div>
                        <div className="responsive-cell team-link-probability"></div>
                        <div className="responsive-cell team-link-probability">League</div>
                    </div>
                        {upcoming_home_matchesarray}
                    {upcoming_home_matches.length >15 ?
                        <div className="text-center mb-2">
                            <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClick}>{upcoming_home_matches.length > homeTeamNum ? "Show More Matches" : "Show Less Matches"}</button>                             
                        </div>
                        : <></>
                    }
                    <br/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="7856848919"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    />  
                    <br/>
                </div>               
            : <></>}    
  
            {upcoming_away_matches.length >0 ? 
            <div className="col-md-12 col-lg-12 col-xl-12 align-items-center">
                <div className="text-center fw-bold sectionTitle">{props.away_team}</div>               
                <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>                 
                    <div className="responsive-cell team-link-probability">Date</div>
                    <div className="responsive-cell team-link-probability" style={{textAlign:"left"}}>Match</div>
                    <div className="responsive-cell"></div>
                    <div className="responsive-cell team-link-probability"></div>
                    <div className="responsive-cell team-link-probability">League</div>       
                </div>             
                    {upcoming_away_matchesarray}                          
                    <br/>                                     
                {upcoming_away_matches.length >15 ?      
                    <div className="text-center">
                        <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClickAway}>{upcoming_away_matches.length > awayTeamNum ? "Show More Matches" : "Show Less Matches"}</button>                             
                    </div>
                    :<></>
                }
            </div>               
             : <></> }
        </div>   
        </React.Fragment>
        )
    }
}

export default FetchUpcomingMatches;