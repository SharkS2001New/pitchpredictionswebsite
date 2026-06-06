export const TEAM_MARKET_ROUTES = {
  "1x2": "team-match-predictions",
  "double-chance": "team-match-predictions/double-chance-predictions",
  "ht-ft": "team-match-predictions/predictions-halftime-fulltime",
  "over-under": "team-match-predictions/predictions-under-over",
  "btts": "team-match-predictions/predictions-both-to-score",
};

const MARKET_TABS = [
  { id: "1x2", label: "Predictions 1X2" },
  { id: "double-chance", label: "Double chance" },
  { id: "ht-ft", label: "HT/FT" },
  { id: "over-under", label: "Over/Under(2.5)" },
  { id: "btts", label: "Both To Score" },
];

function FilterTeamMatchMarkets({ activeMarket, onMarketChange }) {
  return (
    <div className="tabs" style={{ margin: "auto" }}>
      <div className="tabs__group">
        {MARKET_TABS.map(({ id, label }) => (
          <a
            key={id}
            href="#"
            className="tabs__tab"
            id={activeMarket === id ? "activeElement1" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onMarketChange(id);
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default FilterTeamMatchMarkets;
