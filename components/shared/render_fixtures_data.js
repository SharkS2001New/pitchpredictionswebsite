import React from "react";
import { useRouter } from 'next/router'
import useScrollRestoration from '../functions/useScrollRestoration';
import CountrysPageRenders from "./renders/country-renders";
import LeaguesPageRender from "./renders/leagues-render";
import OtherPagesRenders from "./renders/otherpages-renders";

function RenderData(props) {
    const router = useRouter(); //access page route

    // Restore scroll position after data has been loaded and displayed
    useScrollRestoration(router); 
    
    // Ensure renderPredictions is an array
    const renderPredictionsArray = Array.isArray(props.renderPredictions) 
        ? props.renderPredictions 
        : [];
    
    // Get current path
    const currentPath = router.pathname.substring(1);
    
    // Determine which renderer to use based on route
    const isCountryFixturesOrResults = currentPath === "country/[football-prediction-for-country]/fixtures" || 
                                        currentPath === "country/[football-prediction-for-country]/results";
    
    const isLeaguePage = currentPath === "league/[country-name]/[football-prediction-for-league]/fixtures" || 
                        currentPath === "league/[country-name]/[football-prediction-for-league]/results" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/standings" || 
                        currentPath === "league/[country-name]/[football-prediction-for-league]/trends" ||
                        // League fixture sub-pages (prediction markets)
                        currentPath === "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score" ||
                        
                        currentPath === "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over" ||
                        currentPath === "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score";
    
    return (
        <React.Fragment>          
            {isCountryFixturesOrResults ? (
                <CountrysPageRenders 
                    url_name={currentPath} 
                    renderPredictions={renderPredictionsArray} 
                />
            ) : isLeaguePage ? (
                <LeaguesPageRender 
                    url_name={currentPath} 
                    renderPredictions={renderPredictionsArray} 
                />
            ) : (
                <OtherPagesRenders 
                    url_name={props.marketRoute || currentPath} 
                    renderPredictions={renderPredictionsArray} 
                    onLoadMore={props.onLoadMore}
                    isLoadingMore={props.isLoadingMore}
                    hasMore={props.hasMore}
                />
            )}
        </React.Fragment>
    );
}

export default RenderData;