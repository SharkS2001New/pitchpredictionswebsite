function FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/football-predictions-tomorrow"} className="tabs__tab"
                id={props.url_filter == "football-predictions-tomorrow" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>             
              <a
                href={"/football-predictions-tomorrow/double-chance-predictions"} className="tabs__tab"
                id={props.url_filter == "football-predictions-tomorrow/double-chance-predictions" ? "activeElement1" : ""}
              >
               &nbsp;Double chance
              </a>
              <a
                href={"/football-predictions-tomorrow/predictions-halftime-fulltime"} className="tabs__tab"
                id={props.url_filter == "football-predictions-tomorrow/predictions-halftime-fulltime" ? "activeElement1" : ""}
              >
                &nbsp; HT/FT
              </a>
              <a
                href={"/football-predictions-tomorrow/predictions-under-over"} className="tabs__tab"
                id={props.url_filter == "football-predictions-tomorrow/predictions-under-over" ? "activeElement1" : ""}>
                &nbsp; Over/Under(2.5)
              </a>   
              <a
                href={"/football-predictions-tomorrow/predictions-both-to-score"} className="tabs__tab"
                id={props.url_filter == "football-predictions-tomorrow/predictions-both-to-score" ? "activeElement1" : ""}>
                &nbsp; Both To Score
              </a>            
        </div>
      </div>
    )
}

export default FilterTomorrowsOverallDoubleChanceUnderOverHTFTPred1x2;