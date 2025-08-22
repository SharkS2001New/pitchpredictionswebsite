import React, { useState,useEffect } from "react";
import WinningTrends from "./winning-trends";
import StreaksTrends from "./streak-trends";
import LosesTrends from "./loses-trends";
import CleanSheetTrends from "./cleansheet-trends";
import DrawsTrends from "./draws-trends";
import InPagePreLoader from "../../includes/inpagepreloader";


function FixturesTrends (props) {
   
    let overallData  = props.overallData;

    if(props.endpointStatus === ""){
        return(
            <InPagePreLoader/>
        )   
    }else if(props.endpointStatus === "success") 
    {
        return (
            <React.Fragment>
            <div className="row">
                <div className="text-center fw-bold">
                    <span>TRENDS</span>                     
                </div>
            </div>
            <br/>

            <div className="row">
                <div className="col-md-6 col-6">
                    <div className="text-center fw-bold my-custom-card">
                        {overallData[0].home_team_name}
                    </div>
                </div>
                <div className="col-md-6 col-6">
                    <div className="text-center fw-bold my-custom-card">
                        {overallData[0].away_team_name}
                    </div>
                </div>
            </div>
            <br/>
            <div className="row ">
                <div className="col-md-12">
                    {/* Win Trends*/}
                    <WinningTrends overallData={overallData} url={props.url} />

                    {/* Clean Sheet Trends*/}
                    <CleanSheetTrends overallData={overallData} url={props.url} />

                    {/* Streak Trends*/}
                    <StreaksTrends overallData={overallData} url={props.url} />

                    {/* Draw Trends*/}
                    <DrawsTrends overallData={overallData} url={props.url} />

                    {/* Lose Trends */}
                    <LosesTrends overallData={overallData} url={props.url} />
                </div>
            </div>
            </React.Fragment>
        )
    } else if (props.endpointStatus === "error") {
        return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12">
                    <p>No data found</p>
                </div>
            </div>
        </React.Fragment>
        )
    }
};  

export default FixturesTrends;
