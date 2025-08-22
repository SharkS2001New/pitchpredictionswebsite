function FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2(props){
  return(
    <div className="tabs" style={{margin: "auto",}}>
      <div className="tabs__group">
            <a
              href={props.my_dynamic_url} className="tabs__tab"
              id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/results" ? "activeElement1" : ""}
            >
              Predictions 1X2
            </a>             
            <a
              href={props.my_dynamic_url+"/double-chance-predictions"} className="tabs__tab"
              id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions" ? "activeElement1" : ""}
            >
             &nbsp;Double chance
            </a>
            <a
              href={props.my_dynamic_url+"/predictions-halftime-fulltime"} className="tabs__tab"
              id={props.url_filter ==  "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime" ? "activeElement1" : ""}
            >
              &nbsp; HT/FT
            </a>
            <a
              href={props.my_dynamic_url+"/predictions-under-over"} className="tabs__tab"
              id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over" ? "activeElement1" : ""}>
              &nbsp; Over/Under(2.5)
            </a>   
            <a
              href={props.my_dynamic_url+"/predictions-both-to-score"} className="tabs__tab"
              id={props.url_filter == "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score" ? "activeElement1" : ""}>
              &nbsp; Both To Score
            </a>            
      </div>
    </div>
  )
}

export default FilterLeaguesResultsOverallDoubleChanceUnderOverHTFTPred1x2;