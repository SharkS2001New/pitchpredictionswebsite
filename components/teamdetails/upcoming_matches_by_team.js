import React,{useEffect,useState} from "react";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";
import DataNotFoundPage from "../includes/datanotfound";
import InPagePreLoader from "../includes/inpagepreloader";

function FetchUpcomingMatchesByTeam(props) {
    const [upcoming_matches,setUpcomingTeamMatches] = useState([]);
    const [matchesByteamNum, setUpcomingMNum] = useState(15); // Default number of posts dislplayed
    const upcoming_matchesarray = [];
    const [endpointStatus,setEndPointStatus] = useState("");

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    useEffect(()=>{
        async function fetchUpcomingMatchesByTeam() {
            // Fetch fixtures 
            const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_upcoming_matches_home_team",{
                method: 'POST',
                body: JSON.stringify({home_team_id: props.team_id,fixture_date: props.filter_date}),
                headers: headers,
            });
    
            var data1 = await response1.json();  
            
            setEndPointStatus(data1.message);

            if(data1.status == true){
                var upcomingmdata = data1.data;
                
                setUpcomingTeamMatches(upcomingmdata);
            }       
        }
        fetchUpcomingMatchesByTeam();
    
    },[props])

    let url_name = "";

    if(upcoming_matches.length >0) {
        {upcoming_matches.slice(0, matchesByteamNum).map((upcomingteam_m,l) => (  
            url_name = encodeURIComponent(upcomingteam_m.home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+upcomingteam_m.away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+upcomingteam_m.fixture_id),
 
            upcoming_matchesarray.push(           
                <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details">       
                    <div className="responsive-row fixturesTextSize matchDetailsLink" key={l}>
                        <div className="responsive-cell team-link-probability">{DateTimeToUsersTimezone(upcomingteam_m.date).split(' ')[0].replace(/^(\d{2})\/(\d{2})\/(\d{2})(\d{2})$/, '$1.$2.$4')}</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left",whiteSpace:"pre-wrap",fontWeight: upcomingteam_m.home_team_id == props.team_id ? "bold" : ""}}>{upcomingteam_m.home_team_name}</div>
                        <div className="responsive-cell" style={{textAlign:"left"}}>-</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign: "left",whiteSpace:"pre-wrap",fontWeight:upcomingteam_m.away_team_id == props.team_id ? "bold" : ""}}>{upcomingteam_m.away_team_name}</div>
                        <div className="responsive-cell team-link-probability">{upcomingteam_m.league_name}</div>
                    </div> 
                </a>                              
            )
        ))}
    
    }

    function handleClick() {
        if(upcoming_matches.length > matchesByteamNum){
            setUpcomingMNum(prevHomeTeamNum => prevHomeTeamNum + 12) // 12 is the number of matches you want to load per click
        }else{
            setUpcomingMNum(12) // 12 is the number of matches you want to load per click
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
        <div className="row">
            {upcoming_matches.length >0 ? 
                <div className="col-md-12 col-lg-12 col-xl-12 align-items-center">
                    <div className="text-center fw-bold sectionTitle">
                        <span>UPCOMING Matches</span>              
                    </div>
                <div className="col-md-12 col-lg-12 col-xl-12 align-items-center mb-3">
                    <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>                       
                        <div className="responsive-cell team-link-probability">Date</div>
                        <div className="responsive-cell team-link-probability" style={{textAlign:"left"}}>Match</div>
                        <div className="responsive-cell"></div>
                        <div className="responsive-cell team-link-probability"></div>
                        <div className="responsive-cell team-link-probability">League</div>
                    </div>
                        {upcoming_matchesarray}
                    {upcoming_matches.length >15 ?
                        <div className="text-center mb-2">
                            <button className="btn btn-link btn-sm fixturesTextSize" style={{color:"#B11111", fontWeight: "bold"}} onClick={handleClick}>
                                {upcoming_matches.length > matchesByteamNum ? "Show More Matches" : "Show Less Matches"}
                            </button>                         
                        </div>
                        : <></>
                    }
                </div>        
                </div>
            : <></>}    
            <br/>              
        </div>   
        )
    }
}

export default FetchUpcomingMatchesByTeam;