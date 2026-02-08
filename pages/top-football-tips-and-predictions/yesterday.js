import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import React from "react";
import { useRouter } from 'next/router'
import FiltersTopFootballPredictions from "../../components/shared/filters-top-football-predictions";
import FilterYesterdayTopOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/top-football-tips-and-predictions/yesterday/filter-pred1x2-ov-un-dc-ht-ft";
import { Adsense } from "@ctrl/react-adsense";

function TopFootballFixturesYesterday(){     
    const router = useRouter(); //fetch page link data
    let yesterdays_date = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

    //Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date="+yesterdays_date);

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
                <div className="row">
                    <div className="col-md-4 col-2"></div>
                    <div className="col-md-6 col-9 container">
                        <FiltersTopFootballPredictions url_filter={router.pathname.substring(1)} />
                    </div>
                    <div className="col-md-2 col-1"></div>
                </div>
                <div className="container-fluid">
                    <div className="row" style={{backgroundColor: "#edf3f5"}}>
                        <div className="col-md-1 col-2"></div>
                        <div className="col-md-10 col-12">
                            <FilterYesterdayTopOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
            </div>
        )
    }
}
export default TopFootballFixturesYesterday;