import React from "react";
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import { useRouter } from 'next/router';
import DataNotFoundPage from "../../components/includes/datanotfound";
import FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/football-predictions/filter-pred1x2-ov-un-dc-ht-ft";
import { Adsense } from "@ctrl/react-adsense";

function FootballPredictionsByDate(){
    const router = useRouter(); //fetch page link data
        
    const filterdate = router.query;

    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_fixtures_by_date?fixture_date="+filterdate.filter_date);
    
    //If data is completly loaded. Display, Else, Show preloader
    if(renderPredictions[0].endpointStatus === ""){
        return(
            <PreLoader/>
        ) 
    }else if(renderPredictions[0].endpointStatus === "error"){

        return ( 
            <React.Fragment>
                <div className="sites-card">
                    <DataNotFoundPage props = "We don't have any matches to show you right now, please try again later"/>
                    <br/>
                </div>
            </React.Fragment>
        )

    }else{
        if(renderPredictions.length >0){
            return(
                <React.Fragment>
                    <div className="sites-card">
                        <div className="container-fluid">               
                            <div className="row" style={{backgroundColor: "#edf3f5"}}>
                                <div className="col-md-1 col-2"></div>
                                <div className="col-md-10 col-12">
                                    <FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} filter_date = {filterdate.filter_date}/>
                                </div>
                                <div className="col-md-1 col-1"></div>
                            </div>
                        </div>
                        <RenderData renderPredictions={renderPredictions} />
                        <br/>
                        <Adsense
                            client="ca-pub-5665711413000284"
                            slot="3850951453"
                            style={{ display: "block" }}
                            layout="display"
                            format="auto"
                        /> 
                        <br/> 
                    </div>
                </React.Fragment>
            )
        }
    }
  
}
export default FootballPredictionsByDate;