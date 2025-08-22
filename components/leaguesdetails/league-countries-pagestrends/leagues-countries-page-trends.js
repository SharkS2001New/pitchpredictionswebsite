import React, { useState,useEffect } from "react";
import PreLoader from "../../includes/loader";
import CleanSheetTrends from "./cleansheet-trends";
import LosingTrends from "./loses-trends";
import DrawsTrends from "./draws-trends";
import WinningTrends from "./winning-trends";
import StreaksTrends from "./streak-trends";
import { useRouter } from 'next/router'
import DataNotFoundPage from "../../includes/datanotfound";

function LeaguesAndCountriesPageTrends({ overall_data }) {
    const router = useRouter();

    if (overall_data && overall_data.length > 0) {
        const overallDataArray = Array.isArray(overall_data) ? overall_data : JSON.parse(overall_data);
        const firstFixture = overallDataArray[0]?.teams_perfomance_per_fixture ? JSON.parse(overallDataArray[0].teams_perfomance_per_fixture) : null;

        if (firstFixture?.home?.league?.fixtures?.wins?.total > 4 && firstFixture?.away?.league?.fixtures?.wins?.total != null) {
            return (
                <div id="league-trends">
                    <div className="col-sm-12 text-center text-nowrap" style={{ backgroundColor: "#eef7ff", fontWeight: "bold", paddingBottom: "5px" }}>
                        <h2 className="sectionTitle">
                            {router.pathname.includes("/league/") ? `${overallDataArray[0].league_name} Top Trends` : "Top Trends"}
                        </h2>
                    </div>
                    <p className="container text-center">
                        <span style={{ color: "#007bff", fontWeight: "bold", fontSize: "16px" }}>
                            Games Played: {firstFixture.home.league.fixtures.played.total}, Home: {firstFixture.home.league.fixtures.played.home}, Away: {firstFixture.home.league.fixtures.played.away}
                        </span>
                    </p>
                    <WinningTrends overallData={overallDataArray} />
                    <CleanSheetTrends overallData={overallDataArray} />
                    <StreaksTrends overallData={overallDataArray} />
                    <DrawsTrends overallData={overallDataArray} />
                    <LosingTrends overallData={overallDataArray} />
                </div>
            );
        } else if (router.pathname.includes("/trends")) {
            return <DataNotFoundPage props="No trends found for this league" />;
        }
    }
    return null;
}

export default LeaguesAndCountriesPageTrends;
