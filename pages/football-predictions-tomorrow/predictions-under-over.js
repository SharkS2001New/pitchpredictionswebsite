import React,{useState,useEffect} from "react";
import { useRouter } from 'next/router';
import PreLoader from "../../components/includes/loader";
import RenderData from "../../components/shared/render_fixtures_data";
import FormatedDate from "../../components/functions/format_date_function";
import PagesMatchPredictionDetails from "../../components/shared/pages_match_predictions_details";
import DataNotFoundPage from "../../components/includes/datanotfound";
import getGithubSiteContent from "../../components/functions/GithubPagesContent";
import SeoContentDisplay from "../../components/shared/seo_content_display";
import FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2 from "../../components/football-predictions-tomorrow/filter-pred1x2-ov-un-dc-ht-ft";
import { Adsense } from "@ctrl/react-adsense";

function TommorrowFixtures(){
    const [seo_content, setSeoContent] = useState([]);
    const tommorrows_date = FormatedDate(1);
    const router = useRouter(); //fetch page link data

    // Call the predictions function
    var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_fixtures_by_date?fixture_date="+tommorrows_date);

    useEffect(()=>{
        getGithubSiteContent("mainpages/football-predictions-tomorrow.md").then(data => {  
            setSeoContent(data.page_content);
        })   
    },[])

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
    }else{
        if(renderPredictions.length >0){
            return(
                <div className="sites-card">
                    <div className="container-fluid">
                        <div className="row" style={{backgroundColor: "#edf3f5"}}>
                            <div className="col-md-1 col-2"></div>
                            <div className="col-md-10 col-12">
                                <FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2 url_filter={router.pathname.substring(1)} />
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
                            <SeoContentDisplay props={seo_content}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default TommorrowFixtures;