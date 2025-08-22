function FiltersLeagueDetails(props){
    return( 
      <div className="tabs">
        <div className="tabs__group">
              <a
                href={"/league/football-predictions-for-" + props.league_url + "/fixtures"} className="tabs__tab"
                id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/fixtures" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score" ? "activeElement1" : ""}
              >
                Fixtures
              </a>
              <a
                href={"/league/football-predictions-for-" + props.league_url + "/results"} className="tabs__tab"
                id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/results" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over" ||
                props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score" 
                ? "activeElement1" : ""}
              >
                Results
              </a>
              {props.league_type === "League" ?
                <a
                  href={"/league/football-predictions-for-" + props.league_url + "/standings"} className="tabs__tab"
                  id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/standings" ? "activeElement1" : ""}>
                  Standings
                </a>
              : ""}
              <a
                href={"/league/football-predictions-for-" + props.league_url + "/trends"} className="tabs__tab"
                id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/trends" ? "activeElement1" : ""}
              >
                Trends
              </a>
        </div>
      </div>
    )
}

export default FiltersLeagueDetails;