import React from "react";
import { useRouter } from 'next/router'
import useScrollRestoration from '../functions/useScrollRestoration';
import CountrysPageRenders from "./renders/country-renders";
import LeaguesPageRender from "./renders/leagues-render";
import OtherPagesRenders from "./renders/otherpages-renders";

function RenderData(props) {
    const router = useRouter(); //access page a

    //fetch the device size as a prop value
    var mobile_device = "";
    if(router.pathname.substring(1) == "my-favourite-predictions" || router.pathname.substring(1) == "match/[match-details]" || router.pathname.substring(1)=== "country/[football-prediction-for-country]"
    || router.pathname.substring(1).includes("team/[team-details]" || router.pathname.substring(1).includes("league/[country-name]/[football-prediction-for-league]/fixtures"))) {
        mobile_device = props.isMobile;
    }else{
        mobile_device = props.renderPredictions[0]?.props?.isMobile || false;
    }

    //Restore scroll position after data has been loaded and displayed
    useScrollRestoration(router); 
    
    return (
      <React.Fragment>          
          {router.pathname.substring(1)==="country/[football-prediction-for-country]/fixtures" || router.pathname.substring(1)==="country/[football-prediction-for-country]/results" ?
            <CountrysPageRenders 
              url_name={router.pathname.substring(1)} 
              renderPredictions={props.renderPredictions} 
              isMobile={mobile_device} 
            /> :
            router.pathname.substring(1)==="league/[country-name]/[football-prediction-for-league]/fixtures" || router.pathname.substring(1)==="league/[country-name]/[football-prediction-for-league]/results" ||
            router.pathname.substring(1)==="league/[country-name]/[football-prediction-for-league]/standings" || router.pathname.substring(1)==="league/[country-name]/[football-prediction-for-league]/trends" ?
            <LeaguesPageRender 
              url_name={router.pathname.substring(1)} 
              renderPredictions={props.renderPredictions} 
              isMobile={mobile_device} 
            /> :
            <OtherPagesRenders 
              url_name={router.pathname.substring(1)} 
              renderPredictions={props.renderPredictions} 
              isMobile={mobile_device}
              onLoadMore={props.onLoadMore}
              isLoadingMore={props.isLoadingMore}
              hasMore={props.hasMore}
            />
          }              
      </React.Fragment>
    )
}

export default RenderData;