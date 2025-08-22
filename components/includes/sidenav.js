import React,{useState,useEffect} from 'react';
import { useRouter } from "next/router";
import jsonpopularLeagues from "../../public/jsonfiles/popular-leagues.json";
import jsonotherLeagues from "../../public/jsonfiles/other-leagues.json";
import jsonotherCompetitions from "../../public/jsonfiles/other-competitions.json";
import LeagusByCountryCollapsible from "./leagues_by_country_collapsible";
import GetLeagueId from '../functions/GetLeagueId';

function SideNavBar(){
    var router = useRouter();

    const openSidemenu = () =>{
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }

    const [pinnedLeagues, setPinnedLeagues] = useState([]);
    const [otherLeagues, setOtherLeagues] = useState([]);
    const [otherCompetions, setOtherCompetions] = useState([]);

    // const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the backend.sokapedia.com

    useEffect(()=>{
        //Fetch popular fixtures from the database
        getPinnedLeagues().then(data => {
            setPinnedLeagues(data);
        })

        //Fetch other fixtures from the database
        getOtherLeagues().then(data => {
            setOtherLeagues(data);
        })

        //fetch other competions from the database
        getOtherCompetions().then(data => {
            setOtherCompetions(data);
        })
    },[])

    let leagueId = GetLeagueId(router);

    let country_name = "";

    if(router.pathname.substring(1).includes("country/[football-prediction-for-country]")){
        if(router.isReady){
            const query_link = router.query["football-prediction-for-country"];
            const prefix = "football-predictions-for-";
            country_name = query_link.substring(prefix.length);
        }
    }
  
    // Fetch pinned leagues from local storage
    async function getPinnedLeagues() {
        try {
           //Fetch fixtures 
            // const response = await fetch("https://api.pitchpredictions.com/api/fetch_popular_leagues",{
            //     headers: headers
            // });
            // const data = await response.json();  
            // return data.data;

            const data = jsonpopularLeagues.data;

            return data;

        } catch (error) {
            console.error(error);
        // Handle error here, e.g. show a message to the user
        }
    }

    //Fetch other leagues
    async function getOtherLeagues() {
        try {
            // Fetch fixtures 
            // const response = await fetch("https://api.pitchpredictions.com/api/fetch_other_leagues",{
            //     headers: headers
            // });
            // const data = await response.json();  
            // return data.data;

            const data = jsonotherLeagues.data;
            return data;

        } catch (error) {
            console.error(error);
        // Handle error here, e.g. show a message to the user
        }
    }
    
    //Fetch other competions
    async function getOtherCompetions() {
        try {
            //Fetch fixtures 
            // const response = await fetch("https://api.pitchpredictions.com/api/fetch_other_competions",{
            //     headers: headers
            // });
            // const data = await response.json();  
            // return data.data;

            const data = jsonotherCompetitions.data;
            return data;

        } catch (error) {
            console.error(error);
        // Handle error here, e.g. show a message to the user
        }
    }  

    //Pinned leagues display
    var displayPinnedLeagues = [];
 
    if(pinnedLeagues != undefined){
        if(pinnedLeagues.length>0){
            for(var x = 0; x< pinnedLeagues.length;x++){
                displayPinnedLeagues.push( 
                <div className="d-flex align-items-center countryNameLink" key={x}>
                    &nbsp;
                    <div style={{height: "10%", width: "10%", objectFit: "contain"}}>
                        <img
                          src={pinnedLeagues[x]["downloaded_country_flag"]}
                          height="100%"
                          width="100%"
                          className="img-fluid"
                          alt={pinnedLeagues[x].country_name.replace(/\s+/g, '-').toLowerCase()+"-football-predictions"}
                          style={{ backgroundColor: "whitesmoke"}}
                          loading="lazy"/>
                    </div>
                    <a
                      href={encodeURI("/league/football-predictions-for-"+pinnedLeagues[x].country_name.toLowerCase()+"/"+pinnedLeagues[x].league_name.replace(/\s+/g, '-').toLowerCase())+'-'+pinnedLeagues[x].league_id+"/fixtures"}
                      className={`list-group-item list-group-item-action sideNavCustom1 border-none countryNameLink d-flex align-items-center ${"popular"+pinnedLeagues[x].league_id === "popular"+leagueId ? 'activeElement' : ''}`}
                      onClick={openSidemenu}  title={pinnedLeagues[x].league_name}>
                        {pinnedLeagues[x].league_name}
                    </a>
                </div>
                )
            }
        }
    }

    return(   
        <div className="" id="sidebar-wrapper"> 
            <div className="sideNavCustom">
                <div className="list-group list-group-flush">
                    <span className="list-group-item list-group-item-action p-1 sideNavCustom1" style={{backgroundColor: "#212830"}}></span>
                    <a href="/football-predictions-today" className={`list-group-item list-group-item-action p-1 sideNavCustom1 countryNameLink ${router.pathname.substring(1) === "football-predictions-today" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Football Predictions Today
                    </a>
                    <a href="/live-football-predictions" className={`list-group-item list-group-item-action p-1 sideNavCustom1 countryNameLink ${router.pathname.substring(1) === "live-football-predictions" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Live Football Predictions
                    </a>
                    <a href="/upcoming-football-predictions" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "upcoming-football-predictions" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Upcoming Football Predictions
                    </a>
                    <a href="/football-predictions-tomorrow" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "football-predictions-tomorrow" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Football Predictions Tomorrow
                    </a>
                    <a href="/football-predictions-weekend" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "football-predictions-weekend" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Football Predictions Weekend
                    </a>
                    <a href="/football-predictions-yesterday" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "football-predictions-yesterday" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Football Predictions Yesterday
                    </a>
                    <a href="/top-football-tips-and-predictions/today" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "top-football-tips-and-predictions/today"
                     || router.pathname.substring(1) === "top-football-tips-and-predictions/tomorrow" || router.pathname.substring(1) === "top-football-tips-and-predictions/yesterday"  ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Top Predictions (Top Picks)
                    </a>
                    <a href="/jackpot-predictions" className={`list-group-item list-group-item-action sideNavCustom1 p-1 countryNameLink ${router.pathname.substring(1) === "jackpot-predictions" ? "activeElement" : ""}`} onClick={openSidemenu}>
                        Jackpot Predictions
                    </a>
                    <div className="border-bottom" id="sidenavDynamicheader" style={{backgroundColor: "#202c3c", color: "white"}}>Top Leagues</div>
                    <div className="responsive-cell team-link">
                        {displayPinnedLeagues}
                    </div>
                    <div className="border-bottom" id="sidenavDynamicheader" style={{backgroundColor: "#202c3c", color: "white"}}>Countries</div>
                    <LeagusByCountryCollapsible other_leagues = {otherLeagues}  other_competions = {otherCompetions} leagueId = {leagueId} countryName= {country_name}/><br/>
                </div>
            <br/>
            </div>
        </div>
    )
}

export default SideNavBar;