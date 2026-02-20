import React,{useEffect,useState, useRef} from "react";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../../components/includes/datanotfound";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";
import FetchTopCountriesData from "../../../components/functions/FetchCountriesTopData";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import getFormattedCurrentDate from "../../../components/functions/GetTodaysDate";
import TodaysFixturesByCountry from "../../../components/countrydetails/todays-fixtures";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByCountry(){
    const router = useRouter(); //fetch page link data
    const [isMobile, setIsMobile] = useState(false);
    const [endpointStatus,setEndPointStatus] = useState("");
    const [countriesTopdata, setCountriesTopData] = useState("");
    const [todaysMatchesByCountry, setTodaysMatchesByCountry] = useState([]);

    let country_name = "";

    if(router.isReady){
        const query_link = router.query["football-prediction-for-country"];
        const prefix = "football-predictions-for-";
        country_name = query_link.substring(prefix.length);
    }

    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    //Generate todays date
    let todays_date = getFormattedCurrentDate();

    //Fetch todays data  by league id
    async function fetchTodaysFixturesByCountry() {
        // Fetch fixtures 
        const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_todays_fixtures_by_country_name?country_name="+country_name+"&fixture_date="+todays_date,{
            method: 'GET',
            headers: headers,
        });

        var data1 = await response1.json();  

        return data1;  
    }

    useEffect(()=>{
        if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
            //Determine screen size on mobile or desktop
            window.screen.width < 760 ? setIsMobile(true) : setIsMobile(false);
        }

        FetchTopCountriesData(country_name).then(data => {
            if(data.status == true){
                var top_data = data.data;

                setEndPointStatus(data.message);

                setCountriesTopData(top_data);

            }else{
                setEndPointStatus(data.message);
            }
        })

        //Fetch Todays matches by that country
        fetchTodaysFixturesByCountry().then(data => {
            if(data.status == true){
                var h2h_data = data.data;

                setTodaysMatchesByCountry(h2h_data);
            }
        })
    },[router.isReady])

    //Live football updates per every 30 seconds on todays matches page and live fixtures page
    const mounted = useRef(false);
    const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);

    useEffect(() => {
        // Set an initial value for the counter
        let count = 0;
        // Set up an interval to update the counter every 30 seconds
        const intervalId = setInterval(() => {
        // Update the counter
        count++;
        // Update the liveCounter state with the new count value
        setLiveUpdateCounter(count);
        }, 30000);
    
        // Fetch data on mount only after the first render
        if (mounted.current) {
            fetchTodaysFixturesByCountry().then(data => {    
            if (data.status === true) {
                setEndPointStatus(data.message);
                setTodaysMatchesByCountry(data.data);
            } else {
                setEndPointStatus(data.message);
                setTodaysMatchesByCountry(data);
            }
        });
        } else {
        mounted.current = true;
        }
    
        // Return a cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, [liveUpdateCounter]);

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }

    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_upcoming_fixtures_by_country?country_name="+country_name);

    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions.length ==0){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions.length > 0){

        return (   
            <React.Fragment>        
                <div className="sites-card mb-2">  
                    <CountriesDetailsTop props = {countriesTopdata[0]} />
                    
                    <FiltersCountriesDetails country_name={country_name} url_filter={router.pathname.substring(1)} />
                </div>
                <div className="sites-card">
                    <DataNotFoundPage props = "We don't have any matches for this country to show you right now, please try again later."/>
                    <br/>
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7624930534"
                                style={{ display: "block" }}
                                layout="display"
                                format="auto"
                            /> 
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

    }else{
        if(renderPredictions.length >0){ 
            return(
                <React.Fragment>       
                    <div className="sites-card mb-2">
                        <CountriesDetailsTop props = {countriesTopdata[0]}/>{/* Top details */}

                        <FiltersCountriesDetails country_name={country_name} url_filter={router.pathname.substring(1)} />
                    </div>
                    <TodaysFixturesByCountry todays_matches= {todaysMatchesByCountry} country_name = {country_name} isMobile= {isMobile}/>
                    <div className="sites-card">
                        <div className="desktop-container-resize mb-1">
                            <div className="col-sm-12 text-center bg-light pt-1">
                                <h2 className="sectionTitle">Upcoming Fixtures - {country_name}</h2>
                            </div>
                        </div> 
                        <RenderData renderPredictions={renderPredictions}  isMobile= {isMobile}/>
                        <br/>
                         <div className="desktop-container-resize mb-1">
                            <div className="col-sm-12 text-center bg-light pt-1">
                                <Adsense
                                    client="ca-pub-5665711413000284"
                                    slot="7624930534"
                                    style={{ display: "block" }}
                                    layout="display"
                                    format="auto"
                                /> 
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}
export default FootballPredictionsByCountry;