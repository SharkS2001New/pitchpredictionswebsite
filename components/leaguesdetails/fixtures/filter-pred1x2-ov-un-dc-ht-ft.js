import LeagueTabLink from "../league-tab-link";

const FIXTURES_BASE_ROUTE =
  "league/[country-name]/[football-prediction-for-league]/fixtures";

function FilterLeaguesOverallDoubleChanceUnderOverHTFTPred1x2(props) {
  return (
    <div className="tabs" style={{ margin: "auto" }}>
      <div className="tabs__group">
        <LeagueTabLink
          href={props.my_dynamic_url}
          active={props.url_filter === FIXTURES_BASE_ROUTE}
        >
          Predictions 1X2
        </LeagueTabLink>
        <LeagueTabLink
          href={`${props.my_dynamic_url}/double-chance-predictions`}
          active={
            props.url_filter ===
            "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions"
          }
        >
          &nbsp;Double chance
        </LeagueTabLink>
        <LeagueTabLink
          href={`${props.my_dynamic_url}/predictions-halftime-fulltime`}
          active={
            props.url_filter ===
            "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime"
          }
        >
          &nbsp; HT/FT
        </LeagueTabLink>
        <LeagueTabLink
          href={`${props.my_dynamic_url}/predictions-under-over`}
          active={
            props.url_filter ===
            "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over"
          }
        >
          &nbsp; Over/Under(2.5)
        </LeagueTabLink>
        <LeagueTabLink
          href={`${props.my_dynamic_url}/predictions-both-to-score`}
          active={
            props.url_filter ===
            "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score"
          }
        >
          &nbsp; Both To Score
        </LeagueTabLink>
      </div>
    </div>
  );
}

export default FilterLeaguesOverallDoubleChanceUnderOverHTFTPred1x2;
