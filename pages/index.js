import React,{useState, useEffect} from "react";
import getFormattedCurrentDate from '../components/functions/GetTodaysDate';
import getGithubSiteContent from '../components/functions/GithubPagesContent';
import DataNotFoundPage from '../components/includes/datanotfound';
import PreLoader from '../components/includes/loader';
import PagesMatchPredictionDetails from '../components/shared/pages_match_predictions_details';
import RenderData from '../components/shared/render_fixtures_data';
import SeoContentDisplay from '../components/shared/seo_content_display';
import { Adsense } from "@ctrl/react-adsense";
import PopularTips from "../components/shared/popular_tips_display";
import WordpressBlogPosts from "../components/shared/wordpress-blog-posts";

export default function Home() {
  let todays_date = getFormattedCurrentDate();
  const[seo_content, setSeoContent] = useState([]);

  //Call the predictions function
  var renderPredictions = PagesMatchPredictionDetails("https://api.pitchpredictions.com/api/fetch_top_winning_predictions?fixture_date="+todays_date);

  useEffect(()=>{
      getGithubSiteContent("mainpages/landing-page.md").then(data => {  
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
  }else if(renderPredictions.length >0){
      return(
        <div className="sites-card">
            <p className="text-center blink_me">Looking for Premium Football Predictions!!!&nbsp;</p>
            <p className="text-center">
                <a href="/auth/login" className="btn btn-danger btn-sm">Subscribe Now</a>
            </p>
            <PopularTips/>
            <RenderData renderPredictions={renderPredictions}/>
            <br/>
            <div className="text-center">
                <a className="btn btn-danger btn-sm" href="https://www.pitchpredictions.com/football-predictions-today" role="button">Football Predictions for Today</a>
            </div>
            <br/>
            <Adsense
                client="ca-pub-5665711413000284"
                slot="3850951453"
                style={{ display: "block" }}
                layout="display"
                format="auto"
            />
            
            <WordpressBlogPosts/>
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
