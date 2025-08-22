import React,{useEffect, useState} from "react";
import { useRouter } from 'next/router'
import TeamDetailsTop from "../../../components/teamdetails/team_details_top";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import SelectedMacthesPredDetails from "../../../components/shared/selected_matches_predictions_details";
import DataNotFoundPage from "../../../components/includes/datanotfound";
import getTeamsDetailsTop from "../../../components/teamdetails/functions/get_teams_details_top";
import fetchTeamsLast6Matches from "../../../components/teamdetails/functions/fetch_last_6_matches";
import FiltersTeamDetails from "../../../components/teamdetails/filters-on-teams-page";
import { Adsense } from "@ctrl/react-adsense";

function Teams(){
    const router = useRouter(); //fetch page link data
    const [isMobile, setIsMobile] = useState(false);
    const [teams_top_data,setTeamsTopData] = useState([]);
    const [team_last6_matches, setTeamLast6Matches] = useState([]);
    const [endpointStatus1, setEndPointStatus1] = useState("");

    const current_url = router.query['team-details'];
    let teamIdInteger = 0;
    
    if(router.isReady){
        teamIdInteger = parseInt(current_url.split("-").pop(), 10);
    }

    const team_details_top_url = "https://api.pitchpredictions.com/api/fetch_teams_details_top?team_id="+teamIdInteger;
    const team_matches_url = "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides";

    useEffect(()=>{ 
        if(router.isReady){
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);

            //Fetch teams details from database
            getTeamsDetailsTop(team_details_top_url).then(data =>{
                //if no data is found, redirect back to homepage
                if(data){
                    setTeamsTopData(data);

                    fetchTeamsLast6Matches(team_matches_url,teamIdInteger,data[0].unformated_date).then(data => {
                        if(data.status == true){
                            var matches_data = data.data;
                            
                            setTeamLast6Matches(matches_data);

                            setEndPointStatus1(data.message);
                        }else {
                            setEndPointStatus1(data.message);
                        }
                    });
                }else{
                    router.push('/', undefined, { 
                        statusCode: 301
                    })
                }
            })
        } 
    },[router]);

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }


    let todays_date = new Date().toISOString().split("T")[0];

    let renderPredictions = <SelectedMacthesPredDetails props={teams_top_data}/>
    
    let url_name = "";
    // form the dynamic url
    if(teams_top_data.length >0){
        url_name = encodeURIComponent((teams_top_data[0].home_team_id == teamIdInteger ? teams_top_data[0].home_team_name.replace(/\s+/g, '-').toLowerCase() : teams_top_data[0].away_team_name.replace(/\s+/g, '-').toLowerCase()) +'-'+teamIdInteger);
    }

    //If data is completly loaded. Display, Else, Show preloader
    if(endpointStatus1 ===""){
        return(
            <PreLoader/>
        ) 
    }else if(endpointStatus1 ==="error"){    
        return (<React.Fragment>
                    <div className="sites-card mb-2">
                        <TeamDetailsTop props={teams_top_data[0]} last_6_matches= {team_last6_matches} team_id={teamIdInteger}/>
                        <div className="row">
                            <div className="text-center fw-bold">
                                <h6><b>
                                    {
                                        teams_top_data[0].unformated_date === todays_date ? "Today's Match" :
                                        teams_top_data[0].unformated_date > todays_date ? "Upcoming Match" :
                                        teams_top_data[0].unformated_date < todays_date ? "Recent Match" : ""
                                    }
                                    </b>
                                </h6>                     
                            </div>
                        </div>
                        <RenderData renderPredictions={renderPredictions} isMobile = {isMobile} />

                        <FiltersTeamDetails url_filter = {router.pathname.substring(1)} match_url={url_name} league_type={teams_top_data[0].league_type}/>                        
                    </div>
                    <div className="sites-card">
                        <DataNotFoundPage props = "Sorry, there isn't enough data available to display at this time."/>
                        <br/>
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7856848919"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        /> 
                    </div>
                </React.Fragment>
            )

    }else if(endpointStatus1 ==="success"){
        if(teams_top_data.length >0){
            return (
                <React.Fragment>
                    <div className="sites-card mb-2">
                        <TeamDetailsTop props={teams_top_data[0]} last_6_matches= {team_last6_matches} team_id={teamIdInteger}/>
                        <div className="row">
                            <div className="text-center fw-bold">
                                <h2 className="sectionTitle">
                                    {
                                        teams_top_data[0].unformated_date === todays_date ? "Today's Match" :
                                        teams_top_data[0].unformated_date > todays_date ? "Upcoming Match" :
                                        teams_top_data[0].unformated_date < todays_date ? "Recent Match" : ""
                                    }
                                </h2>                     
                            </div>
                        </div>
                        <RenderData renderPredictions={renderPredictions} isMobile = {isMobile} />

                        <FiltersTeamDetails url_filter = {router.pathname.substring(1)} match_url={url_name} league_type={teams_top_data[0].league_type}/>                        
                    </div>
                    <div className="sites-card">
                        <DataNotFoundPage props = "Players data is coming soon."/>
                        <br/>
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="7856848919"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        /> 
                    </div>
                </React.Fragment>
            )       
        }else{
            return <PreLoader/>
        }
    }
}

export default Teams;