import React, { useState } from "react";
import RenderData from "../shared/render_fixtures_data";
import PagesMatchPredictionDetails from "../shared/pages_match_predictions_details";
import FilterTeamMatchMarkets, {
  TEAM_MARKET_ROUTES,
} from "./filter-team-match-markets";

function TeamMatchPredictions({ gamesData = [], showMarketTabs = true }) {
  const [activeMarket, setActiveMarket] = useState("1x2");
  const marketRoute = TEAM_MARKET_ROUTES[activeMarket] || TEAM_MARKET_ROUTES["1x2"];

  if (!gamesData.length) {
    return null;
  }

  const renderPredictions = PagesMatchPredictionDetails({
    gamesData,
    marketRoute,
  });

  return (
    <>
      {showMarketTabs ? (
        <FilterTeamMatchMarkets
          activeMarket={activeMarket}
          onMarketChange={setActiveMarket}
        />
      ) : null}
      <RenderData
        renderPredictions={renderPredictions}
        marketRoute={marketRoute}
      />
    </>
  );
}

export default TeamMatchPredictions;
