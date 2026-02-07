import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import React,{useState,useEffect} from "react";
import getFormattedCurrentDate from "../../components/functions/GetTodaysDate";
import { useRouter } from "next/router";
import { Adsense } from "@ctrl/react-adsense";
import PopularTips from "../../components/shared/popular_tips_display";
import Tips180Content from "../../components/seo-content/tips/tips180";

function CompetitorPredictions(){    
    const router = useRouter(); //access page url

    let todays_date = getFormattedCurrentDate();

    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date="+todays_date);

    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions[0].endpointStatus === ""){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions[0].endpointStatus === "error"){
        return (
            <div className="sites-card">
                <DataNotFoundPage props = "We don't have any matches to show you right now, please try again later"/>
                <br/>
            </div>
        )
    }else if(renderPredictions.length >0){
        return(
            <div className="sites-card">
                <PopularTips/>
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
                        <Tips180Content/>
                    </div>
                </div>
            </div>
        )
    }
}
export default CompetitorPredictions;