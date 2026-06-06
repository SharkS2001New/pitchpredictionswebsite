// components/teamdetails/upcoming_matches_by_team.js
import React, { useState, useEffect } from "react";
import DataNotFoundPage from "../includes/datanotfound";
import InPagePreLoader from "../includes/inpagepreloader";
import TeamMatchPredictions from "./team_match_predictions";

function FetchUpcomingMatchesByTeam({
    initialFixturesWithPredictions = [],
    status = "success",
    showHeader = true,
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || (status === "" && initialFixturesWithPredictions.length === 0)) {
        return <InPagePreLoader />;
    }

    if (status === "error" && initialFixturesWithPredictions.length === 0) {
        return (
            <>
                <DataNotFoundPage props="Sorry, there isn't enough data available to display at this time." />
                <br />
            </>
        );
    }

    if (initialFixturesWithPredictions.length === 0) {
        return null;
    }

    return (
        <>
            {showHeader ? (
                <div className="text-center fw-bold sectionTitle">
                    <span>UPCOMING MATCHES</span>
                </div>
            ) : null}
            <TeamMatchPredictions gamesData={initialFixturesWithPredictions} />
        </>
    );
}

export default FetchUpcomingMatchesByTeam;
