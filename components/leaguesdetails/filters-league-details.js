import LeagueTabLink from "./league-tab-link";

const FIXTURES_ROUTES = new Set([
  "league/[country-name]/[football-prediction-for-league]/fixtures",
  "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions",
  "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime",
  "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over",
  "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score",
]);

const RESULTS_ROUTES = new Set([
  "league/[country-name]/[football-prediction-for-league]/results",
  "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions",
  "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime",
  "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over",
  "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score",
]);

function FiltersLeagueDetails(props) {
  const basePath = `/league/football-predictions-for-${props.league_url}`;

  return (
    <div className="tabs">
      <div className="tabs__group">
        <LeagueTabLink
          href={`${basePath}/fixtures`}
          active={FIXTURES_ROUTES.has(props.url_filter)}
        >
          Fixtures
        </LeagueTabLink>
        <LeagueTabLink
          href={`${basePath}/results`}
          active={RESULTS_ROUTES.has(props.url_filter)}
        >
          Results
        </LeagueTabLink>
        {props.league_type === "League" ? (
          <LeagueTabLink
            href={`${basePath}/standings`}
            active={
              props.url_filter ===
              "league/[country-name]/[football-prediction-for-league]/standings"
            }
          >
            Standings
          </LeagueTabLink>
        ) : null}
        <LeagueTabLink
          href={`${basePath}/trends`}
          active={
            props.url_filter ===
            "league/[country-name]/[football-prediction-for-league]/trends"
          }
        >
          Trends
        </LeagueTabLink>
      </div>
    </div>
  );
}

export default FiltersLeagueDetails;
