import React from "react";
import FixturesTrends from "./trends/match-details-trends";
import MatchSummaryStandings from "./match_summary_standings";
import { hasDetailedTrendData } from "./trends/trend_helpers";

function MatchSummaryDisplay({
  match,
  trends = [],
  trendsStatus = "error",
  standings = [],
  homeTeamId,
  awayTeamId,
  leagueName,
  leagueType = "League",
}) {
  const recommendation = match?.predictions?.recommendation;
  const recommendationParagraphs = recommendation
    ? recommendation.split("\n").filter(Boolean)
    : [];

  const showTrends =
    trendsStatus === "success" &&
    trends.length > 0 &&
    hasDetailedTrendData(trends);

  const showStandings =
    leagueType === "League" &&
    Boolean(standings) &&
    (typeof standings === "string"
      ? standings.length > 0
      : Array.isArray(standings)
        ? standings.length > 0
        : false) &&
    homeTeamId &&
    awayTeamId;

  if (
    recommendationParagraphs.length === 0 &&
    !showTrends &&
    !showStandings
  ) {
    return (
      <div className="p-2 fixturesTextSize text-center">
        No summary is available for this fixture yet.
      </div>
    );
  }

  return (
    <div className="p-2">
      {recommendationParagraphs.length > 0 ? (
        <>
          <div className="text-center fw-bold sectionTitle">MATCH SUMMARY</div>
          <div className="fixturesTextSize p-2 mb-3" style={{ lineHeight: 1.6 }}>
            {recommendationParagraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-2 mb-0" : "mb-0"}>
                {paragraph}
              </p>
            ))}
          </div>
        </>
      ) : null}

      {showTrends ? (
        <FixturesTrends
          overallData={trends}
          endpointStatus={trendsStatus}
          url="match/[match-details]/matches"
        />
      ) : null}

      {showStandings ? (
        <MatchSummaryStandings
          standingsData={standings}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          leagueName={leagueName}
        />
      ) : null}
    </div>
  );
}

export default MatchSummaryDisplay;
