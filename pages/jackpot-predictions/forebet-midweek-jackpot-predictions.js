import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import React from "react";
import { useRouter } from 'next/router'
import { Adsense } from "@ctrl/react-adsense";

function SportpesaMidweekJackpotPredictions(){
    const router = useRouter();
         
    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_jackpot_fixtures_by_name?jackpot_name=Sportpesa Midweek Jackpot");
         
    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions[0].endpointStatus === ""){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions[0].endpointStatus === "error"){
        return (
            <div className="sites-card">
                <DataNotFoundPage props = "Jackpot fixtures has not been updated. Please Check again later"/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                /> 
            </div>
            )
    }else{
        if(renderPredictions.length >0){
            return(
                <div className="sites-card">
                    <p className="text-center blink_me">Buy Premium Jackpot Predictions Now and Win a Bonus!!!&nbsp;</p>
                    <p className="text-center">
                        <a href="/auth/login" className="btn btn-danger btn-sm">Buy Premium Jackpot Now</a>
                    </p>
                    <RenderData renderPredictions={renderPredictions}/>
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    /> 
                </div>
            )
        }
    }
}
export default SportpesaMidweekJackpotPredictions;