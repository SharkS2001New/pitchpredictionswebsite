import React,{useEffect,useState} from "react";
import PreLoader from "../../../components/includes/loader";
import RenderData from "../../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../../components/shared/pages_match_predictions_details";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../../components/includes/datanotfound";
import FiltersCountriesDetails from "../../../components/countrydetails/filters-countries-details";
import CountriesDetailsTop from "../../../components/countrydetails/country_top_details";
import FetchTopCountriesData from "../../../components/functions/FetchCountriesTopData";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByCountry(){
    const router = useRouter(); //fetch page link data
    const [isMobile, setIsMobile] = useState(false);
    const [endpointStatus,setEndPointStatus] = useState("");
    const [countriesTopdata, setCountriesTopData] = useState("");

    let country_name = "";

    if(router.isReady){
        const query_link = router.query["football-prediction-for-country"];
        const prefix = "football-predictions-for-";
        country_name = query_link.substring(prefix.length);
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
    })

    //Calculate the width on windows change detection
    function detectWindowSize() {
        window.innerWidth < 760 ? setIsMobile(true) : setIsMobile(false);        
    }

    if (router.isReady) { //Checking if router is ready prevents the page from loading without some data
        window.onresize = detectWindowSize;
    }

    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_results_fixtures_by_country?country_name="+country_name);


    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions[0].endpointStatus === ""){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions[0].endpointStatus === "error"){

        return (   
            <React.Fragment>        
                <div className="sites-card mb-2">                 
                    <CountriesDetailsTop props = {countriesTopdata[0]}/>{/* Top details */}
                    
                    <FiltersCountriesDetails country_name={country_name} url_filter={router.pathname.substring(1)}/>
                </div>
                <div className="sites-card">                       
                    <DataNotFoundPage props = "We don't have any matches for this country to show you right now, please try again later."/>
                    <br/>
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7856848919"
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
                       
                        <FiltersCountriesDetails country_name={country_name} url_filter={router.pathname.substring(1)}/>
                    </div>
                    <div className="sites-card">
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