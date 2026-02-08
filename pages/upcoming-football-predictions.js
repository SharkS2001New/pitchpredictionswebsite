import PreLoader from "../components/includes/loader";
import RenderData from "../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../components/includes/datanotfound";
import React from "react";
import { useRouter } from 'next/router'
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import FilterTodaysMatchesLiveUpcomingFinished from "../components/shared/filter-todays-matches-live-upcoming-finished";
import FilterUpcomingOverallDoubleChanceUnderOverHTFTPred1x2 from "../components/upcoming-football-predictions/filter-pred1x2-ov-un-dc-ht-ft";
import { Adsense } from "@ctrl/react-adsense";
import UpcomingFootballPredictionsContent from "../components/seo-content/mainpages/upcoming-football-predictions";

function UpcomingFixtures(){
    let todays_date = getFormattedCurrentDate();
    const router = useRouter(); //fetch page link data

    //Call the predictions function and process response data
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_incoming_fixtures?fixture_date="+todays_date);

    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions[0].endpointStatus === ""){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions[0].endpointStatus === "error"){

        return (
            <div className="sites-card">
                <DataNotFoundPage props = "We don't have any matches to show you right now, please try again later"/>
            </div>
        )

    }else{
        if(renderPredictions.length >0){
            return(
                <div className="sites-card">
                    <div className="container-fluid">
                        <div className="row" style={{backgroundColor: "#edf3f5"}}>
                            <div className="col-md-3 col-2"></div>
                                <div className="col-md-7 col-12">
                                    <FilterTodaysMatchesLiveUpcomingFinished url_filter={router.pathname.substring(1)} />
                                </div>
                            <div className="col-md-2 col-1"></div>
                        </div>
                        <div className="row" style={{backgroundColor: "#edf3f5"}}>
                            <div className="col-md-1 col-2"></div>
                            <div className="col-md-10 col-12">
                                <FilterUpcomingOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
                            </div>
                            <div className="col-md-1 col-1"></div>
                        </div>
                    </div>
                    <RenderData renderPredictions={renderPredictions}/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                    <br/>   
                    <div className="">
                        <div className="container">
                            <UpcomingFootballPredictionsContent/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default UpcomingFixtures;